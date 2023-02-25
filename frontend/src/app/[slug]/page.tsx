import React from "react";
import { notFound } from "next/navigation";

import { Posts } from "@/app/components/PostGrid";
import { getPosts, getSiteConfig } from "@/app/util/api";

import { NewsletterCard, PodcastCard, StreamCard, TextCard } from "./Cards";
import { getPodcastFeed } from "@/app/util/podcast";
import { fetchPage } from "@/app/util/api/pages";

import styles from "@/app/page.module.css";
import { Metadata } from "next";
import { getConfig } from "../util/config";

type PageProps = {
  params: { slug: string; page?: string };
};

export default async function CustomPage({
  params: { slug = "homepage", page = "1" },
}: PageProps): Promise<React.ReactElement> {
  const resp = await fetchPage(slug);
  if (resp.data?.length === 0) {
    return notFound();
  }
  const data = resp.data[0];
  const gridSlots = data.attributes.gridSlots;
  const heroSlots = gridSlots
    .map((slot, idx) =>
      slot.__component === "modules.auto-post" && slot.isHero ? idx : -1
    )
    .filter((n) => n > -1);
  const pinnedPosts = gridSlots
    .map((slot, idx) => {
      if (slot.__component === "modules.auto-post" && slot.pinnedPost.data) {
        return {
          slot: idx,
          post: slot.pinnedPost.data,
        };
      } else {
        return {
          slot: -1,
          post: null,
        };
      }
    })
    .filter((p) => p.slot > -1) as { slot: number; post: App.Post }[];
  const customSlots = (
    await Promise.all(
      gridSlots.map(async (slot, idx) => {
        if (slot.__component === "modules.feed") {
          const feed = await getPodcastFeed(slot.feedUrl);
          return {
            renderCard: () => <PodcastCard feed={feed} />,
            slot: idx,
          };
        } else if (slot.__component === "modules.newsletter") {
          return {
            renderCard: () => <NewsletterCard {...slot} />,
            slot: idx,
          };
        } else if (slot.__component === "modules.text") {
          return {
            renderCard: () => <TextCard {...slot} />,
            slot: idx,
          };
        } else if (slot.__component === "modules.stream") {
          return {
            renderCard: () => <StreamCard {...slot} />,
            slot: idx,
          };
        }
        return {
          renderCard: () => <span></span>,
          slot: -1,
        };
      })
    )
  ).filter((n) => n.slot > -1);
  const heroSlotSize = 4;
  const pageSize =
    gridSlots.length -
    (heroSlots.length * heroSlotSize - 1) -
    customSlots.length -
    pinnedPosts.length;
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    filters: data.attributes.groups.data.length
      ? {
          groups: {
            id: { $in: data.attributes.groups.data.map((group) => group.id) },
          },
        }
      : {},
    pagination: {
      pageSize,
      page: page ? Number(page) : 1,
    },
  });
  return (
    <main className={`${styles.main}`}>
      {slug !== "homepage" && (
        <h2 className={styles.pageHeader}>{data.attributes.title}</h2>
      )}
      <Posts
        slots={gridSlots.length}
        heroSlots={Number(page) === 1 || !page ? heroSlots : []}
        customSlots={customSlots}
        pageUrl={`/${slug}`}
        pagination={posts.meta.pagination}
        pinnedPosts={pinnedPosts}
        posts={(posts.data ?? []).filter(
          (post) => !pinnedPosts.find((pinned) => pinned.post.id === post.id)
        )}
      />
    </main>
  );
}

export async function generateMetadata({
  params: { slug = "homepage", page = "1" },
}: PageProps): Promise<Metadata> {
  const { data } = await fetchPage(slug);
  if (!data || data.length !== 1) {
    return notFound();
  }
  const config = await getConfig();
  const _page = data[0];
  const title =
    slug === "homepage" && Number(page) === 1
      ? config.homepageTitleText
      : _page.attributes.title;
  return {
    title,
    twitter: {
      title,
    },
    openGraph: {
      title: {
        absolute: title,
      },
    },
  };
}

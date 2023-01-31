import { Card, Posts } from "@/app/components/PostGrid";
import { getPosts, makeApiCall } from "@/app/util/api";
import { notFound } from "next/navigation";
import React from "react";

import styles from "@/app/page.module.css";
import { NewsletterCard, PodcastCard } from "./Cards";
import { getPodcastFeed } from "@/app/util/podcast";
import QueryString from "qs";

async function fetchPage(slug: string): Promise<{ data: App.Page[] }> {
  const queryString = QueryString.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    publicationState:
      process.env.NODE_ENV === "development" ? "preview" : "live",
    populate: "*",
  });
  return (await makeApiCall(`/api/pages?${queryString}`)).json();
}

export default async function CustomPage({
  params: { slug = "homepage", page = "1" },
}: {
  params: { slug: string; page?: string };
}): Promise<React.ReactElement> {
  const resp = await fetchPage(slug);
  if (resp.data.length === 0) {
    return notFound();
  }
  const data = resp.data[0];
  const gridSlots = data.attributes.gridSlots;
  const heroSlots = gridSlots
    .map((slot, idx) =>
      slot.__component === "modules.auto-post" && slot.isHero ? idx : -1
    )
    .filter((n) => n > -1);
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
        }
        return {
          renderCard: () => <></>,
          slot: -1,
        };
      })
    )
  ).filter((n) => n.slot > -1);
  const heroSlotSize = 4;
  const pageSize =
    gridSlots.length -
    (heroSlots.length * heroSlotSize - 1) -
    customSlots.length;
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
      <Posts
        slots={gridSlots.length}
        heroSlots={Number(page) === 1 || !page ? heroSlots : []}
        customSlots={customSlots}
        pageUrl={`/${slug}`}
        pagination={posts.meta.pagination}
        posts={posts.data ?? []}
      />
    </main>
  );
}

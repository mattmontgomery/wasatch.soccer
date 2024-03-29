import React, { Fragment, PropsWithChildren, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Relative } from "@/app/components/Post/Published";
import Authors from "@/app/components/Post/Author";
import Streams from "@/app/components/Post/Streams";
import { getPhoto, getPhotoPath } from "@/app/util/api";
import { getPostUrl } from "@/app/util/urls";

import { CommentIcon } from "./Comment";

import Pagination from "./Pagination";

import styles from "./postGrid.module.css";

export function Card({
  children,
  className,
  hero,
}: PropsWithChildren & {
  className?: string;
  hero?: boolean;
}): React.ReactElement {
  return (
    <div
      className={`${styles.post} ${hero ? styles.postHero : ""} ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

export function Post(props: App.Post & { hero?: boolean; slot: number }) {
  const photo = getPhoto(props, props.hero ? "original" : "small");
  const primaryGroup = props.attributes.primaryGroup?.data ?? null;
  return (
    <Card hero={props.hero}>
      <Link
        href={getPostUrl(props)}
        className={photo ? styles.image : styles.noImage}
      >
        {photo && (
          <Image
            quality={80}
            sizes="(max-width: 72rem) 800px,
              (min-width: 72rem) 900px"
            priority={!!props.hero}
            alt={props.attributes.headline}
            src={getPhotoPath(photo.url)}
            fill
          />
        )}
        {props.attributes.commentsEnabled && (
          <span className={styles.comments} aria-label="Comments Enabled">
            <CommentIcon />
          </span>
        )}
        {primaryGroup ? (
          <h5 className={styles.primaryGroup}>
            {primaryGroup.attributes.name}
          </h5>
        ) : (
          <></>
        )}
      </Link>
      <Link href={getPostUrl(props)}>
        <h2 className={styles.headline}>{props.attributes.headline}</h2>
      </Link>
      <div>
        <div
          className={
            props.attributes.streams?.data?.length
              ? styles.streams
              : styles.empty
          }
        >
          {props.attributes.streams?.data?.length ? (
            <Streams {...props} />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.details}>
          {props.attributes.authors.data.length ? (
            <span className={styles.author}>
              <Authors {...props} />
            </span>
          ) : (
            <></>
          )}
          <span className={styles.published}>
            <Relative {...props} />
          </span>
        </div>
      </div>
    </Card>
  );
}

export type Slot = {
  slot: number;
  renderCard: () => React.ReactElement;
};

export function Posts({
  customSlots = [],
  heroSlots = [],
  pageUrl,
  pagination,
  pinnedPosts = [],
  posts,
  postsClassName = "",
  slots = 20,
}: {
  customSlots?: Slot[];
  heroSlots?: number[];
  pageUrl: string;
  pagination?: App.Pagination;
  pinnedPosts?: { slot: number; post: App.Post }[];
  posts: App.Post[];
  postsClassName?: string;
  slots?: number;
}) {
  const Slots = useMemo(() => {
    const SlotsWithCustom = new Array(slots)
      .fill(() => null)
      .map((_, idx) => {
        const customSlot = customSlots.find(
          (customSlot) => customSlot.slot === idx
        );
        if (customSlot) {
          return <Fragment key={idx}>{customSlot.renderCard()}</Fragment>;
        }
        const pinnedPost = pinnedPosts
          .filter(Boolean)
          .find((pin) => pin.slot === idx);
        if (pinnedPost && typeof pinnedPost.slot === "number") {
          return (
            <Post
              hero={heroSlots?.includes(idx)}
              slot={pinnedPost.slot}
              key={idx}
              {...pinnedPost.post}
            />
          );
        }
      });
    let lastUsedPostIdx = 0;
    return SlotsWithCustom.map((slot, idx) => {
      if (!slot && posts.length > lastUsedPostIdx) {
        // find the next unused post
        const post = posts.slice(lastUsedPostIdx, posts.length);
        if (!post[0]) {
          return <React.Fragment key={idx}></React.Fragment>;
        }
        lastUsedPostIdx++;
        return (
          <Post
            {...post[0]}
            hero={heroSlots?.includes(idx)}
            key={idx}
            slot={idx}
          />
        );
      }
      return slot;
    });
  }, [slots, customSlots, heroSlots, posts, pinnedPosts]);
  const showPagination =
    pagination && (pagination.pageCount > 1 || pagination.page > 1);
  return (
    <>
      <section className={`${styles.posts} ${postsClassName}`}>{Slots}</section>
      {showPagination && (
        <Pagination
          pagination={pagination}
          renderLink={(page, text) => (
            <Link href={`${pageUrl}/${page}`}>{text ?? page}</Link>
          )}
        />
      )}
    </>
  );
}

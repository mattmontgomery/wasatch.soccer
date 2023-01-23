import Image from "next/image";
import Link from "next/link";
import { Relative } from "@/app/components/Post/Published";
import Authors from "@/app/components/Post/Author";
import { getPathname, getPhoto, getPhotoPath } from "@/app/util/api";
import styles from "./postGrid.module.css";
import React, { PropsWithChildren, useMemo } from "react";

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
      className={`${styles.post} ${hero ? styles.postHero : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Post(props: App.Post & { hero?: boolean }) {
  const photo = getPhoto(props, props.hero ? "large" : "medium");
  const primaryGroup = props.attributes.primaryGroup?.data ?? null;
  return (
    <Card hero={props.hero}>
      <Link
        href={getPathname(props)}
        className={photo ? styles.image : styles.noImage}
      >
        {photo && (
          <span>
            <Image
              alt={props.attributes.headline}
              src={getPhotoPath(photo.url)}
              fill
            />
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
      <Link href={getPathname(props)}>
        <h2 className={styles.headline}>{props.attributes.headline}</h2>
      </Link>
      <span className={styles.details}>
        <span className={styles.author}>
          <Authors {...props} />
        </span>
        <span className={styles.published}>
          <Relative {...props} />
        </span>
      </span>
    </Card>
  );
}

export function Posts({
  posts,
  customSlots = [],
  slots = 20,
  heroSlots = [],
}: {
  customSlots: {
    slot: number;
    renderCard: () => React.ReactElement;
  }[];
  heroSlots?: number[];
  posts: App.Post[];
  slots: number;
}) {
  const Slots = useMemo(() => {
    const SlotsWithCustom = new Array(slots)
      .fill(() => null)
      .map((_, idx) => {
        const customSlot = customSlots.find(
          (customSlot) => customSlot.slot === idx
        );
        if (customSlot) {
          return (
            <React.Fragment key={idx}>{customSlot.renderCard()}</React.Fragment>
          );
        }
      });
    let lastUsedPostIdx = 0;
    return SlotsWithCustom.map((slot, idx) => {
      if (!slot && posts.length > lastUsedPostIdx) {
        // find the next unused post
        const post = posts.slice(lastUsedPostIdx, posts.length);
        if (!post[0]) {
          return <></>;
        }
        lastUsedPostIdx++;
        return <Post {...post[0]} hero={heroSlots?.includes(idx)} key={idx} />;
      }
      return slot;
    });
  }, [slots, customSlots, heroSlots, posts]);
  return <section className={styles.posts}>{Slots}</section>;
}

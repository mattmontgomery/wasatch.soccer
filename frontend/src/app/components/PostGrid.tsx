import Image from "next/image";
import Link from "next/link";
import { Relative } from "@/app/components/Post/Published";
import Authors from "@/app/components/Post/Author";
import Streams from "@/app/components/Post/Streams";
import { getPathname, getPhoto, getPhotoPath } from "@/app/util/api";
import styles from "./postGrid.module.css";
import { Fragment, PropsWithChildren, useMemo } from "react";
import Pagination from "./Pagination";

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

export function Post(props: App.Post & { hero?: boolean; slot: number }) {
  const photo = getPhoto(props, props.hero ? "large" : "medium");
  const primaryGroup = props.attributes.primaryGroup?.data ?? null;
  return (
    <Card hero={props.hero}>
      <Link
        href={getPathname(props)}
        className={photo ? styles.image : styles.noImage}
      >
        {photo && (
          <Image
            sizes="(max-width: 72rem) 100vw
              33vw"
            priority={!!props.hero}
            alt={props.attributes.headline}
            src={getPhotoPath(photo.url)}
            fill
          />
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

export function Posts({
  customSlots = [],
  heroSlots = [],
  pageUrl,
  pagination,
  posts,
  slots = 20,
}: {
  customSlots?: {
    slot: number;
    renderCard: () => React.ReactElement;
  }[];
  heroSlots?: number[];
  pageUrl: string;
  pagination?: App.Pagination;
  posts: App.Post[];
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
  }, [slots, customSlots, heroSlots, posts]);
  const showPagination =
    pagination && (pagination.pageCount > 1 || pagination.page > 1);
  return (
    <>
      <section className={styles.posts}>{Slots}</section>
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

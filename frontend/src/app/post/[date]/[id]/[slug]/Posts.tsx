"use client";
import { getPathname, getPhoto, getPhotoPath, getPosts } from "@/app/util/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./postPage.module.css";

export default function Posts({
  posts,
}: {
  posts: App.Post[];
}): React.ReactElement {
  const pathname = usePathname();
  return (
    <div className={styles.posts}>
      {posts
        ?.filter((post) => getPathname(post) !== pathname)
        .map((post, idx) => (
          <Post {...post} key={idx} />
        ))}
    </div>
  );
}

function Post(props: App.Post): React.ReactElement {
  const photo = getPhoto(props, "small");
  return (
    <Link href={getPathname(props)} className={styles.postCard}>
      <div className={styles.postCardImage}>
        {photo && (
          <Image
            alt={props.attributes.headline}
            src={getPhotoPath(photo.url)}
            fill
          />
        )}
      </div>
      <div className={styles.postCardHeadline}>{props.attributes.headline}</div>
    </Link>
  );
}

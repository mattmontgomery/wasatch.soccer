import { getPathname, getPhoto, getPhotoPath, getPosts } from "@/app/util/api";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "@/app/styles/post.module.css";

export default function Posts({
  posts,
}: {
  posts: App.Post[];
}): React.ReactElement {
  return (
    <div className={styles.posts}>
      {posts.map((post, idx) => (
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
            sizes="(max-width: 72rem) 100vw
            33vw"
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

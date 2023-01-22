import Image from "next/image";
import Link from "next/link";
import { Relative } from "@/app/components/Post/Published";
import Authors from "@/app/components/Post/Author";
import { getPathname, getPhoto, getPhotoPath } from "@/app/util/api";
import styles from "./postGrid.module.css";

export function Post(props: App.Post) {
  const photo = getPhoto(props, "medium");
  const primaryGroup = props.attributes.primaryGroup?.data ?? null;
  return (
    <div className={styles.post}>
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
    </div>
  );
}

export function Posts({ posts }: { posts: App.Post[] }) {
  return (
    <section className={styles.posts}>
      {posts?.map((post, idx) => (
        <Post {...post} key={idx} />
      ))}
    </section>
  );
}

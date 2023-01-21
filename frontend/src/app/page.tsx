import Image from "next/image";
import { Alexandria } from "@next/font/google";
import styles from "./page.module.css";
import { getPathname, getPhoto, getPhotoPath, getPosts } from "./util/api";
import Link from "next/link";
import { Relative } from "./components/Published";
import Authors from "./components/Author";

export default async function Home() {
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    pagination: { pageSize: 25 },
  });
  return (
    <main className={`${styles.main}`}>
      <section className={styles.posts}>
        {posts?.data?.map((post, idx) => (
          <Post {...post} key={idx} />
        ))}
      </section>
    </main>
  );
}

function Post(props: App.Post) {
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

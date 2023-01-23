import { notFound } from "next/navigation";

import { Posts } from "@/app/components/PostGrid";
import { getPosts, getStream } from "@/app/util/api";

import styles from "@/app/page.module.css";

export default async function AuthorsPage({
  params: { id },
}: {
  params: { id: string; slug: string };
}) {
  const stream = await getStream(Number(id));
  if (!stream.data) {
    notFound();
  }
  const posts = await getPosts({
    filters: {
      streams: {
        id: {
          $eq: Number(id),
        },
      },
    },
  });
  return (
    <main className={`${styles.main}`}>
      <h2 className={styles.pageHeader}>{stream.data.attributes.name}</h2>
      <Posts posts={posts.data ?? []} />
    </main>
  );
}

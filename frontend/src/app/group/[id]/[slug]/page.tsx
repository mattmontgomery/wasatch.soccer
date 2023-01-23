import { notFound } from "next/navigation";

import { Posts } from "@/app/components/PostGrid";
import { getGroup, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";

export default async function AuthorsPage({
  params: { id },
}: {
  params: { id: string; slug: string };
}) {
  const posts = await getPosts({
    filters: {
      groups: {
        id: {
          $eq: Number(id),
        },
      },
    },
  });
  const author = await getGroup(Number(id));
  if (!author.data) {
    notFound();
  }
  return (
    <main className={`${styles.main}`}>
      <h2 className={styles.pageHeader}>{author.data.attributes.name}</h2>
      <Posts posts={posts.data ?? []} />
    </main>
  );
}

import { notFound } from "next/navigation";

import { Posts } from "@/app/components/PostGrid";
import { getGroup, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";

export default async function AuthorsPage({
  params: { id },
  searchParams: { page = 1 },
}: {
  params: { id: string; slug: string };
  searchParams: { page: number };
}) {
  const group = await getGroup(Number(id));
  if (!group.data) {
    notFound();
  }
  const posts = await getPosts({
    filters: {
      groups: {
        id: {
          $eq: Number(id),
        },
      },
    },
    pagination: {
      pageSize: 9,
      page: isNaN(Number(page)) ? 1 : Number(page),
    },
  });
  return (
    <main className={`${styles.main}`}>
      <h2 className={styles.pageHeader}>{group.data.attributes.name}</h2>
      <Posts
        posts={posts.data ?? []}
        pageUrl={`/group/${id}/${group.data.attributes.slug}`}
        pagination={posts.meta.pagination}
      />
    </main>
  );
}

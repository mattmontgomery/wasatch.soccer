import { notFound } from "next/navigation";

import { Posts } from "@/app/components/PostGrid";
import { getGroup, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";
import { Metadata } from "next";

type PageProps = {
  params: { id: string; slug: string[] };
};

export default async function AuthorsPage({
  params: { id, slug: _slug },
}: PageProps) {
  const [slug, _page] = _slug;
  const page = isNaN(Number(_page)) ? 1 : Number(_page);
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
      page,
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

export async function generateMetadata({
  params: { id, slug: _slug },
}: PageProps): Promise<Metadata> {
  const group = await getGroup(Number(id));
  if (!group.data) {
    notFound();
  }
  const title = group.data.attributes.name;
  return {
    title,
    twitter: {
      title,
    },
    openGraph: {
      title: {
        absolute: title,
      },
    },
  };
}

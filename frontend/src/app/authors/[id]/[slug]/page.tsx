import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Posts } from "@/app/components/PostGrid";
import { getAuthor, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";
import textStyles from "@/app/text.module.css";

export default async function AuthorsPage({
  params: { id, slug },
  searchParams,
}: {
  params: { id: string; slug: string };
  searchParams?: { page: string };
}) {
  const page = searchParams?.page ?? 1;
  const author = await getAuthor(Number(id));
  if (!author.data) {
    notFound();
  }
  const posts = await getPosts({
    filters: {
      authors: {
        id: {
          $eq: Number(id),
        },
        slug: {
          $eq: slug,
        },
      },
    },
    pagination: {
      pageSize: 9,
      page: isNaN(Number(page)) ? 1 : Number(page),
    },
  });
  return (
    <main
      className={`${styles.main} ${
        author.data.attributes.bio ? styles.main4 : ""
      }`}
    >
      <h2 className={styles.pageHeader}>{author.data.attributes.name}</h2>
      {author.data.attributes.bio && (
        <section className={textStyles.body}>
          <ReactMarkdown>{author.data.attributes.bio}</ReactMarkdown>
        </section>
      )}
      <Posts
        posts={posts.data ?? []}
        pageUrl={`/author/${id}/${author.data.attributes.slug}`}
        pagination={posts.meta.pagination}
      />
    </main>
  );
}

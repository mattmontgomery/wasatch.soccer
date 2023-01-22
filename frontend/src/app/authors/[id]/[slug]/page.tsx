import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Posts } from "@/app/components/PostGrid";
import { getAuthor, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";
import textStyles from "@/app/text.module.css";

export default async function AuthorsPage({
  params: { id, slug },
}: {
  params: { id: string; slug: string };
}) {
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
  });
  const author = await getAuthor(Number(id));
  if (!author.data) {
    notFound();
  }
  return (
    <main className={`${styles.main}`}>
      <h2 className={styles.pageHeader}>{author.data.attributes.name}</h2>
      {author.data.attributes.bio && (
        <section className={textStyles.body}>
          <ReactMarkdown>{author.data.attributes.bio}</ReactMarkdown>
        </section>
      )}
      <Posts posts={posts.data ?? []} />
    </main>
  );
}

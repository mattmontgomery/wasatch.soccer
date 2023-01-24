import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Posts } from "@/app/components/PostGrid";
import { getPosts, getStream } from "@/app/util/api";

import styles from "@/app/page.module.css";
import textStyles from "@/app/text.module.css";

export default async function AuthorsPage({
  params: { id, slug: _slug },
}: {
  params: { id: string; slug: string[] };
}) {
  const [, _page] = _slug;
  const page = isNaN(Number(_page)) ? 1 : Number(_page);
  const stream = await getStream(Number(id));
  if (!stream.data) {
    return notFound();
  }
  const posts = await getPosts({
    filters: {
      streams: {
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
      <h2 className={styles.pageHeader}>{stream.data.attributes.name}</h2>
      {stream.data.attributes.body && (
        <section className={textStyles.body}>
          <ReactMarkdown>{stream.data.attributes.body}</ReactMarkdown>
        </section>
      )}

      <Posts
        posts={posts.data ?? []}
        pageUrl={`/streams/${id}/${stream.data.attributes.slug}`}
        pagination={posts.meta.pagination}
      />
    </main>
  );
}

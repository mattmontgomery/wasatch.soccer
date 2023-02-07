import { cache } from "react";
import MeiliSearch from "meilisearch";

import { Posts } from "../../components/PostGrid";
import { convertHitsToPosts, PostHit } from "@/app/util/api/posts";

import styles from "@/app/page.module.css";
import Search from "@/app/components/Search";
import { Metadata } from "next";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST ?? "",
  apiKey: process.env.MEILISEARCH_KEY ?? "",
});

const search = cache(async (query: string) => {
  const postsIndex = client.index(process.env.MEILISEARCH_POST_INDEX ?? "post");
  const { hits } = await postsIndex.search<PostHit>(query, {
    hitsPerPage: 12,
    limit: 12,
    sort: ["published:desc", "publishedAt:desc"],
    q: query,
    matchingStrategy: "all",
  });
  const posts = convertHitsToPosts(hits);
  return posts;
});

type PageProps = {
  params: {
    slug: string[];
  };
};

export default async function SearchPage({
  params: { slug = [] },
}: PageProps): Promise<React.ReactElement> {
  const query = decodeURI(slug[0] ? String(slug[0]) : "");
  const posts = await search(query);
  return (
    <div className={`${styles.main} ${styles.main4}`}>
      <h2 className={styles.pageHeader}>Search Results</h2>
      <Search value={query} />
      <Posts posts={posts} pageUrl={`/search?q=${query}`} />
      <div></div>
    </div>
  );
}

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const query = decodeURI(slug[0] ? String(slug[0]) : "");
  const title = `${query} | Search Results`;
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

import { cache } from "react";
import { algoliasearch } from "algoliasearch";

import { Posts } from "../../components/PostGrid";
import { convertHitsToPosts, PostHit } from "@/app/util/api/posts";

import styles from "@/app/page.module.css";
import Search from "@/app/components/Search";
import { Metadata } from "next";

const searchClient = algoliasearch(
  String(process.env.ALGOLIA_PROVIDER_APPLICATION_ID),
  String(process.env.ALGOLIA_PROVIDER_SEARCH_KEY)
);

const search = cache(async (query: string) => {
  const results = await searchClient.searchSingleIndex<PostHit>({
    indexName: process.env.ALGOLIA_POST_INDEX ?? "wss_posts",
    searchParams: {
      query,
      page: 0,
      hitsPerPage: 12,
    },
  });
  const posts = convertHitsToPosts(results.hits);
  return posts;
});

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function SearchPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug = [] } = await params;
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
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
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
    robots: {
      index: false,
      follow: true,
    },
  };
}

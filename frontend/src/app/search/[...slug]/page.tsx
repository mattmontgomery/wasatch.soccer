import MeiliSearch from "meilisearch";
import { Posts } from "../../components/PostGrid";
import { convertHitsToPosts, PostHit, PostHits } from "../../util/api/posts";

import styles from "@/app/page.module.css";
import Search from "@/app/components/Search";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST ?? "",
  apiKey: process.env.MEILISEARCH_KEY ?? "",
});

export default async function SearchPage({
  params: { slug = [] },
}: {
  params: {
    slug: string[];
  };
}): Promise<React.ReactElement> {
  const query = slug[0] ?? 0;
  const postsIndex = client.index(process.env.MEILISEARCH_POST_INDEX ?? "post");
  const { hits } = await postsIndex.search<PostHit>(query, {
    hitsPerPage: 12,
    limit: 12,
    sort: ["published:desc", "publishedAt:desc"],
    q: query,
    matchingStrategy: "all",
  });
  const posts = convertHitsToPosts(hits);
  return (
    <div className={`${styles.main} ${styles.main4}`}>
      <h2 className={styles.pageHeader}>Search Results</h2>
      <Search value={query} />
      <Posts posts={posts} pageUrl={`/search?q=${query}`} />
      <div></div>
    </div>
  );
}

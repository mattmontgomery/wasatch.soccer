import styles from "./page.module.css";
import { Posts } from "./components/PostGrid";
import { getPosts } from "./util/api";

export default async function Home() {
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    pagination: { pageSize: 25 },
  });
  return (
    <main className={`${styles.main}`}>
      <Posts posts={posts.data ?? []} />
    </main>
  );
}

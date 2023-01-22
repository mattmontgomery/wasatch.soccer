import { getPosts } from "@/app/util/api";
import pageStyles from "@/app/page.module.css";
import styles from "./postPage.module.css";
import Posts from "./Posts";

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPosts({
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 5 },
  });
  return (
    <main className={`${styles.main} ${pageStyles.main}`}>
      <div className={styles.post}>{children}</div>
      <div className={styles.rightRail}>
        <h3>Latest News</h3>
        <Posts posts={posts.data} />
      </div>
    </main>
  );
}

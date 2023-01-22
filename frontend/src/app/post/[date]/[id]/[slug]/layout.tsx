import { getPosts } from "@/app/util/api";
import pageStyles from "@/app/page.module.css";
import styles from "./postPage.module.css";
import Posts from "./Posts";

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`${styles.main} ${pageStyles.main}`}>{children}</main>
  );
}

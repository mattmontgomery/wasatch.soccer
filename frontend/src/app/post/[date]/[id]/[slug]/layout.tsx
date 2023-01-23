import pageStyles from "@/app/page.module.css";
import styles from "./page.module.css";

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={`${styles.main} ${pageStyles.main}`}>{children}</main>
  );
}

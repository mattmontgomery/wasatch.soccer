import { getAuthors } from "../util/api";

import pageStyles from "@/app/page.module.css";
import styles from "./page.module.css";
import Link from "next/link";

export default async function MastheadPage(): Promise<React.ReactElement> {
  const authors = await getAuthors();
  return (
    <main className={pageStyles.main}>
      <h2 className={pageStyles.pageHeader}>Masthead</h2>
      <div className={styles.grid}>
        {authors.data.map((author, idx) => (
          <div key={idx}>
            <h3>
              <Link href={`/authors/${author.id}/${author.attributes.slug}`}>
                {author.attributes.name}
              </Link>
            </h3>
            <h5>{author.attributes.title}</h5>
          </div>
        ))}
      </div>
    </main>
  );
}

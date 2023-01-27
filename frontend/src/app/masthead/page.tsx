import { getAuthors } from "../util/api";

import pageStyles from "@/app/page.module.css";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default async function MastheadPage(): Promise<React.ReactElement> {
  const authors = await getAuthors({
    displayOnMasthead: true,
  });
  return (
    <main className={pageStyles.main}>
      <h2 className={pageStyles.pageHeader}>Masthead</h2>
      <div className={styles.grid}>
        {authors.data?.map((author, idx) => (
          <div key={idx}>
            <h3>
              <Link href={`/authors/${author.id}/${author.attributes.slug}`}>
                {author.attributes.name}
              </Link>
            </h3>
            <h5>{author.attributes.title}</h5>
            <div className={styles.photo}>
              {author.attributes.photo.data && (
                <Image
                  alt={author.attributes.name}
                  src={
                    author.attributes.photo.data.attributes.formats.medium
                      ?.url ?? author.attributes.photo.data.attributes.url
                  }
                  fill
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

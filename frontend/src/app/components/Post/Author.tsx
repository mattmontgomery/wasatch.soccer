import Link from "next/link";
import styles from "@/app/styles/post.module.css";

export default function Authors(props: App.Post) {
  const authors = props.attributes.authors?.data;

  return authors.length ? (
    <>
      <span className={styles.commaSeparatedList}>
        by{" "}
        {authors.map((author, idx) => (
          <span key={idx} itemProp="author">
            <Link
              prefetch={false}
              href={`/authors/${author.id}/${author.attributes.slug}`}
              rel="author"
            >
              {author.attributes.name}
            </Link>
          </span>
        ))}
      </span>
    </>
  ) : (
    <></>
  );
}

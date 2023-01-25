import Link from "next/link";
import styles from "@/app/styles/post.module.css";

export default function Authors(props: App.Post) {
  const streams = props.attributes.streams?.data ?? [];

  return streams.length ? (
    <span className={styles.commaSeparatedList}>
      {streams.map((stream, idx) => (
        <span key={idx}>
          <Link href={`/streams/${stream.id}/${stream.attributes.slug}`}>
            {stream.attributes.name}
          </Link>
        </span>
      ))}
    </span>
  ) : (
    <></>
  );
}

import Link from "next/link";
import styles from "@/app/styles/post.module.css";

export default function Groups(props: App.Post) {
  const groups = props.attributes.groups?.data;

  return groups.length ? (
    <span className={styles.commaSeparatedList}>
      {groups.map((group, idx) => (
        <span key={idx}>
          <Link
            href={`/group/${group.id}/${group.attributes.slug}`}
            prefetch={false}
          >
            {group.attributes.name}
          </Link>
        </span>
      ))}
    </span>
  ) : (
    <></>
  );
}

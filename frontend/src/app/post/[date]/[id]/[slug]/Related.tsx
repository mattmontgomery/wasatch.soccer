import styles from "@/app/styles/text.module.css";
import { getPostUrl } from "@/app/util/urls";
import Link from "next/link";

export default function Related({
  relatedPosts,
}: {
  relatedPosts: App.RelatedPost[];
}): React.ReactElement {
  return (
    <aside className={styles.postModule}>
      <h5>Read More</h5>
      <div className={styles.relatedBody}>
        {relatedPosts.map((post, idx) => (
          <div key={idx}>
            <Link href={getPostUrl(post)}>{post.attributes.headline}</Link>
          </div>
        ))}
      </div>
    </aside>
  );
}

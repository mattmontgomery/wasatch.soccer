import ReactMarkdown from "react-markdown";
import Link from "next/link";

import styles from "@/app/styles/text.module.css";

export default function TextModule({
  postModule,
}: {
  postModule: App.PostModule;
}): React.ReactElement {
  return (
    <aside className={styles.postModule}>
      <h5>{postModule.attributes.title}</h5>
      <div className={styles.postModuleBody}>
        <ReactMarkdown>{postModule.attributes.body}</ReactMarkdown>
      </div>
      <Link
        href={postModule.attributes.url}
        className={styles.postModuleAction}
      >
        {postModule.attributes.actionText}
      </Link>
    </aside>
  );
}

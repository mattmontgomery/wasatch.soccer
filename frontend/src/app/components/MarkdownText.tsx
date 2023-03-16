import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./markdownText.module.css";

export default function MarkdownText(
  props: {
    children: string;
  } & Options
): React.ReactElement {
  return (
    <div className={styles.markdownText}>
      <ReactMarkdown {...props} remarkPlugins={[remarkGfm]} />
    </div>
  );
}

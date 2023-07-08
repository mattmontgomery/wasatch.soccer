import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./markdownText.module.css";
import rehypeRaw from "rehype-raw";

export default function MarkdownText(
  props: {
    children: string;
  } & Options
): React.ReactElement {
  return (
    <div className={styles.markdownText}>
      <ReactMarkdown
        {...props}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      />
    </div>
  );
}

import pageStyles from "./page.module.css";
import postStyles from "@/app/styles/post.module.css";

export default function Loading() {
  return <main className={`${postStyles.main} ${pageStyles.main}`}></main>;
}

"use client";

import useSWR from "swr";
import styles from "@/app/styles/post.module.css";

import { TwitterEmbed } from "react-social-media-embed";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Embed({ url }: { url: string }): React.ReactElement {
  const { data, error, isLoading } = useSWR(`/api/embed?url=${url}`, fetcher);

  if (isLoading || error || !data) {
    return <p>{url}</p>;
  }
  if (data.data.provider_name === "Twitter") {
    return (
      <div className={styles.embed}>
        <TwitterEmbed url={data.data.url} />
      </div>
    );
  }
  return (
    <div
      className={styles.embed}
      dangerouslySetInnerHTML={{ __html: data.data?.html }}
    />
  );
}

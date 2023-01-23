"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "@/app/styles/post.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Embed({ url }: { url: string }): React.ReactElement {
  const { data, error, isLoading } = useSWR(`/api/embed?url=${url}`, fetcher);

  return isLoading || error || !data ? (
    <p>{url}</p>
  ) : (
    <div
      className={styles.embed}
      dangerouslySetInnerHTML={{ __html: data?.data?.html }}
    />
  );
}

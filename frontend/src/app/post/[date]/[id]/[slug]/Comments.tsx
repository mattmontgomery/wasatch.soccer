"use client";

import Script from "next/script";

export default function Comments({
  postId,
}: {
  postId: number;
}): React.ReactElement {
  return (
    <>
      <Script
        defer
        src="https://cdn.commento.io/js/commento.js"
        data-no-fonts="true"
        data-page-id={`post:${postId}`}
        strategy="afterInteractive"
      ></Script>
    </>
  );
}

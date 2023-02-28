"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function Comments({
  postId,
}: {
  postId: number;
}): React.ReactElement {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);
  return (
    <>
      {mounted && (
        <Script
          defer
          src="https://cdn.commento.io/js/commento.js"
          data-no-fonts="true"
          data-page-id={`post:${postId}`}
          strategy="afterInteractive"
        ></Script>
      )}
    </>
  );
}

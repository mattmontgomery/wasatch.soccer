"use client";

import React, { useEffect } from "react";

const COMMENTO_URL = `https://cdn.commento.io/js/commento.js`;

export default function Commento({
  pageId,
}: {
  pageId: string;
}): React.ReactElement {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = COMMENTO_URL;
    script.defer = true;
    script.setAttribute("data-auto-init", "true");
    script.setAttribute("data-no-fonts", "true");
    script.setAttribute("data-page-id", pageId);
    document.body.appendChild(script);
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [pageId]);
  return (
    <>
      <div id="commento-box" />
    </>
  );
}

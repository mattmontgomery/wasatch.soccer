"use client";

import React, { useEffect } from "react";

export default function Commento({
  pageId,
}: {
  pageId: string;
}): React.ReactElement {
  useEffect(() => {
    var d = document,
      s = d.createElement("script");
    s.src = "https://talk.tools.football/assets/js/embed.js";
    s.async = false;
    s.defer = true;
    s.onload = function () {
      // @ts-expect-error any
      Coral.createStreamEmbed({
        id: "coral_thread",
        autoRender: true,
        rootURL: "https://talk.tools.football",
        customCSSURL: "https://talk-static.tools.football/wasatch.soccer.css",
        // Uncomment these lines and replace with the ID of the
        // story's ID and URL from your CMS to provide the
        // tightest integration. Refer to our documentation at
        // https://docs.coralproject.net for all the configuration
        // options.
        storyID: pageId,
        // storyURL: '${storyURL}',
      });
    };
    (d.head || d.body).appendChild(s);
    return () => {
      if (s) {
        s.remove();
        // document.querySelector("#coral_thread")?.remove();
      }
    };
  }, [pageId]);
  return (
    <>
      <div className="talk-root">
        <div id="coral_thread" />
      </div>
    </>
  );
}

"use client";

import { useEffect } from "react";

export default function LiveBlog(props: { id?: string }): React.ReactElement {
  useEffect(() => {
    setTimeout(() => {
      if (!document.querySelector("#LB24")) {
        location.reload();
      }
    }, 5000);
  }, [props.id]);
  return !props.id ? (
    <></>
  ) : (
    <div key={props.id}>
      <div
        dangerouslySetInnerHTML={{
          __html: `<div id="LB24_LIVE_CONTENT" data-eid=${`${props.id}`} /><script async src="https://v.24liveblog.com/24.js"></script>`,
        }}
      />
    </div>
  );
}

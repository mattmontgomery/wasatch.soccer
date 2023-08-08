"use client";

import { useEffect } from "react";

export default function LiveBlog(props: { id?: string }): React.ReactElement {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://v.24liveblog.com/24.js`;
    script.async = true;
    document.body.appendChild(script);
    setTimeout(() => {
      window.dispatchEvent(new Event("load"));
    }, 100);
    return () => {
      script.remove();
      document.body
        .querySelector("[src='https://cdn.24liveblog.com/live-js/js/24.js']")
        ?.remove();
      document.body
        .querySelector("[src='https://chat.24liveblog.com/chat.js']")
        ?.remove();
      document.body
        .querySelector(
          "[src='https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js']"
        )
        ?.remove();
    };
  }, [props.id]);
  return !props.id ? (
    <></>
  ) : (
    <div key={props.id}>
      <div id="LB24_LIVE_CONTENT" data-eid={props.id} />
    </div>
  );
}

import styles from "@/app/styles/post.module.css";

import { TwitterEmbed } from "react-social-media-embed";
import { extract } from "@extractus/oembed-extractor";

export async function Embed({ url }: { url: string }) {
  const embedCode = url
    ? await extract(url, { maxwidth: 720, maxheight: 480 })
    : null;

  // if (isLoading || error || !data || data.errors?.length) {
  //   return (
  //     <p>
  //       <a href={url}>Embed: {url}</a>
  //     </p>
  //   );
  // }
  // if (data.data.provider_name === "Twitter") {
  //   return (
  //     <div className={styles.embed}>
  //       <TwitterEmbed url={data.data.url} />
  //     </div>
  //   );
  // }
  return embedCode && "html" in embedCode ? (
    <div
      className={styles.embed}
      dangerouslySetInnerHTML={{ __html: embedCode.html as string }}
    />
  ) : (
    <div>
      <a href={url}>Embed failed to load. Try {url}</a>
    </div>
  );
}

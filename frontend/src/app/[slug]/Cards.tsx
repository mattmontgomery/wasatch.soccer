import { Card } from "@/app/components/PostGrid";
import { getPodcastFeed } from "@/app/util/podcast";

import styles from "@/app/page.module.css";
import homepageStyles from "@/app/styles/homepage.module.css";
import podcastStyles from "@/app/styles/podcast.module.css";
import type { Podcast } from "podparse";

export function PodcastCard({ feed }: { feed: Podcast }) {
  return (
    <Card className={`${homepageStyles.card} ${homepageStyles.alternate}`}>
      <h2>Podcast</h2>
      <h4>Latest episodes</h4>
      <ul className={podcastStyles.list}>
        {feed.episodes.slice(0, 5).map((ep, idx) => (
          <li key={idx}>{ep.title}</li>
        ))}
      </ul>
      <a
        className={homepageStyles.subscribe}
        href={feed.meta.link}
        target="_blank"
        rel="noreferrer"
      >
        Subscribe
      </a>
    </Card>
  );
}
export function NewsletterCard({ title, body, url }: App.GridSlots.Newsletter) {
  return (
    <Card className={`${homepageStyles.card}`}>
      <h2>{title}</h2>
      <p>{body}</p>
      <p></p>
      <a
        className={homepageStyles.subscribe}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        Subscribe
      </a>
    </Card>
  );
}

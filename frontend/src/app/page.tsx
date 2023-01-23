import styles from "./page.module.css";
import { Card, Posts } from "./components/PostGrid";
import { getPosts } from "./util/api";
import { getPodcastFeed } from "./util/podcast";

import podcastStyles from "@/app/styles/podcast.module.css";

export default async function Home() {
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    pagination: { pageSize: 25 },
  });
  const feed = await getPodcastFeed(`https://feeds.megaphone.fm/rsl-soapbox`);
  return (
    <main className={`${styles.main}`}>
      <Posts
        slots={10}
        posts={posts.data ?? []}
        heroSlots={[0]}
        customSlots={[
          {
            slot: 5,
            renderCard: () => {
              return (
                <Card className={podcastStyles.card}>
                  <h2>Podcast</h2>
                  <h4>Latest episodes</h4>
                  <ul className={podcastStyles.list}>
                    {feed.episodes.slice(0, 5).map((ep, idx) => (
                      <li key={idx}>{ep.title}</li>
                    ))}
                  </ul>
                  <button>Subscribe</button>
                </Card>
              );
            },
          },
        ]}
      />
    </main>
  );
}

import styles from "./page.module.css";
import { Card, Posts } from "./components/PostGrid";
import { getPosts } from "./util/api";
import { getPodcastFeed } from "./util/podcast";

import podcastStyles from "@/app/styles/podcast.module.css";
import { getConfig } from "./util/config";

export default async function Home({
  params: { page: _page },
}: {
  params: { page?: string };
}) {
  const page = isNaN(Number(_page)) ? 1 : Number(_page);
  const config = await getConfig();
  const slotCount = 18;
  const customSlots = [
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
            <a
              className={podcastStyles.subscribe}
              href={feed.meta.link}
              target="_blank"
              rel="noreferrer"
            >
              Subscribe
            </a>
          </Card>
        );
      },
    },
  ];
  const heroSlots = [0];
  const heroSlotSize = 4;
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    pagination: {
      pageSize:
        slotCount - customSlots.length - (heroSlots.length * heroSlotSize - 1),
      page,
    },
  });
  const feed = config.podcastFeed
    ? await getPodcastFeed(config.podcastFeed)
    : { episodes: [], meta: { link: "" } };
  return (
    <main className={`${styles.main}`}>
      <Posts
        pageUrl="/archive"
        pagination={posts.meta.pagination}
        slots={slotCount}
        posts={posts.data ?? []}
        heroSlots={page === 1 ? heroSlots : []}
        customSlots={page === 1 ? customSlots : []}
      />
    </main>
  );
}

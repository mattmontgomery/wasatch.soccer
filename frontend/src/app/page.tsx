import { Card, Posts } from "./components/PostGrid";
import { getPosts } from "./util/api";
import { getPodcastFeed } from "./util/podcast";
import { getConfig } from "./util/config";

import styles from "./page.module.css";
import podcastStyles from "@/app/styles/podcast.module.css";
import homepageStyles from "@/app/styles/homepage.module.css";

export default async function Home({
  params: { page: _page },
}: {
  params: { page?: string };
}) {
  const page = isNaN(Number(_page)) ? 1 : Number(_page);
  const config = await getConfig();
  const feed = config.podcastFeed
    ? await getPodcastFeed(config.podcastFeed)
    : { episodes: [], meta: { link: "" } };
  const slotCount = 21;
  const customSlots = [
    config.podcastFeed
      ? {
          slot: 5,
          renderCard: () => {
            return (
              <Card
                className={`${homepageStyles.card} ${homepageStyles.alternate}`}
              >
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
          },
        }
      : null,
    config.newsletterSignup
      ? {
          slot: 9,
          renderCard: () => {
            return (
              <Card className={`${homepageStyles.card}`}>
                <h2>Newsletter</h2>
                <p>
                  Weekly updates from the Wasatch Soccer Sentinel staff,
                  delivered straight to your inbox. Subscribe today!
                </p>
                <p></p>
                <a
                  className={homepageStyles.subscribe}
                  href={config.newsletterSignup}
                  target="_blank"
                  rel="noreferrer"
                >
                  Subscribe
                </a>
              </Card>
            );
          },
        }
      : null,
  ].filter(Boolean);
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

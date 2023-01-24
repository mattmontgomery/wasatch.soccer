import styles from "./page.module.css";
import { Card, Posts } from "./components/PostGrid";
import { getPosts } from "./util/api";
import { getPodcastFeed } from "./util/podcast";

import podcastStyles from "@/app/styles/podcast.module.css";
import { getConfig } from "./util/config";

export default async function Home({
  searchParams,
}: {
  searchParams?: { page: string };
}) {
  const page = isNaN(Number(searchParams?.page))
    ? 1
    : Number(searchParams?.page);
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    pagination: { pageSize: 20, page },
  });
  const config = await getConfig();
  const feed = config.podcastFeed
    ? await getPodcastFeed(config.podcastFeed)
    : { episodes: [], meta: { link: "" } };
  return (
    <main className={`${styles.main}`}>
      <Posts
        pageUrl="/"
        pagination={posts.meta.pagination}
        slots={18}
        posts={posts.data ?? []}
        heroSlots={page === 1 ? [0] : []}
        customSlots={
          config.podcastFeed && page === 1
            ? [
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
              ]
            : []
        }
      />
    </main>
  );
}

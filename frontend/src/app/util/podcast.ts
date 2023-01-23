import parse from "podparse";

export async function getPodcastFeed(url: string) {
  const feed = await fetch(url);
  return parse(await feed.text());
}

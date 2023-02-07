import ReactMarkdown from "react-markdown";

import { Card } from "@/app/components/PostGrid";

import type { Podcast } from "podparse";
import Image from "next/image";
import Link from "next/link";
import { getPhoto, getPhotoPath, getPhotoRaw } from "../util/api";

import podcastStyles from "@/app/styles/podcast.module.css";
import homepageStyles from "@/app/styles/homepage.module.css";
import textStyles from "@/app/text.module.css";
import { getStreamUrl } from "../util/urls";

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

export function TextCard({ title, body, coverImage, url }: App.GridSlots.Text) {
  const image = coverImage.data
    ? getPhotoRaw(coverImage.data, "medium")?.url
    : "";
  return (
    <Card className={`${homepageStyles.card} ${homepageStyles.textCard}`}>
      <h2>{url ? <Link href={url}>{title}</Link> : title}</h2>
      {image && (
        <div className={homepageStyles.image}>
          {url ? (
            <Link href={url}>
              <Image
                alt={
                  coverImage.data.attributes.alternativeText ??
                  coverImage.data.attributes.caption ??
                  title
                }
                src={image}
                fill
              />
            </Link>
          ) : (
            <Image
              alt={
                coverImage.data.attributes.alternativeText ??
                coverImage.data.attributes.caption ??
                title
              }
              src={image}
              fill
            />
          )}
        </div>
      )}
      <div className={textStyles.body}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </Card>
  );
}
export function StreamCard({ coverImage, stream }: App.GridSlots.Stream) {
  const url = getStreamUrl(stream.data);
  const image = coverImage.data
    ? getPhotoRaw(coverImage.data, "medium")?.url
    : "";
  const title = stream.data.attributes.name;
  return (
    <Card className={homepageStyles.streamCard}>
      {image && (
        <div className={homepageStyles.image}>
          {url ? (
            <Link href={url}>
              <Image
                alt={
                  coverImage.data.attributes.alternativeText ??
                  coverImage.data.attributes.caption ??
                  title
                }
                src={image}
                fill
              />
            </Link>
          ) : (
            <Image
              alt={
                coverImage.data.attributes.alternativeText ??
                coverImage.data.attributes.caption ??
                title
              }
              src={image}
              fill
            />
          )}
        </div>
      )}
      <h2>{url ? <Link href={url}>{title}</Link> : title}</h2>
    </Card>
  );
}

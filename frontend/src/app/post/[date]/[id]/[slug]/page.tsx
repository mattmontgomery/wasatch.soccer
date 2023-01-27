import ReactMarkdown from "react-markdown";
import Image from "next/image";
import format from "date-fns/format";

import {
  getPathnamePieces,
  getPhoto,
  getPhotoPath,
  getPost,
  getPosts,
} from "@/app/util/api";
import { Redirect } from "@/app/components/Post/Redirect";
import { Embed } from "@/app/components/Post/Embed";
import Published from "@/app/components/Post/Published";

import pageStyles from "./page.module.css";
import postStyles from "@/app/styles/post.module.css";
import textStyles from "@/app/text.module.css";
import Authors from "@/app/components/Post/Author";
import Groups from "@/app/components/Post/Groups";
import Streams from "@/app/components/Post/Streams";

import Posts from "./Posts";
import { notFound } from "next/navigation";

export default async function PostPage({
  params: { id, slug },
}: {
  params: { id: number; slug: string };
}) {
  const { data } = await getPost(id);
  if (!data) {
    return notFound();
  }
  const leadPhoto = getPhoto(data, "original");
  const authors = getAuthors(data);
  const groups = data.attributes.groups?.data ?? [];
  const primaryGroup = data.attributes.primaryGroup?.data ?? null;
  const posts = await getPosts({
    sort: ["published:desc", "publishedAt:desc"],
    filters: {
      id: {
        $ne: id,
      },
    },
    pagination: { pageSize: 5 },
  });
  const streams = data.attributes.streams?.data ?? [];
  return (
    <main className={`${pageStyles.main}`}>
      <article className={pageStyles.post}>
        <Redirect slugFromPath={slug} post={data} />
        <section className={pageStyles.section}>
          <header>
            {primaryGroup && (
              <h5 className={postStyles.groupTag}>
                {data.attributes.primaryGroup.data.attributes.name}
              </h5>
            )}
            <h2 className={pageStyles.headline}>{data.attributes.headline}</h2>
            <p className={pageStyles.summary}>{data.attributes.summary}</p>
          </header>
          {leadPhoto && (
            <div className={pageStyles.leadPhotoContainer}>
              <div className={pageStyles.leadPhoto}>
                <Image
                  priority
                  sizes="(max-width: 48rem) 480px, (max-width: 56rem) 640px, (min-width: 56rem) 1280px"
                  src={getPhotoPath(leadPhoto.url)}
                  alt={data.attributes.headline}
                  width={leadPhoto.width}
                  height={leadPhoto.height}
                />
              </div>
              <div className={pageStyles.leadPhotoCaption}>
                {data.attributes.leadPhoto.data.attributes.caption}
              </div>
            </div>
          )}
          <div className={pageStyles.detailSection}>
            <p className={pageStyles.details}>
              {authors.length ? (
                <span className={postStyles.author}>
                  <Authors {...data} />
                </span>
              ) : (
                <></>
              )}
              <span className={postStyles.date}>
                <Published {...data} />
              </span>
            </p>
            <div className={pageStyles.details}>
              {groups.length ? (
                <span className={postStyles.groups}>
                  <Groups {...data} />
                </span>
              ) : (
                <></>
              )}

              {streams.length ? (
                <div className={pageStyles.streams}>
                  <span>Series:</span>{" "}
                  <span className={pageStyles.streamsContent}>
                    <Streams {...data} />
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={textStyles.body}>
            <ReactMarkdown
              components={{
                p({ node, children }) {
                  if (children?.[0]?.toString().startsWith("https://")) {
                    return <Embed url={children[0].toString()} />;
                  } else {
                    return <p>{children}</p>;
                  }
                },
              }}
            >
              {data.attributes.body}
            </ReactMarkdown>
          </div>
        </section>
      </article>
      <div className={postStyles.rightRail}>
        <h3>Latest News</h3>
        <Posts posts={posts.data} />
      </div>
    </main>
  );
}

function getAuthors(data: App.Post): string[] {
  return (
    data.attributes.authors?.data.map((author) => author.attributes.name) ?? []
  );
}

export async function generateStaticParams() {
  const posts = await getPosts({
    populate: "",
    pagination: {
      pageSize: 100,
    },
  });

  return posts.data.map((post) => {
    return getPathnamePieces(post);
  });
}

import ReactMarkdown from "react-markdown";
import Image from "next/image";

import { getPhoto, getPhotoPath, getPost, getPosts } from "@/app/util/api";
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
  const leadPhoto = getPhoto(data);
  const authors = getAuthors(data);
  const groups = data.attributes.groups?.data ?? [];
  const primaryGroup = data.attributes.primaryGroup?.data ?? null;
  const posts = await getPosts({
    sort: ["publishedAt:desc"],
    filters: {
      id: {
        $ne: id,
      },
    },
    pagination: { pageSize: 5 },
  });
  const streams = data.attributes.streams?.data ?? [];
  return (
    <>
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
              {groups.length ? (
                <span className={postStyles.groups}>
                  <Groups {...data} />
                </span>
              ) : (
                <></>
              )}
            </p>

            {streams.length ? (
              <div className={pageStyles.streams}>
                <span>Filed under:</span>{" "}
                <span className={pageStyles.streamsContent}>
                  <Streams {...data} />
                </span>
              </div>
            ) : (
              <></>
            )}
          </header>
          {leadPhoto && (
            <div className={pageStyles.leadPhotoContainer}>
              <div className={pageStyles.leadPhoto}>
                <Image
                  sizes="(max-width: 72rem) 100vw
                  50vw"
                  priority
                  src={getPhotoPath(leadPhoto.url)}
                  fill
                  alt={data.attributes.headline}
                />
              </div>
              <div className={pageStyles.leadPhotoCaption}>
                {data.attributes.leadPhoto.data.attributes.caption}
              </div>
            </div>
          )}
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
    </>
  );
}

function getAuthors(data: App.Post): string[] {
  return (
    data.attributes.authors?.data.map((author) => author.attributes.name) ?? []
  );
}

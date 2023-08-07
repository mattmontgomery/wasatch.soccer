import { Metadata } from "next";
import Image from "next/image";
import { ArticleJsonLd } from "next-seo";

import { getPhoto, getPhotoPath, getPost, getPosts } from "@/app/util/api";
import { Redirect } from "@/app/components/Post/Redirect";
import { Embed } from "@/app/components/Post/Embed";
import Published from "@/app/components/Post/Published";

import pageStyles from "./page.module.css";
import postStyles from "@/app/styles/post.module.css";
import textStyles from "@/app/styles/text.module.css";
import Authors from "@/app/components/Post/Author";
import Groups from "@/app/components/Post/Groups";
import Streams from "@/app/components/Post/Streams";

import Posts from "./Posts";
import { notFound } from "next/navigation";
import {
  getAbsolutePath,
  getAuthorUrl,
  getPathnamePieces,
  getPostUrl,
} from "@/app/util/urls";
import { getConfig } from "@/app/util/config";
import getMetadataPhoto from "@/app/util/api/posts/getMetadataPhoto";
import Related from "./Related";
import TextModule from "./TextModule";
import Gallery from "./Gallery";
import Commento from "./Commento";
import MarkdownText from "@/app/components/MarkdownText";
import { PropsWithChildren } from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import LiveBlog from "./LiveBlog";

type PageProps = {
  params: { id: number; slug: string };
};

export default async function PostPage({ params: { id, slug } }: PageProps) {
  const { data } = await getPost(id);
  if (
    !data ||
    (!data.attributes.publishedAt && !process.env.SHOW_UNPUBLISHED)
  ) {
    notFound();
  }
  const config = await getConfig();
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
    pagination: { pageSize: 8 },
  });
  const streams = data.attributes.streams?.data ?? [];
  const bodyLength = data.attributes.body?.split("\n\n").length;

  const moduleSpacing = bodyLength > 20 ? 6 : 4;

  return (
    <main className={`${pageStyles.main}`}>
      <ArticleJsonLd
        type="NewsArticle"
        useAppDir
        url={getAbsolutePath(getPostUrl(data))}
        title={data.attributes.headline}
        images={[leadPhoto ? getPhotoPath(leadPhoto.url) : ""]}
        dateModified={new Date(data.attributes.updatedAt).toISOString()}
        datePublished={new Date(data.attributes.published).toISOString()}
        publisherName={config.siteName}
        publisherLogo={config.logo.light}
        description={data.attributes.summary}
        isAccessibleForFree
        authorName={
          data.attributes.authors.data.length
            ? data.attributes.authors.data.map((author) => ({
                "@type": "Person",
                name: author.attributes.name,
                url: getAbsolutePath(getAuthorUrl(author)),
              }))
            : []
        }
      />
      <div className={pageStyles.post}>
        <Redirect slugFromPath={slug} post={data} />
        <article className={pageStyles.section}>
          <header>
            {primaryGroup && (
              <h5 className={postStyles.groupTag}>
                {primaryGroup.attributes.name}
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
                  alt={
                    data.attributes.leadPhoto.data?.attributes
                      .alternativeText ?? data.attributes.headline
                  }
                  width={leadPhoto.width}
                  height={leadPhoto.height}
                />
              </div>
              <div className={pageStyles.leadPhotoCaption}>
                {data.attributes.leadPhoto.data?.attributes.caption}
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
            <MarkdownText
              components={{
                p({ node, children }) {
                  const postModule = (node.position?.start.line ?? 0) + 1;
                  const postModuleIndex = postModule / (moduleSpacing * 2) - 1;
                  const text = children?.[0]?.toString();
                  const firstChild = children?.[0];
                  const firstChildHasText = (
                    (firstChild as ReactElement)?.props as PropsWithChildren
                  )?.children?.toString();
                  const firstChildHref = (
                    (firstChild as ReactElement)?.props as { href?: string }
                  )?.href?.toString();
                  if (text && text.startsWith("https://")) {
                    return <Embed url={text} />;
                  } else if (
                    (firstChild as ReactElement)?.type === "a" &&
                    firstChildHasText === firstChildHref
                  ) {
                    return (
                      <Embed
                        url={
                          (
                            (firstChild as ReactElement)?.props as {
                              href: string;
                            }
                          ).href
                        }
                      />
                    );
                  } else if (text?.startsWith("[[liveblog")) {
                    return <LiveBlog id={text.match(/[0-9]+/i)?.[0]} />;
                  } else if (text === "[[relatedPosts]]") {
                    return (
                      <Related
                        relatedPosts={data.attributes.relatedPosts?.data ?? []}
                      />
                    );
                  } else if (text === "[[photoGallery]]") {
                    return (
                      <Gallery
                        photos={data.attributes.photoGallery?.data ?? []}
                      />
                    );
                  } else if (
                    data.attributes.postModules.data[postModuleIndex]
                  ) {
                    return (
                      <>
                        <TextModule
                          key={`${node.position?.start.line}-a`}
                          postModule={
                            data.attributes.postModules.data[postModuleIndex]
                          }
                        />
                        <p key={`${node.position?.start.line}-b`}>{children}</p>
                      </>
                    );
                  } else {
                    return <p>{children}</p>;
                  }
                },
              }}
            >
              {data.attributes.body}
            </MarkdownText>
          </div>
        </article>
        {data.attributes.commentsEnabled && (
          <section className={postStyles.comments}>
            <div id="commento" />
            <Commento pageId={`post:${data.id}`} />
          </section>
        )}
      </div>
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

  return posts.data?.map(getPathnamePieces).filter((post) => !!post.slug);
}

export async function generateMetadata({
  params: { id },
}: PageProps): Promise<Metadata> {
  const { data } = await getPost(id);
  if (
    !data ||
    (!data.attributes.publishedAt && !process.env.SHOW_UNPUBLISHED)
  ) {
    notFound();
  }
  const metadataPhoto = getMetadataPhoto(data);
  return {
    alternates: {
      canonical: getAbsolutePath(getPostUrl(data)),
    },
    title: data.attributes.headline,
    description: data.attributes.summary,
    openGraph: {
      title: { absolute: data.attributes.headline },
      type: "article",
      section: "Sports",
      tags: ["Real Salt Lake"],
      description: data.attributes.summary,
      images: metadataPhoto ? [metadataPhoto] : [],
    },
    twitter: {
      card: "summary_large_image",
      description: data.attributes.summary,
      title: data.attributes.headline,
      images: metadataPhoto ? [metadataPhoto] : [],
    },
    other: {
      "twitter:label1": "Written By",
      "twitter:data1": data.attributes.authors.data
        .map((author) => author.attributes.name)
        .join(", "),
    },
  };
}

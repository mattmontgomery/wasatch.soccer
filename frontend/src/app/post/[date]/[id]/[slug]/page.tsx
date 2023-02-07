import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { ArticleJsonLd } from "next-seo";

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
import { getAbsolutePath, getAuthorUrl, getPostUrl } from "@/app/util/urls";
import { getConfig } from "@/app/util/config";
import { Metadata } from "next";
import getMetadataPhoto from "@/app/util/api/posts/getMetadataPhoto";

type PageProps = {
  params: { id: number; slug: string };
};

export default async function PostPage({ params: { id, slug } }: PageProps) {
  const { data } = await getPost(id);
  if (!data) {
    return notFound();
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
    pagination: { pageSize: 5 },
  });
  const streams = data.attributes.streams?.data ?? [];
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
      <article className={pageStyles.post}>
        <Redirect slugFromPath={slug} post={data} />
        <section className={pageStyles.section}>
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

  return posts.data.map(getPathnamePieces);
}

export async function generateMetadata({
  params: { id },
}: PageProps): Promise<Metadata> {
  const { data } = await getPost(id);
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

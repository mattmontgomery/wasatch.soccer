import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Posts } from "@/app/components/PostGrid";
import { getAuthor, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";
import textStyles from "@/app/styles/text.module.css";
import authorStyles from "./authorPage.module.css";
import { SocialIcon } from "react-social-icons";
import { Metadata } from "next";

type PageProps = {
  params: { id: string; slug: string[] };
};

export default async function AuthorsPage({
  params: { id, slug: _slug },
}: PageProps) {
  const [slug, _page] = _slug;
  const page = isNaN(Number(_page)) ? 1 : Number(_page);
  const author = await getAuthor(Number(id));
  if (!author.data) {
    notFound();
  }
  const posts = await getPosts({
    filters: {
      authors: {
        id: {
          $eq: Number(id),
        },
        slug: {
          $eq: slug,
        },
      },
    },
    pagination: {
      pageSize: 9,
      page,
    },
  });
  return (
    <main className={`${styles.main} ${styles.main4}`}>
      <div className={styles.pageHeader}>
        <h2>{author.data.attributes.name}</h2>
        <h5>{author.data.attributes.title}</h5>
      </div>
      <div className={authorStyles.bioSection}>
        <div className={authorStyles.photoSection}>
          {author.data.attributes.photo.data && (
            <div className={authorStyles.photo}>
              <Image
                alt={author.data.attributes.name}
                src={
                  author.data.attributes.photo.data.attributes.formats.medium
                    ?.url ?? author.data.attributes.photo.data.attributes.url
                }
                height={
                  author.data.attributes.photo.data.attributes.formats.medium
                    ?.height ??
                  author.data.attributes.photo.data.attributes.height
                }
                width={
                  author.data.attributes.photo.data.attributes.formats.medium
                    ?.width ??
                  author.data.attributes.photo.data.attributes.width
                }
              />
            </div>
          )}
        </div>
        {author.data.attributes.bio && (
          <section className={textStyles.body}>
            <ReactMarkdown>{author.data.attributes.bio}</ReactMarkdown>
          </section>
        )}
        <section>
          {author.data.attributes.socialLinks && (
            <div className={authorStyles.socialLinks}>
              {Object.entries(author.data.attributes.socialLinks)
                .filter(([, a]) => a && typeof a === "string")
                .map(([network, url], idx) => (
                  <div className={authorStyles.socialLink} key={idx}>
                    <SocialIcon style={{ width: 25, height: 25 }} url={url} />
                    <a target="_blank" href={url} rel="noreferrer">
                      {network}
                    </a>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
      <Posts
        posts={posts.data ?? []}
        pageUrl={`/authors/${id}/${author.data.attributes.slug}`}
        pagination={posts.meta.pagination}
      />
    </main>
  );
}

export async function generateMetadata({
  params: { id, slug: _slug },
}: PageProps): Promise<Metadata> {
  const author = await getAuthor(Number(id));
  if (!author.data) {
    notFound();
  }
  const title = author.data.attributes.name;
  return {
    title,
    twitter: {
      title,
    },
    openGraph: {
      title: {
        absolute: title,
      },
    },
  };
}

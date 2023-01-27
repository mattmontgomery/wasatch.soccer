import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { Posts } from "@/app/components/PostGrid";
import { getAuthor, getPosts } from "@/app/util/api";

import styles from "@/app/page.module.css";
import textStyles from "@/app/text.module.css";
import authorStyles from "./authorPage.module.css";
import { SocialIcon } from "react-social-icons";

export default async function AuthorsPage({
  params: { id, slug: _slug },
}: {
  params: { id: string; slug: string[] };
}) {
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
    <main
      className={`${styles.main} ${
        author.data.attributes.bio ? styles.main4 : ""
      }`}
    >
      <div className={styles.pageHeader}>
        <h2>{author.data.attributes.name}</h2>
        <h5>{author.data.attributes.title}</h5>
      </div>
      <div className={styles.pageBody}>
        <div className={authorStyles.bioSection}>
          <div className={authorStyles.photoSection}>
            {author.data.attributes.photo && (
              <div className={authorStyles.photo}>
                <Image
                  alt={author.data.attributes.name}
                  src={author.data.attributes.photo.data.attributes.url}
                  height={author.data.attributes.photo.data.attributes.height}
                  width={author.data.attributes.photo.data.attributes.width}
                />
              </div>
            )}
            {author.data.attributes.socialLinks && (
              <div className={authorStyles.socialLinks}>
                {author.data.attributes.socialLinks?.twitter && (
                  <SocialIcon
                    url={author.data.attributes.socialLinks.twitter}
                    style={{ width: 25, height: 25 }}
                  />
                )}
                {author.data.attributes.socialLinks?.facebook && (
                  <SocialIcon
                    url={author.data.attributes.socialLinks.facebook}
                    style={{ width: 25, height: 25 }}
                  />
                )}
                {author.data.attributes.socialLinks?.instagram && (
                  <SocialIcon
                    url={author.data.attributes.socialLinks.instagram}
                    style={{ width: 25, height: 25 }}
                  />
                )}
                {author.data.attributes.socialLinks?.mastodon && (
                  <SocialIcon
                    url={author.data.attributes.socialLinks.mastodon}
                    style={{ width: 25, height: 25 }}
                  />
                )}
              </div>
            )}
          </div>
          {author.data.attributes.bio && (
            <section className={textStyles.body}>
              <ReactMarkdown>{author.data.attributes.bio}</ReactMarkdown>
            </section>
          )}
        </div>
        <Posts
          posts={posts.data ?? []}
          pageUrl={`/author/${id}/${author.data.attributes.slug}`}
          pagination={posts.meta.pagination}
        />
      </div>
    </main>
  );
}

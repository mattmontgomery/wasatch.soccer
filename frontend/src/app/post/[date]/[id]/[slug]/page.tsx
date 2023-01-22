import ReactMarkdown from "react-markdown";
import Image from "next/image";

import { getPhoto, getPhotoPath, getPost, getPosts } from "@/app/util/api";
// import { Redirect } from "./Redirect";
// import { Embed } from "./Embed";
import Published from "@/app/components/Post/Published";

import postStyles from "./postPage.module.css";
import textStyles from "@/app/text.module.css";
import Authors from "@/app/components/Post/Author";
import Groups from "@/app/components/Post/Groups";
import Posts from "./Posts";

export default async function PostPage({
  params: { id, slug },
}: {
  params: { id: number; slug: string };
}) {
  const { data } = await getPost(id);
  const leadPhoto = getPhoto(data);
  const authors = getAuthors(data);
  const groups = data.attributes.groups?.data;
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
  return (
    <>
      <section className={postStyles.post}>
        {/* <Redirect slugFromPath={slug} post={data} /> */}
        <section className={postStyles.section}>
          <div>
            {primaryGroup && (
              <h5 className={postStyles.groupTag}>
                {data.attributes.primaryGroup.data.attributes.name}
              </h5>
            )}
            <h2 className={postStyles.headline}>{data.attributes.headline}</h2>
          </div>
          <p className={postStyles.summary}>{data.attributes.summary}</p>
          <p className={postStyles.details}>
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
          {leadPhoto && (
            <div>
              <div className={postStyles.leadPhoto}>
                <Image
                  priority
                  src={getPhotoPath(leadPhoto.url)}
                  fill
                  alt={data.attributes.headline}
                />
              </div>
              <div className={postStyles.leadPhotoCaption}>
                {data.attributes.leadPhoto.data.attributes.caption}
              </div>
            </div>
          )}
          <div className={textStyles.body}>
            <ReactMarkdown
              components={{
                p({ node, children }) {
                  // if (children?.[0]?.toString().startsWith("https://")) {
                  //   return <Embed url={children[0].toString()} />;
                  // } else {
                  return <p>{children}</p>;
                  // }
                },
              }}
            >
              {data.attributes.body}
            </ReactMarkdown>
          </div>
        </section>
      </section>
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

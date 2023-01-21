import postStyles from "./page.module.css";
import Image from "next/image";
import { getPhoto, getPhotoPath, getPost } from "@/app/util/api";
import { Redirect } from "./Redirect";
import ReactMarkdown from "react-markdown";
import { Embed } from "./Embed";
import Published from "@/app/components/Published";
export default async function PostPage({
  params: { id, slug },
}: {
  params: { id: number; slug: string };
}) {
  const { data } = await getPost(id);
  const leadPhoto = getPhoto(data);
  const authors = getAuthors(data);
  const primaryGroup = data.attributes.primaryGroup?.data ?? null;
  return (
    <main>
      <Redirect slugFromPath={slug} post={data} />
      <section className={postStyles.section}>
        {primaryGroup && (
          <h5 className={postStyles.headline}>
            {data.attributes.primaryGroup.data.attributes.name}
          </h5>
        )}
        <h2 className={postStyles.headline}>{data.attributes.headline}</h2>
        <p className={postStyles.summary}>{data.attributes.summary}</p>
        <p className={postStyles.details}>
          {authors.length ? (
            <span className={postStyles.byline}>By {authors.join(", ")}</span>
          ) : (
            <></>
          )}
          <span className={postStyles.date}>
            <Published {...data} />
          </span>
        </p>
      </section>
      <section className={postStyles.section}>
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
        <div className={postStyles.body}>
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
    </main>
  );
}

function getAuthors(data: App.Post): string[] {
  return (
    data.attributes.authors?.data.map((author) => author.attributes.name) ?? []
  );
}

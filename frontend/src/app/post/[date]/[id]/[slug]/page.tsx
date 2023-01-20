import pageStyles from "@/app/page.module.css";
import postStyles from "./page.module.css";
import getConfig from "next/config";
import Image from "next/image";
import format from "date-fns/format";
import { getPhoto, getPhotoPath, getPost } from "@/app/util/api";
import { Redirect } from "./Redirect";
import ReactMarkdown from "react-markdown";
import { Embed } from "./Embed";
export default async function PostPage({
  params: { id, slug },
}: {
  params: { id: number; slug: string };
}) {
  const { data } = await getPost(id);
  const leadPhoto = getPhoto(data);
  const authors = getAuthors(data);
  return (
    <>
      <Redirect slugFromPath={slug} post={data} />
      <section className={postStyles.section}>
        <h2 className={postStyles.headline}>{data.attributes.headline}</h2>
        <p className={postStyles.summary}>{data.attributes.summary}</p>
        <p className={postStyles.details}>
          {authors.length ? (
            <span className={postStyles.byline}>By {authors.join(", ")}</span>
          ) : (
            <></>
          )}
          <span className={postStyles.date}>
            {format(
              new Date(data.attributes.publishedAt),
              "MMM dd, yyyy, hh:ii a"
            )
              .replace(/am/i, "a.m.")
              .replace(/pm/i, "p.m.")}
          </span>
        </p>
      </section>
      <section className={postStyles.section}>
        {leadPhoto && (
          <div className={postStyles.leadPhoto}>
            <Image
              priority
              src={getPhotoPath(leadPhoto.url)}
              fill
              alt={data.attributes.headline}
            />
          </div>
        )}
        <div className={postStyles.body}>
          <ReactMarkdown
            components={{
              p({ node, children, ...props }) {
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
    </>
  );
}

function bodyParser(body: string): string[] {
  return body.split(/\n{2,}/);
}

function getAuthors(data: App.Post): string[] {
  return (
    data.attributes.authors?.data.map((author) => author.attributes.name) ?? []
  );
}

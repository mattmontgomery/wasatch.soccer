import DefaultTags from "@/app/DefaultTags";
import { getAuthor, getPhoto, getPhotoPath, getPost } from "@/app/util/api";
import { getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { id: number } }) {
  const { data } = await getPost(params.id);
  if (!data) {
    notFound();
  }
  const photo = getPhoto(data, "small");
  const photoPath = photo ? getPhotoPath(photo.url) : null;

  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="shortcut icon" href="/ball.png" />
      <title>{await getTitle([data?.attributes.headline])}</title>
      <meta name="description">{data?.attributes.summary}</meta>
      <meta property="og:title" content={data.attributes.headline} />
      <meta property="og:description" content={data.attributes.summary} />
      <meta property="og:type" content="article" />
      <meta property="article:section" content="Sports" />
      <meta property="article:tag" content="Real Salt Lake" />

      {photoPath && <meta property="og:image" content={photoPath} />}

      {data.attributes.authors.data.length ? (
        <>
          <meta property="twitter:label1" content="Written by" />
          <meta
            property="twitter:data1"
            content={data.attributes.authors.data
              .map((author) => author.attributes.name)
              .join(", ")}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

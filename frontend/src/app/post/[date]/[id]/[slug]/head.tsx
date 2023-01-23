import DefaultTags from "@/app/DefaultTags";
import { getPhoto, getPhotoPath, getPost } from "@/app/util/api";
import { getTitle } from "@/app/util/site";

export default async function Head({ params }: { params: { id: number } }) {
  const post = await getPost(params.id);
  const photo = getPhoto(post.data, "small");
  const photoPath = photo ? getPhotoPath(photo.url) : null;
  return (
    <>
      <DefaultTags />
      <title>{await getTitle([post.data.attributes.headline])}</title>

      <meta name="description">{post.data.attributes.summary}</meta>
      <meta property="og:title" content={post.data.attributes.headline} />
      <meta property="og:description" content={post.data.attributes.summary} />
      <meta property="og:type" content="article" />
      <meta property="article:section" content="Sports" />
      <meta property="article:tag" content="Real Salt Lake" />
      {photoPath && <meta property="og:image" content={photoPath} />}

      {post.data.attributes.authors.data.length ? (
        <>
          <meta property="twitter:label1" content="Written by" />
          <meta
            property="twitter:data1"
            content={post.data.attributes.authors.data
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

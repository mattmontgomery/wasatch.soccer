import qs from "qs";
import format from "date-fns/format";

export async function getPosts({
  sort = [],
  pagination = {},
}: { sort?: string[]; pagination?: { pageSize?: number } } = {}): Promise<{
  data: App.Post[];
}> {
  const queryString = qs.stringify({
    populate: "*",
    pagination,
    sort,
  });
  const res = await fetch(`http://localhost:1337/api/posts?${queryString}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
  return res.json();
}

export async function getPost(postId: number): Promise<{
  data: App.Post;
}> {
  const res = await fetch(
    `http://localhost:1337/api/posts/${postId}?populate[0]=leadPhoto&populate[1]=authors`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `bearer ${process.env.API_TOKEN}`,
      },
    }
  );
  return res.json();
}

export function getPhoto(
  data: App.Post,
  format: string = "large"
): App.Photo | null {
  return data.attributes.leadPhoto.data
    ? data.attributes.leadPhoto.data.attributes.formats[format]
    : null;
}

export function getPathname(post: App.Post): string {
  const date = format(new Date(post.attributes.publishedAt), "yyyy-mm-dd");
  return `/post/${date}/${post.id}/${post.attributes.slug}`;
}

export function getPhotoPath(path: string) {
  return `http://localhost:1337${path}`;
}

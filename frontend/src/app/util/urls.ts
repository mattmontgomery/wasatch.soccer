import format from "date-fns/format";

export function getAuthorUrl(author: App.Author) {
  return `/authors/${author.id}/${author.attributes.slug}`;
}

export function getPostUrl(post: App.Post) {
  const date = format(new Date(post.attributes.published), "yyyy-MM-dd");
  return `/post/${date}/${post.id}/${post.attributes.slug}`;
}
export function getStreamUrl(stream: App.Stream) {
  return `/streams/${stream.id}/${stream.attributes.slug}`;
}

export function getAbsolutePath(url: string): string {
  return `${process.env.SITE_BASE}${url}`;
}

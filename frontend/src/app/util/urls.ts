import format from "date-fns/format";

export function getAuthorUrl(author: App.Author) {
  return `/authors/${author.id}/${author.attributes.slug}`;
}

export function formatDateForPathname(date: string) {
  return date ? format(new Date(date), "yyyy-MM-dd") : "";
}

export function getFullPathname(post: App.Post): string {
  return `${process.env.SITE_BASE}${getPostUrl(post)}`;
}
export function getPathnamePieces(post: App.Post | App.RelatedPost): {
  date: string;
  id: string;
  slug: string;
} {
  const date = formatDateForPathname(
    post.attributes.published ??
      post.attributes.publishedAt ??
      post.attributes.createdAt
  );
  return {
    date,
    id: String(post.id),
    slug: post.attributes.slug,
  };
}

export function getPostUrl(post: App.Post | App.RelatedPost): string {
  const { date, id, slug } = getPathnamePieces(post);
  return getPostUrlFromPieces({ date, id, slug });
}
export function getPostUrlFromPieces({
  date,
  id,
  slug,
}: {
  date: string;
  id: string;
  slug: string;
}) {
  return `/post/${date}/${id}/${slug}`;
}
export function getStreamUrl(stream: App.Stream) {
  return `/streams/${stream.id}/${stream.attributes.slug}`;
}

export function getAbsolutePath(url: string): string {
  return `${process.env.SITE_BASE}${url}`;
}

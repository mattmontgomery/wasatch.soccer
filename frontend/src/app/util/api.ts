import qs from "qs";
import format from "date-fns/format";

const API_BASE = process.env.API_BASE;

export async function getPosts({
  sort = ["published:desc", "publishedAt:desc"],
  pagination = {},
  filters = {},
  populate = "*",
}: {
  filters?: {
    id?:
      | {
          $ne?: number;
        }
      | { $eq?: number };
    authors?: {
      id: {
        $eq: number;
      };
      slug: {
        $eq: string;
      };
    };
    groups?: {
      id: {
        $eq: number;
      };
    };
    published?: {
      $gte: string;
    };
  };
  pagination?: { pageSize?: number };
  populate?: string | string[];
  sort?: string[];
} = {}): Promise<{
  data: App.Post[];
}> {
  const queryString = qs.stringify(
    {
      populate,
      pagination,
      sort,
      filters,
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_BASE}/api/posts?${queryString}`, {
    next: {
      revalidate: 120,
    },
    method: "GET",
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
  return res.json();
}

export async function getPost(postId: number): Promise<{
  data: App.Post;
}> {
  const queryString = qs.stringify({
    populate: ["leadPhoto", "authors", "groups", "primaryGroup"],
  });
  const res = await fetch(`${API_BASE}/api/posts/${postId}?${queryString}`, {
    next: {
      revalidate: 300,
    },
    method: "GET",
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
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
  const date = format(
    new Date(post.attributes.published ?? post.attributes.publishedAt),
    "yyyy-MM-dd"
  );
  return `/post/${date}/${post.id}/${post.attributes.slug}`;
}
export function getFullPathname(post: App.Post): string {
  return `${process.env.SITE_BASE}${getPathname(post)}`;
}

export function getPhotoPath(path: string) {
  return path;
}

export async function getAuthor(
  authorId: number
): Promise<{ data: App.Author }> {
  const res = await fetch(`${API_BASE}/api/authors/${authorId}`, {
    next: {
      revalidate: 60 * 60 * 8, // eight hours
    },
    method: "GET",
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
  return res.json();
}

export async function getGroup(groupId: number): Promise<{ data: App.Group }> {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
    method: "GET",
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
  return res.json();
}

import qs from "qs";
import format from "date-fns/format";

const API_BASE = process.env.API_BASE;

async function makeApiCall(
  path: string,
  options: { revalidate: number } = { revalidate: 120 }
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: options.revalidate,
    },
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
}

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
      $gte?: string;
      $lte?: string;
    };
    streams?: {
      id: {
        $eq: number;
      };
    };
  };
  pagination?: {
    pageSize?: number;
    page?: number;
    withCount?: number;
  };
  populate?: string | string[];
  sort?: string[];
} = {}): Promise<{
  data: App.Post[];
  meta: Required<App.Meta>;
}> {
  const now = format(new Date(), "yyyy-MM-dd");
  const queryString = qs.stringify(
    {
      populate,
      pagination,
      sort,
      filters: {
        ...filters,
        published: {
          ...(filters.published ? filters.published : {}),
          $lte: now,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await makeApiCall(`/api/posts?${queryString}`);
  return res.json();
}

export async function getPost(postId: number): Promise<{
  data: App.Post;
}> {
  const queryString = qs.stringify({
    populate: ["leadPhoto", "authors", "groups", "primaryGroup", "streams"],
  });
  const res = await makeApiCall(`/api/posts/${postId}?${queryString}`, {
    revalidate: 300,
  });
  return res.json();
}

export function getPhoto(
  data: App.Post,
  format: string = "large"
): App.Photo | null {
  if (format === "original") {
    return data?.attributes?.leadPhoto.data?.attributes
      ? data.attributes.leadPhoto.data.attributes
      : null;
  }
  return data?.attributes?.leadPhoto?.data
    ? data.attributes.leadPhoto.data.attributes.formats[format]
    : null;
}

export function formatDateForPathname(date: string) {
  return format(new Date(date), "yyyy-MM-dd");
}

export function getPathnamePieces(post: App.Post): {
  date: string;
  id: string;
  slug: string;
} {
  const date = formatDateForPathname(
    post.attributes.published ?? post.attributes.publishedAt
  );
  return {
    date,
    id: String(post.id),
    slug: post.attributes.slug,
  };
}

export function getPathname(post: App.Post): string {
  const { date, id, slug } = getPathnamePieces(post);
  return `/post/${date}/${id}/${slug}`;
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
  if (typeof authorId !== "number") {
    throw "Not a valid group";
  }
  const queryString = qs.stringify({
    populate: ["photo", "socialLinks"],
  });
  const res = await makeApiCall(`/api/authors/${authorId}?${queryString}`, {
    revalidate: 60 * 60 * 8, // eight hours
  });
  return res.json();
}

export async function getGroup(groupId: number): Promise<{ data: App.Group }> {
  if (typeof groupId !== "number") {
    throw "Not a valid group";
  }
  const res = await makeApiCall(`/api/groups/${groupId}`);
  return res.json();
}
export async function getStream(
  streamId: number
): Promise<{ data: App.Stream }> {
  if (typeof streamId !== "number") {
    throw "Not a valid group";
  }
  const res = await makeApiCall(`/api/streams/${streamId}`);
  return res.json();
}

export async function getSiteConfig(): Promise<{ data: App.SiteConfig }> {
  const res = await makeApiCall(`/api/site-config?populate=*`);
  return res.json();
}

export async function getAuthors({
  displayOnMasthead = false,
}: { displayOnMasthead?: boolean } = {}): Promise<{ data: App.Author[] }> {
  const query = qs.stringify({
    sort: ["name:asc"],
    populate: ["photo"],
    filters: displayOnMasthead
      ? {
          displayOnMasthead: { $eq: displayOnMasthead },
        }
      : {},
  });
  const res = await makeApiCall(`/api/authors?${query}`);
  return res.json();
}

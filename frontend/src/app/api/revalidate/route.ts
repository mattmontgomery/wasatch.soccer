import type { NextRequest } from "next/server";
import { getPost, getPosts } from "@/app/util/api";
import { getGroupUrl, getPostUrl, getStreamUrl } from "@/app/util/urls";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const headerSecret = req.headers.get("x-secret");

  if (secret !== headerSecret) {
    return Response.json(
      {
        ok: 0,
      },
      {
        status: 401,
      }
    );
  }
  const { event, model, entry } = await req.json();

  if (model && typeof paths[model] !== "undefined") {
    const path = paths[model](entry);
    const collectedPaths: string[] = [];
    for await (const p of path) {
      if (typeof p === "function") {
        const _paths = await p(event);
        collectedPaths.push(..._paths);
      } else if (typeof p === "string") {
        collectedPaths.push(p);
      }
    }
    const collect = Object.keys(
      collectedPaths.reduce((acc, curr) => ({ ...acc, [curr]: 1 }), {})
    );
    const responses = await Promise.all(collect.map((p) => revalidate(p)));
    console.info(responses);
    return Response.json({
      meta: responses,
      ok: 1,
    });
  } else {
    return Response.json({
      ok: -1,
    });
  }
}

type Events =
  | "entry.update"
  | "entry.unpublish"
  | "entry.publish"
  | "media.update"
  | "media.create"
  | "entry.delete";

type RevalidateType =
  | string
  | ((event: Events) => string[])
  | RevalidatePromiseType;

type RevalidatePromiseType = (event: Events) => Promise<string[]>;

async function revalidate(path: string): Promise<number> {
  console.info(`[revalidate] ${path}`);
  try {
    revalidatePath(path);
    return 1;
  } catch (e) {
    console.info(`[revalidate] ${path} failure for ${e}`);
    return -1;
  }
}

export const paths: Record<
  string,
  (entry: {
    id: number;
    slug: string;
    published?: string;
    publishedAt?: string;
  }) => RevalidateType[]
> = {
  page: (entry: { id: number; slug: string }) => [
    entry.slug === "homepage" ? "/" : `/${entry.slug}`,
  ],
  stream: (entry: { id: number; slug: string }) => [
    `/streams/${entry.id}/${entry.slug}`,
  ],
  author: (entry: { id: number; slug: string }) => [
    `/authors/${entry.id}/${entry.slug}`,
  ],
  post: (entry: {
    id: number;
    slug: string;
    createdAt?: string;
    published?: string;
    publishedAt?: string;
  }) => [revalidatePost(entry)],
};

function revalidatePost(entry: {
  id: number;
  slug: string;
  createdAt?: string;
  published?: string;
  publishedAt?: string;
}): RevalidatePromiseType {
  return async (event: Events) => {
    return await getPostRevalidations(entry.id, event);
  };
}

async function getPostRevalidations(
  postId: number,
  event: Events
): Promise<string[]> {
  const revalidations: string[] = [];

  const post = await getPost(postId);

  if (!post.data.attributes.publishedAt) {
    return [];
  }

  if (event === "entry.publish") {
    revalidations.push("/");
  } else {
    revalidations.push(getPostUrl(post.data));
  }
  // if the post is on the homepage, and it's not newly published, revalidate the homepage
  if (!revalidations.includes("/")) {
    // if in the first 18 posts
    const posts = await getPosts({
      pagination: {
        pageSize: 18,
        page: 1,
      },
    });
    // if the post is one the homepage and has been updated, send a revalidate request
    if (posts.data.find((_post) => _post.id === post.data.id) ? "/" : "") {
      revalidations.push("/");
    }
  }
  // if the post is published
  if (event === "entry.publish" || event === "entry.unpublish") {
    const streams = post.data.attributes.streams.data;
    revalidations.push(
      ...streams?.map((stream) => {
        return getStreamUrl(stream);
      })
    );
    const groups = post.data.attributes.groups.data;
    revalidations.push(
      ...groups?.map((group) => {
        return getGroupUrl(group);
      })
    );
  }

  return revalidations;
}

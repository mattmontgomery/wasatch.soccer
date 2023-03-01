import { getPost, getPosts } from "@/app/util/api";
import { getGroupUrl, getPostUrl, getStreamUrl } from "@/app/util/urls";
import { NextApiRequest, NextApiResponse } from "next";

export default async function RevalidateHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET;
  const headerSecret = req.headers["x-secret"];

  if (secret !== headerSecret) {
    res.status(401).json({
      ok: 0,
    });
    return;
  }
  const { event, model, entry } = req.body;

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
    for await (const p of collectedPaths) {
      await revalidate(res, p);
    }
    res.json({
      meta: collectedPaths,
      ok: 1,
    });
  } else {
    res.json({
      ok: 1,
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

async function revalidate(res: NextApiResponse, path: string): Promise<void> {
  console.info(`[revalidate] ${path}`);
  try {
    return res.revalidate(path).catch((reason) => {});
  } catch (e) {
    console.info(`[revalidate] ${path} failure`);
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

  if (event === "entry.publish" && post.data.attributes.publishedAt) {
    revalidations.push("/");
  }
  revalidations.push(getPostUrl(post.data));
  // if the post is updated and the
  if (
    post.data.attributes.publishedAt &&
    [
      "entry.update",
      "entry.unpublish",
      "media.update",
      "media.create",
      "entry.delete",
    ].includes(event)
  ) {
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
  if (post.data.attributes.publishedAt) {
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

  console.log(revalidations);

  return revalidations;
}

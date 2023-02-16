import { getPosts } from "@/app/util/api";
import { getPostUrl, getPostUrlFromPieces } from "@/app/util/urls";
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
    if (Array.isArray(path)) {
      for await (const p of path) {
        await revalidate(res, event, p);
      }
    } else {
      await revalidate(res, event, path);
    }
    res.json({
      meta: path,
      ok: 1,
    });
  } else {
    res.json({
      ok: 1,
    });
  }
}

type RevalidateType =
  | string
  | ((event: string) => string)
  | ((event: string) => Promise<string>);

async function revalidate(
  res: NextApiResponse,
  event: string,
  path: RevalidateType
): Promise<void> {
  if (typeof path === "string") {
    await res.revalidate(path);
  }
  if (typeof path === "function") {
    const p = await path(event);
    if (p) {
      await res.revalidate(p);
    }
  }
}

export const paths: Record<
  string,
  (entry: {
    id: number;
    slug: string;
    published?: string;
    publishedAt?: string;
  }) => RevalidateType | RevalidateType[]
> = {
  page: (entry: { id: number; slug: string }) =>
    entry.slug === "homepage" ? "/" : `/${entry.slug}`,
  stream: (entry: { id: number; slug: string }) =>
    `/streams/${entry.id}/${entry.slug}`,
  author: (entry: { id: number; slug: string }) =>
    `/authors/${entry.id}/${entry.slug}`,
  post: (entry: {
    id: number;
    slug: string;
    createdAt?: string;
    published?: string;
    publishedAt?: string;
  }) => [
    getPostUrlFromPieces({
      slug: entry.slug,
      id: String(entry.id),
      date: entry.published ?? entry.publishedAt ?? entry.createdAt ?? "-",
    }),
    async (event) => {
      if (event === "entry.publish") {
        return "/";
      }
      if (
        entry.publishedAt &&
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
        return posts.data.find((post) => post.id === entry.id) ? "/" : "";
      } else {
        return "";
      }
    },
  ],
};

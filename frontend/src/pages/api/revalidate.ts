import { formatDateForPathname } from "@/app/util/api";
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
    await res.revalidate(path);
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

export const paths: Record<
  string,
  (entry: {
    id: number;
    slug: string;
    published?: string;
    publishedAt?: string;
  }) => string
> = {
  stream: (entry: { id: number; slug: string }) =>
    `/streams/${entry.id}/${entry.slug}`,
  author: (entry: { id: number; slug: string }) =>
    `/authors/${entry.id}/${entry.slug}`,
  post: (entry: {
    id: number;
    slug: string;
    published?: string;
    publishedAt?: string;
  }) =>
    `/post/${formatDateForPathname(
      entry.published ?? entry.publishedAt ?? ""
    )}/${entry.id}/${entry.slug}`,
};

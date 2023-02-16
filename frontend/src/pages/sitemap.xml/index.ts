import { getPosts } from "@/app/util/api";
import { NextApiResponse } from "next";

import { format, subDays } from "date-fns";

import { js2xml, Element } from "xml-js";

export default async function generateSitemap() {}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const date = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const posts = await getPosts({
    populate: "",
    pagination: {
      pageSize: 250,
    },
  });
  const xml = js2xml({
    elements: [
      {
        type: "element",
        name: "urlset",
        attributes: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
          "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        },
        elements: posts.data?.map((post) => ({
          type: "element",
          name: "url",
          elements: [
            {
              type: "element",
              name: "loc",
              elements: [{ type: "text", text: getFullPathname(post) }],
            },
            {
              type: "element",
              name: "lastmod",
              elements: [
                {
                  type: "text",
                  text: format(
                    new Date(post.attributes.updatedAt),
                    "yyyy-MM-dd"
                  ),
                },
              ],
            },
          ],
        })),
      },
    ],
  });
  res.setHeader("Content-Type", "text/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>${xml}`);
  res.end();
  return {
    props: {},
  };
}

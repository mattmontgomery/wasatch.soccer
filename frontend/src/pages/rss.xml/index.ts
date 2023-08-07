import { getPhoto, getPhotoPath, getPosts } from "@/app/util/api";
import { NextApiResponse } from "next";

import { format, subDays } from "date-fns";

import { js2xml } from "xml-js";
import { getConfig } from "@/app/util/config";

import { getFullPathname, getPostUrl } from "@/app/util/urls";
import { LRUCache } from "lru-cache";

export default async function generateSitemap() {}

const cache = new LRUCache({
  max: 500,
  ttl: 60 * 30_000, // 30 minutes ttl
});

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const siteConfig = await getConfig();
  const date = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const posts = cache.has("posts")
    ? (cache.get("posts") as Awaited<ReturnType<typeof getPosts>>)
    : (await getPosts({
        populate: ["leadPhoto", "authors"],
        pagination: {
          pageSize: 50,
        },
        sort: ["published:desc"],
      })) ?? { data: [] };
  if (!cache.has("posts")) {
    cache.set("posts", posts);
  }
  const xml = js2xml(
    {
      elements: [
        {
          type: "element",
          name: "rss",
          attributes: {
            version: "2.0",
            "xmlns:dc": "http://purl.org/dc/elements/1.1/",
          },
          elements: [
            {
              type: "element",
              name: "channel",

              elements: [
                {
                  type: "element",
                  name: "title",
                  elements: [
                    {
                      type: "text",
                      text: siteConfig.siteName,
                    },
                  ],
                },
                {
                  type: "element",
                  name: "description",
                  elements: [
                    {
                      type: "text",
                      text: siteConfig.siteDescription,
                    },
                  ],
                },
                {
                  type: "element",
                  name: "link",
                  elements: [
                    {
                      type: "text",
                      text: process.env.SITE_BASE,
                    },
                  ],
                },
                {
                  type: "element",
                  name: "language",
                  elements: [
                    {
                      type: "text",
                      text: process.env.SITE_LANGUAGE_LOCALE ?? "en-us",
                    },
                  ],
                },
                {
                  type: "element",
                  name: "pubDate",
                  elements: [
                    {
                      type: "text",
                      text: new Date(
                        posts?.data?.[0]?.attributes.published ??
                          posts?.data?.[0]?.attributes.publishedAt
                      ).toUTCString(),
                    },
                  ],
                },
                ...posts?.data?.map((post) => {
                  const photo = getPhoto(post, "large");
                  return {
                    type: "element",
                    name: "item",
                    elements: [
                      {
                        type: "element",
                        name: "title",
                        elements: [
                          {
                            type: "text",
                            text: post.attributes.headline,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "link",
                        elements: [
                          {
                            type: "text",
                            text: getFullPathname(post),
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "description",
                        elements: [
                          {
                            type: "text",
                            text: post.attributes.summary,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "pubDate",
                        elements: [
                          {
                            type: "text",
                            text: new Date(
                              post.attributes.publishedAt
                            ).toUTCString(),
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "guid",
                        elements: [
                          {
                            type: "text",
                            text: getPostUrl(post),
                          },
                        ],
                      },
                      ...post.attributes.authors?.data.map((author) => ({
                        type: "element",
                        name: "dc:creator",
                        elements: [
                          {
                            type: "text",
                            text: author.attributes.name,
                          },
                        ],
                      })),
                      {
                        type: "element",
                        name: "enclosure",
                        elements: [
                          {
                            type: "text",
                            text: photo ? getPhotoPath(photo.url) : "",
                          },
                        ],
                      },
                    ],
                  };
                }),
              ],
            },
          ],
        },
      ],
    },
    {
      // compact: false,
    }
  );
  res.setHeader("Content-Type", "text/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>${xml}`);
  res.end();
  return {
    props: {},
  };
}

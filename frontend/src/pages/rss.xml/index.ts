import { getFullPathname, getPathname, getPosts } from "@/app/util/api";
import { NextApiResponse } from "next";

import { format, subDays } from "date-fns";

import { js2xml } from "xml-js";
import { getConfig } from "@/app/util/config";

export default async function generateSitemap() {}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const siteConfig = await getConfig();
  const date = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const posts = await getPosts({
    populate: "",
    pagination: {
      pageSize: 50,
    },
    sort: ["published:desc"],
  });
  const xml = js2xml(
    {
      elements: [
        {
          type: "element",
          name: "rss",
          attributes: {
            version: "2.0",
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
                  name: "link",
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
                        posts.data?.[0]?.attributes.publishedAt
                      ).toUTCString(),
                    },
                  ],
                },
                ...posts.data?.map((post) => ({
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
                  ],
                })),
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

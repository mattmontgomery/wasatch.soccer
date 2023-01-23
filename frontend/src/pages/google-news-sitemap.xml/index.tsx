import { getFullPathname, getPathname, getPosts } from "@/app/util/api";
import { NextApiResponse } from "next";

import { format, subDays } from "date-fns";

import { js2xml, Element } from "xml-js";

export default async function generateSitemap() {}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
  const date = format(subDays(new Date(), 2), "yyyy-MM-dd");
  const posts = await getPosts({
    populate: "",
    filters: {
      published: {
        $gte: date,
      },
    },
  });
  const xml = js2xml(
    {
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
                name: "news:news",
                elements: [
                  {
                    type: "element",
                    name: "news:publication",
                    elements: [
                      {
                        type: "element",
                        name: "news:name",
                        elements: [
                          {
                            type: "text",
                            text: "Wasatch Soccer Sentinel",
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "news:language",
                        elements: [
                          {
                            type: "text",
                            text: "en",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "element",
                    name: "news:publication_date",
                    elements: [
                      {
                        type: "text",
                        text: format(
                          new Date(post.attributes.published),
                          "yyyy-MM-dd"
                        ),
                      },
                    ],
                  },
                  {
                    type: "element",
                    name: "news:title",
                    text: post.attributes.headline,
                    elements: [
                      {
                        type: "text",
                        text: post.attributes.headline,
                      },
                    ],
                  },
                ],
              },
              //       "news:news": {
              //         "news:publication": {
              //           "news:name": "Wasatch Soccer Sentinel",
              //           "news:language": "en",
              //         },
              //         "news:publication_date": format(
              //           new Date(post.attributes.published),
              //           "yyyy-MM-dd"
              //         ),
              //         "news:title": post.attributes.headline,
              //       },
            ],
          })),
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

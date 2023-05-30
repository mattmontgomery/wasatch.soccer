import type { PluginOptions } from "@strapi/strapi";

export default function ({ env }): PluginOptions {
  return {
    publisher: {
      enabled: true,
    },
    meilisearch: {
      config: {
        post: {
          settings: {
            sortableAttributes: ["published", "publishedAt"],
            synonyms: {
              rsl: ["real salt lake"],
            },
          },
        },
      },
    },
    redis: {
      config: {
        connections: {
          default: {
            connection: {
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
              db: 0,
              user: process.env.REDIS_USERNAME,
              password: process.env.REDIS_PASSWORD,
            },
          },
        },
      },
    },
    "rest-cache": {
      config: {
        provider: {
          name: "redis",
          options: {
            max: 32767,
            connection: "default",
          },
        },
        strategy: {
          keysPrefix: "strapi",
          hitpass: false,
          contentTypes: [
            // list of Content-Types UID to cache
            "api::post.post",
            "api::group.group",
            "api::author.author",
            "api::site-config.site-config",
          ],
        },
      },
    },
    upload: {
      config: {
        provider: "aws-s3",
        providerOptions: {
          s3Options: {
            accessKeyId: env("AWS_ACCESS_KEY_ID"),
            secretAccessKey: env("AWS_ACCESS_SECRET"),
            region: env("AWS_REGION"),
            params: {
              Bucket: env("AWS_BUCKET"),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
}

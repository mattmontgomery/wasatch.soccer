export default function ({ env }) {
  return {
    publisher: {
      enabled: true,
    },
    search: {
      enabled: true,
      config: {
        provider: "algolia",
        providerOptions: {
          apiKey: env("ALGOLIA_PROVIDER_ADMIN_API_KEY"),
          applicationId: env("ALGOLIA_PROVIDER_APPLICATION_ID"),
        },
        debug: true,
        prefix: "wss_",
        contentTypes: [
          {
            name: "api::post.post",
            index: "posts",
            fields: [
              "headline",
              "summary",
              "slug",
              "authors",
              "published",
              "commentsEnabled",
              "leadPhoto",
            ],
          },
        ],
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

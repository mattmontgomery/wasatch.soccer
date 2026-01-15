import type { CmsArticle } from "./getCmsArticle";

export default function mapCmsArticleToPost(
  cmsArticle: CmsArticle
): App.Post {
  // Sort authors by order, separating primary authors from contributors
  const sortedAuthors = [...cmsArticle.authors].sort((a, b) => a.order - b.order);

  return {
    id: cmsArticle.id,
    attributes: {
      createdAt: cmsArticle.createdAt,
      publishedAt: cmsArticle.publishedAt || cmsArticle.createdAt,
      updatedAt: cmsArticle.updatedAt,
      body: cmsArticle.content,
      headline: cmsArticle.title,
      published: cmsArticle.publishedAt || cmsArticle.createdAt,
      slug: cmsArticle.slug,
      summary: cmsArticle.summary || "",
      commentsEnabled: false, // CMS articles don't have comments enabled by default
      leadPhoto: {
        data: cmsArticle.leadImageUrl
          ? {
              attributes: {
                alternativeText: cmsArticle.leadImageAlt || cmsArticle.title,
                caption: cmsArticle.leadImageCredit || "",
                height: 0, // Unknown from CMS API
                width: 0, // Unknown from CMS API
                url: cmsArticle.leadImageUrl,
                formats: {},
                ext: "",
                hash: "",
                mime: "",
                path: "",
                size: 0,
              },
            }
          : null,
      },
      groups: {
        data: [],
      },
      primaryGroup: {
        data: null,
      },
      tags: cmsArticle.tags,
      authors: {
        data: sortedAuthors
          .filter((author) => !author.isContributor)
          .map((author) => ({
            id: author.authorId,
            attributes: {
              name: author.author.name,
              title: "",
              slug: author.author.name.toLowerCase().replace(/\s+/g, "-"),
              bio: "",
              photo: {
                data: {
                  attributes: {
                    alternativeText: author.author.name,
                    caption: "",
                    height: 0,
                    width: 0,
                    url: "",
                    formats: {},
                    ext: "",
                    hash: "",
                    mime: "",
                    path: "",
                    size: 0,
                  },
                },
              },
              socialLinks: {
                facebook: "",
                github: "",
                instagram: "",
                mastodon: "",
                podcast: "",
                twitter: "",
                website: "",
                youtube: "",
              },
              createdAt: author.createdAt,
              updatedAt: author.createdAt,
            },
          })),
      },
      streams: {
        data: [],
      },
      relatedPosts: {
        data: [],
      },
      postModules: {
        data: [],
      },
      photoGallery: {
        data: [],
      },
    },
  };
}

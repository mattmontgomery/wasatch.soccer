import qs from "qs";
import { makeApiCall } from "@/app/util/api";
import getCmsArticles from "@/app/util/api/cms/getCmsArticles";
import mapCmsArticleToPost from "@/app/util/api/cms/mapCmsArticleToPost";

export default async function getPosts({
  sort = ["published:desc", "publishedAt:desc"],
  pagination = {},
  filters = {},
  populate = "*",
}: {
  filters?: {
    id?:
      | {
          $ne?: number;
        }
      | { $eq?: number };
    authors?: {
      id: {
        $eq: number;
      };
      slug: {
        $eq: string;
      };
    };
    groups?: {
      id:
        | {
            $eq: number;
          }
        | {
            $in: number[];
          };
    };
    published?: {
      $gte?: string;
      $lte?: string;
    };
    streams?: {
      id: {
        $eq: number;
      };
    };
  };
  pagination?: {
    pageSize?: number;
    page?: number;
    withCount?: number;
  };
  populate?: string | string[];
  sort?: string[];
} = {}): Promise<{
  data: App.Post[];
  meta: Required<App.Meta>;
}> {
  const pageSize = pagination.pageSize || 10;
  const page = pagination.page || 1;

  // If filters are present (authors, groups, streams, etc.), only fetch from legacy CMS
  // CMS articles don't have these relationships yet
  const hasFilters =
    filters.authors || filters.groups || filters.streams || filters.id;

  if (hasFilters) {
    // Fetch only from legacy CMS when filters are present
    const now = new Date().toISOString();
    const queryString = qs.stringify(
      {
        populate,
        pagination,
        sort,
        publicationState:
          process.env.NODE_ENV === "development" ? "preview" : "live",
        filters: {
          ...filters,
          published: {
            ...(filters.published ? filters.published : {}),
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await makeApiCall(`/api/posts?${queryString}`);
    return res.json();
  }

  // For general post listing (homepage, etc.), fetch CMS articles first
  // then supplement with legacy posts if needed
  const cmsArticlesResponse = await getCmsArticles();
  const cmsPosts = cmsArticlesResponse.data.map((article) =>
    mapCmsArticleToPost(article)
  );

  // Calculate how many more posts we need from the legacy CMS
  const neededFromLegacy = Math.max(0, pageSize - cmsPosts.length);

  let legacyPosts: App.Post[] = [];
  let legacyMeta: Required<App.Meta> = {
    pagination: {
      page: 1,
      pageSize: 0,
      pageCount: 1,
      total: 0,
    },
  };

  if (neededFromLegacy > 0) {
    // Fetch from legacy CMS
    const now = new Date().toISOString();
    const queryString = qs.stringify(
      {
        populate,
        pagination: {
          pageSize: neededFromLegacy,
          page: 1,
          withCount: pagination.withCount,
        },
        sort,
        publicationState:
          process.env.NODE_ENV === "development" ? "preview" : "live",
        filters: {
          ...filters,
          published: {
            ...(filters.published ? filters.published : {}),
          },
        },
      },
      {
        encodeValuesOnly: true,
      }
    );
    const res = await makeApiCall(`/api/posts?${queryString}`);
    const legacyResponse = await res.json();
    legacyPosts = legacyResponse.data || [];
    legacyMeta = legacyResponse.meta;
  }

  // Combine CMS posts and legacy posts, sorted by published date
  const allPosts = [...cmsPosts, ...legacyPosts].sort((a, b) => {
    const dateA = new Date(a.attributes.publishedAt || a.attributes.published);
    const dateB = new Date(b.attributes.publishedAt || b.attributes.published);
    return dateB.getTime() - dateA.getTime();
  });

  // Apply pagination to the combined results
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  const totalPosts = cmsPosts.length + (legacyMeta.pagination?.total || 0);

  return {
    data: paginatedPosts,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount: Math.ceil(totalPosts / pageSize),
        total: totalPosts,
      },
    },
  };
}

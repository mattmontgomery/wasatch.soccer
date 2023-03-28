import qs from "qs";
import { makeApiCall } from "@/app/util/api";

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
          // ...(process.env.NODE_ENV === "development" ? {} : { $lte: now }),
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

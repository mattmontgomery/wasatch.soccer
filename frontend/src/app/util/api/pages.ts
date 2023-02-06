import QueryString from "qs";
import { makeApiCall } from "../api";

export async function fetchPage(slug: string): Promise<{ data: App.Page[] }> {
  const queryString = QueryString.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    publicationState:
      process.env.NODE_ENV === "development" ? "preview" : "live",
    populate: {
      groups: "*",
      gridSlots: {
        on: {
          "modules.auto-post": {
            populate: [
              "pinnedPost.leadPhoto",
              "pinnedPost.authors",
              "pinnedPost.groups",
              "pinnedPost.primaryGroup",
            ],
          },
          "modules.stream": {
            populate: "*",
          },
          "modules.text": {
            populate: "*",
          },
          "modules.feed": {
            populate: "*",
          },
          "modules.newsletter": {
            populate: "*",
          },
        },
      },
    },
  });
  return (await makeApiCall(`/api/pages?${queryString}`)).json();
}

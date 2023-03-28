import qs from "qs";
import { makeApiCall } from "@/app/util/api";

export default async function getPost(postId: number): Promise<{
  data: App.Post;
}> {
  const query = {
    publicationState:
      process.env.NODE_ENV === "development" ? "preview" : "live",
    populate: {
      leadPhoto: "*",
      authors: "*",
      groups: "*",
      primaryGroup: "*",
      streams: "*",
      relatedPosts: "*",
      postModules: "*",
      photoGallery: "*",
    },
  };
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  return (
    await makeApiCall(`/api/posts/${postId}?${queryString}`, {
      revalidate: 300,
    })
  ).json();
}

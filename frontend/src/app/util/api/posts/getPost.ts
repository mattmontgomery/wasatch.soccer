import qs from "qs";
import { makeApiCall } from "@/app/util/api";

export default async function getPost(postId: number): Promise<{
  data: App.Post;
}> {
  const queryString = qs.stringify({
    populate: ["leadPhoto", "authors", "groups", "primaryGroup", "streams"],
  });
  const res = await makeApiCall(`/api/posts/${postId}?${queryString}`, {
    revalidate: 300,
  });
  return res.json();
}

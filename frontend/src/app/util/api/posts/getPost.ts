import qs from "qs";
import { makeApiCall } from "@/app/util/api";
import getCmsArticle from "@/app/util/api/cms/getCmsArticle";
import mapCmsArticleToPost from "@/app/util/api/cms/mapCmsArticleToPost";

export default async function getPost(postId: number): Promise<{
  data: App.Post | null;
}> {
  // For IDs >= 1000, fetch from CMS API
  if (postId >= 1000) {
    const { data: cmsArticle } = await getCmsArticle(postId);
    if (!cmsArticle) {
      return { data: null };
    }
    return { data: mapCmsArticleToPost(cmsArticle) };
  }

  // For IDs < 1000, use the existing Strapi API
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
      revalidate: 15,
    })
  ).json();
}

import { getPhoto, getPhotoPath } from "@/app/util/api";

export default function getMetadataPhoto(post: App.Post) {
  const photo = getPhoto(post, "small") as App.PhotoBasics;
  return {
    url: getPhotoPath(photo.url),
    width: photo.width,
    height: photo.height,
    alt:
      post.attributes.leadPhoto.data?.attributes.alternativeText ??
      post.attributes.headline,
  };
}

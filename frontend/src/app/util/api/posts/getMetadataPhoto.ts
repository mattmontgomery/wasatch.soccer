import { getPhoto, getPhotoPath } from "@/app/util/api";

export default function getMetadataPhoto(post: App.Post) {
  const photo = getPhoto(post, "medium") as App.PhotoBasics;
  if (!photo) {
    return;
  }
  return {
    url: getPhotoPath(photo.url),
    width: photo.width,
    height: photo.height,
    alt:
      post.attributes.leadPhoto.data?.attributes.alternativeText ??
      post.attributes.headline,
  };
}

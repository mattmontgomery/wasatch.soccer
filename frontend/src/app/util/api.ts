import qs from "qs";

export function getPhoto(
  data: App.Post,
  format: string = "large"
): App.PhotoBasics | null {
  return data.attributes.leadPhoto.data
    ? getPhotoRaw(data.attributes.leadPhoto.data, format)
    : null;
}

export function getPhotoRaw(
  photo: App.Photo,
  format: string = "large"
): App.PhotoBasics {
  if (format === "original") {
    return photo.attributes;
  }
  return photo.attributes.formats[format] ?? photo.attributes;
}

export function getPhotoPath(path: string) {
  return path;
}

export { default as getPosts } from "@/app/util/api/posts/getPosts";
export { default as getPost } from "@/app/util/api/posts/getPost";

export { default as getAuthors } from "@/app/util/api/authors/getAuthors";
export { default as getAuthor } from "@/app/util/api/authors/getAuthor";

export { default as getGroup } from "@/app/util/api/groups/getGroup";
export { default as getStream } from "@/app/util/api/streams/getStream";

export { default as getSiteConfig } from "@/app/util/api/siteConfig/getSiteConfig";

export { default as makeApiCall } from "@/app/util/api/makeApiCall";

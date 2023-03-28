import qs from "qs";
import { makeApiCall } from "@/app/util/api";

export default async function getAuthor(
  authorId: number
): Promise<{ data: App.Author }> {
  if (typeof authorId !== "number") {
    throw "Not a valid group";
  }
  const queryString = qs.stringify({
    populate: ["photo", "socialLinks"],
  });
  const res = await makeApiCall(`/api/authors/${authorId}?${queryString}`, {
    revalidate: 60 * 60 * 8, // eight hours
  });
  return res.json();
}

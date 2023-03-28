import { makeApiCall } from "@/app/util/api";

export default async function getStream(
  streamId: number
): Promise<{ data: App.Stream }> {
  if (typeof streamId !== "number") {
    throw "Not a valid group";
  }
  const res = await makeApiCall(`/api/streams/${streamId}`);
  return res.json();
}

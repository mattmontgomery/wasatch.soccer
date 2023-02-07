import { makeApiCall } from "@/app/util/api";

export default async function getGroup(
  groupId: number
): Promise<{ data: App.Group }> {
  if (typeof groupId !== "number") {
    throw "Not a valid group";
  }
  const res = await makeApiCall(`/api/groups/${groupId}`);
  return res.json();
}

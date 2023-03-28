import qs from "qs";
import { makeApiCall } from "@/app/util/api";

export default async function getAuthors({
  displayOnMasthead = false,
}: { displayOnMasthead?: boolean } = {}): Promise<{ data: App.Author[] }> {
  const query = qs.stringify({
    sort: ["name:asc"],
    populate: ["photo"],
    filters: displayOnMasthead
      ? {
          displayOnMasthead: { $eq: displayOnMasthead },
        }
      : {},
  });
  const res = await makeApiCall(`/api/authors?${query}`);
  return res.json();
}

import { makeApiCall } from "@/app/util/api";

export default async function getSiteConfig(): Promise<{
  data: App.SiteConfig;
}> {
  const res = await makeApiCall(`/api/site-config?populate=*`);
  return res.json();
}

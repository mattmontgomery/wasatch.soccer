import { getConfig } from "@/app/util/config";
import { getTitle } from "./util/site";

export default async function Head() {
  const config = await getConfig();
  return (
    <>
      <title>{await getTitle([config.homepageTitleText], true)}</title>
      <meta name="description" content={config.siteDescription} />
    </>
  );
}

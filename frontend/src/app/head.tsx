import Config, { getConfig } from "@/app/util/config";
import DefaultTags from "./DefaultTags";
import { getTitle } from "./util/site";

export default async function Head() {
  const config = await getConfig();
  return (
    <>
      <DefaultTags />
      <title>{await getTitle([config.homepageTitleText], true)}</title>
      <meta name="description" content={config.siteDescription} />
    </>
  );
}

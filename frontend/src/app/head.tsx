import Config, { getConfig } from "@/app/util/config";
import DefaultTags from "./DefaultTags";
import { getTitle } from "./util/site";

export default async function Head() {
  return (
    <>
      <DefaultTags />
      <title>
        {await getTitle([(await getConfig()).homepageTitleText], true)}
      </title>
      <meta name="description" content={Config.siteDescription} />
    </>
  );
}

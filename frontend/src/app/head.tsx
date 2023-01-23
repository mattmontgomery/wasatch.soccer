import Config from "config";
import DefaultTags from "./DefaultTags";

export default function Head() {
  return (
    <>
      <DefaultTags />
      <title>{Config.siteName}</title>
      <meta name="description" content={Config.siteDescription} />
    </>
  );
}

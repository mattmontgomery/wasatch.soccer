import { getSiteConfig } from "./api";

export const Config = {
  __loaded: false,
  siteName: "",
  siteDescription: "",
  homepageTitleText: "",
};
export default Config;

export async function getConfig(): Promise<typeof Config> {
  if (!Config.__loaded) {
    const { data } = await getSiteConfig();
    Config.siteName = data.attributes.siteName;
    Config.siteDescription = data.attributes.siteDescription;
    Config.homepageTitleText = data.attributes.homepageTitleText;
    Config.__loaded = true;
  }
  return Config;
}

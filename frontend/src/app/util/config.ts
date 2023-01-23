import { getSiteConfig } from "./api";

export const Config: {
  __loaded: boolean;
  homepageTitleText: string;
  navigationGroups: App.Group[];
  podcastFeed: string;
  siteDescription: string;
  siteName: string;
} = {
  __loaded: false,
  homepageTitleText: "",
  navigationGroups: [],
  podcastFeed: "",
  siteDescription: "",
  siteName: "",
};
export default Config;

export async function getConfig(): Promise<typeof Config> {
  if (!Config.__loaded) {
    const resp = await getSiteConfig();
    const { data } = resp;
    Config.siteName = data.attributes.siteName;
    Config.siteDescription = data.attributes.siteDescription;
    Config.homepageTitleText = data.attributes.homepageTitleText;
    Config.navigationGroups = data.attributes.navigationGroups.data ?? [];
    Config.podcastFeed = data.attributes.podcastFeed;
    Config.__loaded = true;
  }
  return Config;
}

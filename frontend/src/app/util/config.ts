import { getSiteConfig } from "./api";

export const Config: {
  __loaded: boolean;
  about: string;
  homepageTitleText: string;
  navigationGroups: App.Group[];
  newsletterSignup: string;
  podcastFeed: string;
  siteDescription: string;
  siteName: string;
} = {
  __loaded: false,
  about: "",
  homepageTitleText: "",
  navigationGroups: [],
  newsletterSignup: "",
  podcastFeed: "",
  siteDescription: "",
  siteName: "",
};

export type Config = typeof Config;
export default Config;

export async function getConfig(): Promise<typeof Config> {
  if (!Config.__loaded) {
    const resp = await getSiteConfig();
    const { data } = resp;
    Config.siteName = data.attributes.siteName;
    Config.siteDescription = data.attributes.siteDescription;
    Config.about = data.attributes.about;
    Config.homepageTitleText = data.attributes.homepageTitleText;
    Config.navigationGroups = data.attributes.navigationGroups.data ?? [];
    Config.newsletterSignup = data.attributes.newsletterSignup;
    Config.podcastFeed = data.attributes.podcastFeed;
    Config.__loaded = true;
  }
  return Config;
}

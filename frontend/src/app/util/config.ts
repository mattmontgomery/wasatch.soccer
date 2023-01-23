import { getSiteConfig } from "./api";

export const Config: {
  __loaded: boolean;
  siteName: string;
  siteDescription: string;
  homepageTitleText: string;
  navigationGroups: App.Group[];
} = {
  __loaded: false,
  siteName: "",
  siteDescription: "",
  homepageTitleText: "",
  navigationGroups: [],
};
export default Config;

export async function getConfig(): Promise<typeof Config> {
  if (!Config.__loaded) {
    const { data } = await getSiteConfig();
    Config.siteName = data.attributes.siteName;
    Config.siteDescription = data.attributes.siteDescription;
    Config.homepageTitleText = data.attributes.homepageTitleText;
    Config.navigationGroups = data.attributes.navigationGroups.data ?? [];
    Config.__loaded = true;
  }
  return Config;
}

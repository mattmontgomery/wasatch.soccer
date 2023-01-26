import { getSiteConfig } from "./api";

export const Config: {
  __loaded: boolean;
  about: string;
  homepageTitleText: string;
  logo: {
    dark: string;
    light: string;
  };
  navigationGroups: App.Group[];
  newsletterSignup: string;
  podcastFeed: string;
  siteDescription: string;
  siteName: string;
  theme: {
    primary: string;
    primaryContrast: string;
    primaryDark: string;
    alternate: string;
    alternateContrast: string;
    alternateDark: string;
  };
} = {
  __loaded: false,
  about: "",
  homepageTitleText: "",
  logo: {
    dark: "",
    light: "",
  },
  navigationGroups: [],
  newsletterSignup: "",
  podcastFeed: "",
  siteDescription: "",
  siteName: "",
  theme: {
    primary: "",
    primaryContrast: "",
    primaryDark: "",
    alternate: "",
    alternateContrast: "",
    alternateDark: "",
  },
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
    Config.theme.primary = data.attributes.themePrimary ?? "";
    Config.theme.primaryContrast = data.attributes.themePrimaryContrast ?? "";
    Config.theme.primaryDark =
      data.attributes.themePrimaryDark ?? data.attributes.themePrimary;
    Config.theme.alternate = data.attributes.themeAlternate ?? "";
    Config.theme.alternateContrast =
      data.attributes.themeAlternateContrast ?? "";
    Config.theme.alternateDark =
      data.attributes.themeAlternateDark ?? data.attributes.themeAlternate;
    Config.logo.dark = data.attributes.logoDarkMode;
    Config.logo.light = data.attributes.logoLightMode;
    Config.__loaded = true;
  }
  return Config;
}

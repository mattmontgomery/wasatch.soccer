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
  navigationItems: App.SiteConfig["attributes"]["navigationItems"][];
  newsletterSignup: string;
  podcastFeed: string;
  siteDescription: string;
  siteName: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
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
  navigationItems: [],
  newsletterSignup: "",
  podcastFeed: "",
  siteDescription: "",
  siteName: "",
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
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
    Config.navigationItems = data.attributes.navigationItems;
    Config.newsletterSignup = data.attributes.newsletterSignup;
    Config.podcastFeed = data.attributes.podcastFeed;

    /**
     * Theming
     */
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

    /**
     * Social Media
     */
    Config.social.facebook = data.attributes.facebook ?? "";
    Config.social.instagram = data.attributes.instagram ?? "";
    Config.social.twitter = data.attributes.twitter ?? "";

    Config.__loaded = true;
  }
  return Config;
}

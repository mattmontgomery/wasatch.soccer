declare namespace App {
  type SiteConfig = {
    attributes: {
      about: string;
      siteName: string;
      siteDescription: string;
      homepageTitleText: string;
      logoDarkMode: string;
      logoLightMode: string;
      navigationGroups: {
        data: Group[];
      };
      navigationItems: { url: string; label: string; id: number }[];
      newsletterSignup: string;
      podcastFeed: string;
      themePrimary: string;
      themePrimaryContrast: string;
      themePrimaryDark: string;
      themeAlternate: string;
      themeAlternateContrast: string;
      themeAlternateDark: string;

      // social handles
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  type Page = {
    id: number;
    attributes: {
      gridSlots: (
        | GridSlots.AutoPost
        | GridSlots.Feed
        | GridSlots.Newsletter
        | GridSlots.Stream
        | GridSlots.Text
      )[];
      title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      slug: string;
      groups: { data: Group[] };
    };
  };
  namespace GridSlots {
    type Generic = {
      id: number;
      __component: string;
    };
    type AutoPost = Generic & {
      __component: "modules.auto-post";
      isHero: boolean;
      pinnedPost: { data: App.Post };
    };
    type Feed = Generic & {
      __component: "modules.feed";
      feedUrl: string;
      title: string;
      body: string;
    };
    type Newsletter = Generic & {
      __component: "modules.newsletter";
      feedUrl: string;
      title: string;
      body: string;
      url: string;
    };
    type Text = Generic & {
      __component: "modules.text";
      body: string;
      coverImage: { data: App.Photo };
      title: string;
      url: string;
    };
    type Stream = Generic & {
      __component: "modules.stream";
      stream: { data: App.Stream };
      coverImage: { data: App.Photo };
    };
  }
  type Post = {
    id: number;
    attributes: {
      headline: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      published: string;
      slug: string;
      summary: string;
      body: string;
      leadPhoto: {
        data: Photo | null;
      };
      groups: {
        data: Group[];
      };
      primaryGroup: {
        data: Group | null;
      };
      authors: {
        data: Author[];
      };
      streams: {
        data: Stream[];
      };
    };
  };
  type Photo = {
    attributes: {
      alternativeText: string;
      caption: string;
      height: number;
      width: number;
      url: string;
      formats: Record<string, PhotoBasics>;
    } & PhotoBasics;
  };
  type PhotoBasics = {
    ext: string;
    hash: string;
    height: number;
    mime: string;
    path: string;
    size: number;
    url: string;
    width: number;
  };
  type Author = {
    id: number;
    attributes: {
      name: string;
      title: string;
      slug: string;
      bio: string;
      photo: {
        data: Photo;
      };
      socialLinks: SocialLinks;
      createdAt: string;
      updatedAt: string;
    };
  };
  type Group = {
    id: number;
    attributes: {
      name: string;
      slug: string;
      groupType: "column" | "section" | "grouping";
    };
  };
  type Stream = {
    id: number;
    attributes: {
      name: string;
      slug: string;
      body: string;
    };
  };
  type Meta = {
    pagination?: Pagination;
  };
  type Pagination = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  type SocialLinks = {
    facebook: string;
    github: string;
    instagram: string;
    mastodon: string;
    podcast: string;
    twitter: string;
    website: string;
    youtube: string;
  };
}

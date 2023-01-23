declare namespace App {
  type SiteConfig = {
    attributes: {
      siteName: string;
      siteDescription: string;
      homepageTitleText: string;
      navigationGroups: {
        data: Group[];
      };
      podcastFeed: string;
    };
  };
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
        data: {
          attributes: {
            formats: Record<string, Photo>;
            caption: string;
          };
        };
      };
      groups: {
        data: Group[];
      };
      primaryGroup: {
        data: {
          id: number;
          attributes: {
            name: string;
          };
        };
      };
      authors: {
        data: Author[];
      };
    };
  };
  type Photo = {
    height: number;
    width: number;
    url: string;
  };
  type Author = {
    id: number;
    attributes: {
      name: string;
      slug: string;
      bio: string;
      photo: {
        attributes: {
          formats: Record<string, Photo>;
          caption: string;
        };
      };
      createdAt: string;
      updatedAt: string;
    };
  };
  type Group = {
    id: number;
    attributes: {
      name: string;
      slug: string;
    };
  };
}

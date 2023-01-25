declare namespace App {
  type SiteConfig = {
    attributes: {
      about: string;
      siteName: string;
      siteDescription: string;
      homepageTitleText: string;
      navigationGroups: {
        data: Group[];
      };
      newsletterSignup: string;
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
            caption: string;
            formats: Record<string, Photo>;
            height: number;
            width: number;
            url: string;
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
      streams: {
        data: Stream[];
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
      title: string;
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
}

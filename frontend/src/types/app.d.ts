declare namespace App {
  type Post = {
    id: number;
    attributes: {
      headline: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      slug: string;
      summary: string;
      body: string;
      leadPhoto: {
        data: {
          attributes: { formats: Record<string, Photo> };
        };
      };
      groups: {
        data: {
          id: number;
          attributes: {
            name: string;
          };
        }[];
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
        data: {
          id: number;
          attributes: {
            name: string;
            createdAt: string;
            updatedAt: string;
          };
        }[];
      };
    };
  };
  type Photo = {
    height: number;
    width: number;
    url: string;
  };
}

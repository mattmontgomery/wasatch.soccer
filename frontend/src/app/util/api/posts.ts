export type PostHit = {
  objectID: string;
  headline: string;
  summary: string;
  body: string;
  slug: string;
  published: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  commentsEnabled: boolean;
  authors: ({
    id: number;
  } & App.Author["attributes"])[];
  groups: ({
    id: number;
  } & App.Group["attributes"])[];
  streams: ({
    id: number;
  } & App.Stream["attributes"])[];
  primaryGroup: {
    id: number;
  } & App.Group["attributes"];
  leadPhoto: {
    id: number;
  } & App.Photo["attributes"];
};

export function convertHitsToPosts(hits: PostHit[]): App.Post[] {
  return hits.map((hit) => {
    const {
      authors,
      groups,
      streams,
      leadPhoto,
      primaryGroup,
      commentsEnabled = false,
      ...remainder
    } = hit;
    return {
      id: Number(hit.objectID ?? -1),
      attributes: {
        authors: { data: [] },
        groups: { data: [] },
        leadPhoto: {
          data: { id: leadPhoto.id, attributes: leadPhoto },
        },
        primaryGroup: {
          data: primaryGroup
            ? {
                id: primaryGroup.id,
                attributes: {
                  ...primaryGroup,
                },
              }
            : null,
        },
        commentsEnabled,
        relatedPosts: { data: [] },
        streams: { data: [] },
        postModules: { data: [] },
        ...remainder,
      },
    };
  });
}

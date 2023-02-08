import type { Hit, Hits } from "meilisearch";

export type PostHit = Hit<{
  _meilisearch_id: string;
  id: number;
  headline: string;
  summary: string;
  body: string;
  slug: string;
  published: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
}>;
export type PostHits = Hits<PostHit>;

export function convertHitsToPosts(hits: PostHit[]): App.Post[] {
  return hits.map((hit) => {
    const { authors, groups, streams, leadPhoto, primaryGroup, ...remainder } =
      hit;

    return {
      id: hit.id,
      attributes: {
        authors: {
          data: authors.map((author): App.Author => {
            return {
              id: author.id,
              attributes: {
                ...author,
              },
            };
          }),
        },
        groups: {
          data: groups.map((author): App.Group => {
            return {
              id: author.id,
              attributes: {
                ...author,
              },
            };
          }),
        },
        leadPhoto: {
          data: leadPhoto
            ? {
                id: leadPhoto.id,
                attributes: {
                  ...leadPhoto,
                },
              }
            : null,
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
        streams: {
          data: streams.map((data): App.Stream => {
            return {
              id: data.id,
              attributes: {
                ...data,
              },
            };
          }),
        },
        relatedPosts: { data: [] },
        ...remainder,
      },
    };
  });
}

/**
 * Type '{ id: number; attributes: { _meilisearch_id: string; id: number; headline: string; summary: string; body: string; slug: string; published: string; createdAt: string; updatedAt: string; publishedAt: string; ... 4 more ...; leadPhoto: { ...; }; }; }[]' is not assignable to type 'Partial<Post>[]'.
  Type '{ id: number; attributes: { _meilisearch_id: string; id: number; headline: string; summary: string; body: string; slug: string; published: string; createdAt: string; updatedAt: string; publishedAt: string; ... 4 more ...; leadPhoto: { ...; }; }; }' is not assignable to type 'Partial<Post>'.
    Types of property 'attributes' are incompatible.
      Type '{ _meilisearch_id: string; id: number; headline: string; summary: string; body: string; slug: string; published: string; createdAt: string; updatedAt: string; publishedAt: string; _formatted?: Partial<...> | undefined; _matchesPosition?: Partial<...> | undefined; authors: { ...; }; groups: { ...; }; leadPhoto: { ......' is missing the following properties from type '{ headline: string; createdAt: string; updatedAt: string; publishedAt: string; published: string; slug: string; summary: string; body: string; leadPhoto: { data: Photo; }; groups: { data: Group[]; }; primaryGroup: { ...; }; authors: { ...; }; streams: { ...; }; }': primaryGroup, streams
 */

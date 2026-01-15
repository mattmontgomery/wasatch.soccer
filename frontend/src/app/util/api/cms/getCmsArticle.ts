const CMS_API_BASE = process.env.CMS_API_BASE;
const CMS_API_KEY = process.env.CMS_API_KEY;

export interface CmsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  bylineOverride: string | null;
  leadImageUrl: string | null;
  leadImageAlt: string | null;
  leadImageCredit: string | null;
  authors: CmsArticleAuthor[];
}

export interface CmsArticleAuthor {
  id: number;
  articleId: number;
  authorId: number;
  isContributor: boolean;
  order: number;
  createdAt: string;
  author: CmsAuthorInfo;
}

export interface CmsAuthorInfo {
  id: number;
  name: string;
  email: string;
}

export default async function getCmsArticle(
  articleId: number
): Promise<{ data: CmsArticle | null }> {
  if (!CMS_API_BASE || !CMS_API_KEY) {
    console.error("CMS_API_BASE or CMS_API_KEY not configured");
    return { data: null };
  }

  const url = `${CMS_API_BASE}/articles/${articleId}`;
  console.info(`Fetching CMS article from ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 15,
      },
      headers: {
        "x-api-key": CMS_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`CMS article ${articleId} not found`);
        return { data: null };
      }
      throw new Error(`Failed to fetch CMS article: ${response.statusText}`);
    }

    const result = await response.json();
    return { data: result.data };
  } catch (error) {
    console.error(`Error fetching CMS article ${articleId}:`, error);
    return { data: null };
  }
}

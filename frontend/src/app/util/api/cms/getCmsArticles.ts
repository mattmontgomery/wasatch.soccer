import type { CmsArticle } from "./getCmsArticle";

const CMS_API_BASE = process.env.CMS_API_BASE;
const CMS_API_KEY = process.env.CMS_API_KEY;

export interface CmsArticlesResponse {
  data: CmsArticle[];
  count: number;
}

export default async function getCmsArticles(): Promise<CmsArticlesResponse> {
  if (!CMS_API_BASE || !CMS_API_KEY) {
    console.error("CMS_API_BASE or CMS_API_KEY not configured");
    return { data: [], count: 0 };
  }

  const url = `${CMS_API_BASE}/articles`;
  console.info(`Fetching CMS articles from ${url}`);

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
      throw new Error(`Failed to fetch CMS articles: ${response.statusText}`);
    }

    const result: CmsArticlesResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching CMS articles:", error);
    return { data: [], count: 0 };
  }
}

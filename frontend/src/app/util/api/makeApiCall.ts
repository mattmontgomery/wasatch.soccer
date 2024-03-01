const API_BASE = process.env.API_BASE;

export default async function makeApiCall(
  path: string,
  options: { revalidate: number } = { revalidate: 30 }
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  console.info(`Fetching ${url}`);
  return fetch(url, {
    method: "GET",
    next: {
      revalidate: options.revalidate ?? 60,
    },
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
}

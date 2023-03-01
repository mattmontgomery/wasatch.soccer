const API_BASE = process.env.API_BASE;

export default async function makeApiCall(
  path: string,
  options: { revalidate: number } = { revalidate: 120 }
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    method: "GET",
    next: {
      revalidate: options.revalidate ?? 60,
    },
    headers: {
      Authorization: `bearer ${process.env.API_TOKEN}`,
    },
  });
}

import { getConfig } from "@/app/util/config";

export async function getSiteTitle(): Promise<string> {
  return (await getConfig()).siteName;
}

export async function getTitle(
  elements: string[],
  reverse?: boolean
): Promise<string> {
  const pieces = [...elements, await getSiteTitle()];
  return (reverse ? [...pieces].reverse() : pieces).join(" | ");
}

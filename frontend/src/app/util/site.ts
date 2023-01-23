import Config from "config";

export function getSiteTitle(): string {
  return Config.siteName;
}

export function getTitle(elements: string[]): string {
  return [...elements, getSiteTitle()].join(" | ");
}

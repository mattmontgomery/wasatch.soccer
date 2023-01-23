export function getSiteTitle(): string {
  return process.env.SITE_TITLE ?? "RSL Soapbox Next";
}

export function getTitle(elements: string[]): string {
  return [...elements, getSiteTitle()].join(" | ");
}

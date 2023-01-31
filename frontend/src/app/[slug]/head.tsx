import { getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";
import { fetchPage } from "@/app/util/api/page";
import { getConfig } from "@/app/util/config";

export default async function Head({
  params: { slug = "homepage", page = 1 },
}) {
  const { data } = await fetchPage(slug);
  if (!data || data.length !== 1) {
    return notFound();
  }
  const _page = data[0];
  if (slug === "homepage" && Number(page) === 1) {
    const config = await getConfig();
    return (
      <>
        <title>{await getTitle([config.homepageTitleText], true)}</title>
      </>
    );
  }
  return (
    <>
      <title>{await getTitle([_page?.attributes.title])}</title>
    </>
  );
}

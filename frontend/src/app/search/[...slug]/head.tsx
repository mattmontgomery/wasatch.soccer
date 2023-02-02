import { getTitle } from "@/app/util/site";

export default async function SearchPageHead({
  params: { slug = [] },
}: {
  params: {
    slug: string[];
  };
}): Promise<React.ReactElement> {
  const title = await getTitle(
    ["Search Results", slug[0] ?? ""].filter(Boolean)
  );
  return (
    <>
      <title></title>
    </>
  );
}

import { getGroup } from "@/app/util/api";
import { getTitle } from "@/app/util/site";

export default async function Head({ params }: { params: { id: number } }) {
  const author = await getGroup(Number(params.id));
  return (
    <>
      <title>{getTitle([author.data.attributes.name])}</title>
    </>
  );
}

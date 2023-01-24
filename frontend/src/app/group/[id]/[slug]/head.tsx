import { getGroup } from "@/app/util/api";
import { getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { id: number } }) {
  const group = await getGroup(Number(params.id));
  if (!group.data) {
    return notFound();
  }
  return (
    <>
      <title>{await getTitle([group.data?.attributes.name])}</title>
    </>
  );
}

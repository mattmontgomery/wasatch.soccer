import { getAuthor } from "@/app/util/api";
import { getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { id: number } }) {
  const author = await getAuthor(Number(params.id));
  if (!author.data) {
    return notFound();
  }
  return (
    <>
      <title>{await getTitle([author.data.attributes.name, "Authors"])}</title>
    </>
  );
}

import { getAuthor } from "@/app/util/api";
import { getSiteTitle, getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { id: number } }) {
  const author = await getAuthor(Number(params.id));
  if (!author.data) {
    return notFound();
  }
  return (
    <>
      <title>{await getTitle([author.data.attributes.name, "Authors"])}</title>
      <meta property="og:site_name" content={await getSiteTitle()} />
      <link rel="shortcut icon" href="/ball.png" />
    </>
  );
}

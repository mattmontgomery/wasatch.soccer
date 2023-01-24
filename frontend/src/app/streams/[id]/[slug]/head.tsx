import { getStream } from "@/app/util/api";
import { getSiteTitle, getTitle } from "@/app/util/site";
import { notFound } from "next/navigation";

export default async function Head({ params }: { params: { id: number } }) {
  const stream = await getStream(Number(params.id));
  if (!stream.data) {
    return notFound();
  }
  return (
    <>
      <title>{await getTitle([stream.data.attributes.name])}</title>
      <meta property="og:site_name" content={await getSiteTitle()} />
      <link rel="shortcut icon" href="/ball.png" />
    </>
  );
}

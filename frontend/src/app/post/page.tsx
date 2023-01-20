import { getPathname, getPosts } from "@/app/util/api";
import Link from "next/link";

export default async function Page() {
  const posts = await getPosts({
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 15 },
  });
  return (
    <main>
      {posts?.data?.map((post, idx) => (
        <div key={idx}>
          <Link href={getPathname(post)} key={idx}>
            {post.attributes.headline}
          </Link>
        </div>
      ))}
    </main>
  );
}

"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import format from "date-fns/format";

export function useRedirect(slugFromPath: string, post: App.Post): void {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!post) {
      return;
    }
    const slug = post.attributes.slug;
    const date = format(new Date(post.attributes.publishedAt), "yyyy-mm-dd");
    if (slug && slugFromPath !== slug) {
      router.replace(`/post/${date}/${post.id}/${slug}`);
    }
  }, [slugFromPath, post, router]);
}

export function Redirect({
  slugFromPath,
  post,
}: {
  slugFromPath: string;
  post: App.Post;
}): React.ReactElement {
  useRedirect(slugFromPath, post);
  return <></>;
}

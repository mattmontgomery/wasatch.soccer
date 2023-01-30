"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getPostUrl } from "@/app/util/urls";

export function useRedirect(slugFromPath: string, post: App.Post): void {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!post) {
      return;
    }
    const slug = post.attributes.slug;
    const url = getPostUrl(post);
    if (slug && slugFromPath !== slug) {
      router.replace(url);
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

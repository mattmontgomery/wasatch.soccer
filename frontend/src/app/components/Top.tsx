"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Top(): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState<boolean>(false);
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
  }, [pathname, searchParams, initialized]);
  return <></>;
}

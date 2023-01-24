import Config, { getConfig } from "@/app/util/config";
import Script from "next/script";
import DefaultTags from "./DefaultTags";
import { getSiteTitle, getTitle } from "./util/site";

export default async function Head() {
  const config = await getConfig();
  return (
    <>
      <DefaultTags />
      <title>{await getTitle([config.homepageTitleText], true)}</title>
      <meta name="description" content={config.siteDescription} />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PRYEH8MYJ1"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-PRYEH8MYJ1');`,
        }}
      />
    </>
  );
}

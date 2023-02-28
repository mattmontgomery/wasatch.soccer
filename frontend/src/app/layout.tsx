import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import Footer from "./components/Footer";
import "./globals.css";
import styles from "./layout.module.css";
import { getConfig } from "./util/config";
import { getSiteTitle } from "./util/site";

const headlineFont = Montserrat({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--headline-font",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();
  const logoLightMode = config.logo.light;
  const logoDarkMode = config.logo.dark;
  const siteName = await getSiteTitle();
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <meta charSet="utf-8" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS feed for ${config.siteName}`}
          href="/rss.xml"
        />
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
      </head>
      <body className={`${headlineFont.variable}`}>
        <style>
          {`
        :root {
          --theme-primary: #${config.theme.primary};
          --theme-primary-70: #${config.theme.primary}cc;
          --theme-alternate: #${config.theme.alternate};
          --theme-alternate-70: #${config.theme.alternateDark}cc;
          --theme-primary-contrast: #${
            config.theme.primaryContrast ?? "fafafa"
          };
          --theme-alternate-contrast: #${
            config.theme.alternateContrast ?? "000000"
          };
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --theme-primary: #${config.theme.primaryDark};
          --theme-alternate: #${config.theme.alternateDark};
          }
        }
        `}
        </style>
        <div className={styles.grid}>
          <header className={styles.header}>
            <div className={styles.wordmark}>
              <h1>
                <Link href="/" className={styles.headerImageContainer}>
                  <Image
                    fill
                    src={logoLightMode}
                    alt={config.siteName}
                    className={`${styles.headerImage} ${styles.headerImageLight}`}
                  />
                  <Image
                    fill
                    src={logoDarkMode}
                    alt={config.siteName}
                    className={`${styles.headerImage} ${styles.headerImageDark}`}
                  />
                  {config.siteName}
                </Link>
              </h1>
              <h5>{config.siteDescription}</h5>
            </div>
            <nav className={styles.navigation}>
              <Link href="/">Home</Link>{" "}
              {config.navigationItems.map((navItem, idx) => (
                <Link href={navItem.url} key={idx}>
                  {navItem.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
          <Footer config={config} />
        </div>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: {
      default: `${config.siteName} | ${config.homepageTitleText}`,
      template: `%s | ${config.siteName}`,
    },
    viewport: "width=device-width",
    description: config.siteDescription,
    openGraph: {
      type: "website",
      title: {
        default: config.siteName,
        template: `%s | ${config.siteName}`,
      },
      siteName: config.siteName,
    },
    twitter: {
      card: "summary",
      title: {
        default: config.siteName,
        template: `%s`,
      },
      site: `@${config.social.twitter.replace(new RegExp(".+/"), "")}`,
      description: config.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

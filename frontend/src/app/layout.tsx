import { Montserrat } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Top from "./components/Top";
import "./globals.css";
import styles from "./layout.module.css";
import { getConfig } from "./util/config";

const wordmark = process.env.LOGO_LIGHT_MODE ?? "";
const wordmarkLight = process.env.LOGO_DARK_MODE ?? "";

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
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
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
        {typeof window !== "undefined" && <Top />}
        <div className={styles.grid}>
          <header className={styles.header}>
            <div className={styles.wordmark}>
              <h1>
                <Link href="/" className={styles.headerImageContainer}>
                  <Image
                    fill
                    src={wordmark}
                    alt={config.siteName}
                    className={`${styles.headerImage} ${styles.headerImageLight}`}
                  />
                  <Image
                    fill
                    src={wordmarkLight}
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
              {config.navigationGroups.map((navItem, idx) => (
                <Link
                  href={`/group/${navItem.id}/${navItem.attributes.slug}`}
                  key={idx}
                >
                  {navItem.attributes.name}
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

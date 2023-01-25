import { Montserrat } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import Top from "./components/Top";
import "./globals.css";
import styles from "./layout.module.css";
import { getConfig } from "./util/config";

import wordmark from "@/logo-black.png";
import wordmarkLight from "@/logo-white.png";

const headlineFont = Montserrat({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["900"],
  variable: "--headline-font",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
const subtitleFont = Montserrat({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["500"],
  variable: "--subtitle-font",
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
      <body className={`${headlineFont.variable} ${subtitleFont.variable}`}>
        <Top />
        <div className={styles.grid}>
          <header className={styles.header}>
            <div className={styles.wordmark}>
              <h1>
                <Link href="/" className={styles.headerImageContainer}>
                  <Image
                    src={wordmark}
                    alt={config.siteName}
                    className={`${styles.headerImage} ${styles.headerImageLight}`}
                    width={400}
                  />
                  <Image
                    src={wordmarkLight}
                    alt={config.siteName}
                    className={`${styles.headerImage} ${styles.headerImageDark}`}
                    width={400}
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

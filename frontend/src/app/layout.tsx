import { Montserrat } from "@next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import { getConfig } from "./util/config";

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
        <div className={styles.grid}>
          <header className={styles.header}>
            <h1>
              <Link href="/">{config.siteName}</Link>
            </h1>
            <h5>{config.siteDescription}</h5>
            <nav className={styles.navigation}>
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
          <footer className={styles.footer}>
            &copy; 2023 {config.siteName}
          </footer>
        </div>
      </body>
    </html>
  );
}

import { Alexandria } from "@next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import { getConfig } from "./util/config";

const headlineFont = Alexandria({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--headline-font",
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
        <header className={styles.header}>
          <Link href="/">{config.siteName}</Link>
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
      </body>
    </html>
  );
}

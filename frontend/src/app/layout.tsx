import { Alexandria } from "@next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

const headlineFont = Alexandria({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--headline-font",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${headlineFont.variable}`}>
        <header className={styles.header}>
          <Link href="/">RSL Soapbox</Link>
        </header>
        {children}
      </body>
    </html>
  );
}

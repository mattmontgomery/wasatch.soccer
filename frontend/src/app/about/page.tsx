import ReactMarkdown from "react-markdown";

import pageStyles from "@/app/page.module.css";
import textStyles from "@/app/styles/text.module.css";

import { getConfig } from "@/app/util/config";
import { Metadata } from "next";

export default async function AboutPage(): Promise<React.ReactElement> {
  const config = await getConfig();
  return (
    <main className={pageStyles.main}>
      <h2 className={pageStyles.pageHeader}>About Us</h2>
      <div className={textStyles.body}>
        <ReactMarkdown>{config.about}</ReactMarkdown>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    twitter: {
      title: "About",
    },
    openGraph: {
      title: {
        absolute: "About",
      },
    },
  };
}

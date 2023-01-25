import Link from "next/link";

import type { Config } from "@/app/util/config";

import styles from "@/app/layout.module.css";

export default function Footer(props: { config: Config }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <span>
          <Link href="/masthead" prefetch={false}>
            Masthead
          </Link>
        </span>
        {props.config.newsletterSignup && (
          <span>
            <Link href={props.config.newsletterSignup} prefetch={false}>
              Newsletter
            </Link>
          </span>
        )}
        {props.config.podcastFeed && (
          <span>
            <Link href={props.config.podcastFeed} prefetch={false}>
              Podcast
            </Link>
          </span>
        )}
        <span>
          <Link href="/about">About</Link>
        </span>
      </div>
      <p>&copy; 2023 {props.config.siteName}</p>
    </footer>
  );
}

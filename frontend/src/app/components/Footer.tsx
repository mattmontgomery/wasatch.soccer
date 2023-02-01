import Link from "next/link";

import type { Config } from "@/app/util/config";

import styles from "@/app/layout.module.css";
import Search from "./Search";

export default function Footer(props: { config: Config }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <p>
          <span>
            <Link href="/masthead" prefetch={false}>
              Masthead
            </Link>
          </span>
          {props.config.newsletterSignup && (
            <span>
              <a href={props.config.newsletterSignup}>Newsletter</a>
            </span>
          )}
          {props.config.podcastFeed && (
            <span>
              <a href={props.config.podcastFeed}>Podcast</a>
            </span>
          )}
          <span>
            <Link href="/about" prefetch={false}>
              About
            </Link>
          </span>
        </p>
        <p>
          {props.config.social.facebook && (
            <span>
              <a href={props.config.social.facebook}>Facebook</a>
            </span>
          )}
          {props.config.social.instagram && (
            <span>
              <a href={props.config.social.instagram}>Instagram</a>
            </span>
          )}
          {props.config.social.twitter && (
            <span>
              <a href={props.config.social.twitter}>Twitter</a>
            </span>
          )}
        </p>
      </div>
      <div className={styles.search}>
        <Search />
      </div>
      <p>&copy; 2023 {props.config.siteName}</p>
    </footer>
  );
}

"use client";

import { useState } from "react";
import styles from "./search.module.css";

export default function Search({ value }: { value?: string }) {
  const [search, setSearch] = useState<string>(value ?? "");
  console.log(search);
  return (
    <form className={styles.search} action={`/search/${encodeURI(search)}`}>
      <input
        onKeyUp={(ev) => setSearch(ev.currentTarget.value)}
        type="search"
        placeholder="Search ..."
        defaultValue={decodeURI(value ?? "")}
      />
    </form>
  );
}

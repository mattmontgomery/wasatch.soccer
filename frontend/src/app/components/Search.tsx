import styles from "./search.module.css";

export default function Search({ value }: { value?: string }) {
  return (
    <form className={styles.search} action="/search">
      <input
        type="search"
        placeholder="Search ..."
        name="q"
        defaultValue={value}
      />
    </form>
  );
}

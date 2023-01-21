import Link from "next/link";

export default function Authors(props: App.Post) {
  const authors = props.attributes.authors?.data;

  return authors.length ? (
    <>
      By{" "}
      {authors.map((author, idx) => (
        <Link href={`/authors/${author.id}`} key={idx}>
          {author.attributes.name}
        </Link>
      ))}
    </>
  ) : (
    <></>
  );
}

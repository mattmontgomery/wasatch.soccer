import Link from "next/link";

export default function Authors(props: App.Post) {
  const authors = props.attributes.authors?.data;

  return authors.length ? (
    <>
      <span>
        by{" "}
        {authors.map((author, idx) => (
          <Link
            prefetch={false}
            href={`/authors/${author.id}/${author.attributes.slug}`}
            rel="author"
            key={idx}
          >
            {author.attributes.name}
          </Link>
        ))}
      </span>
    </>
  ) : (
    <></>
  );
}

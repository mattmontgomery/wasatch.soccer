import Link from "next/link";

export default function Authors(props: App.Post) {
  const streams = props.attributes.streams?.data ?? [];

  return streams.length ? (
    <>
      <span>
        {streams.map((stream, idx) => (
          <span key={idx}>
            <Link href={`/streams/${stream.id}/${stream.attributes.slug}`}>
              {stream.attributes.name}
            </Link>
          </span>
        ))}
      </span>
    </>
  ) : (
    <></>
  );
}

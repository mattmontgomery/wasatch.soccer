import Link from "next/link";

export default function Groups(props: App.Post) {
  const groups = props.attributes.groups?.data;

  return groups.length ? (
    <span>
      {groups.map((group, idx) => (
        <span key={idx}>
          <Link href={`/group/${group.id}/${group.attributes.slug}`}>
            {group.attributes.name}
          </Link>
        </span>
      ))}
    </span>
  ) : (
    <></>
  );
}

import Link from "next/link";

export default function Groups(props: App.Post) {
  const groups = props.attributes.groups?.data;

  return groups.length ? (
    <span>
      {groups.map((group, idx) => (
        <span>
          <Link href={`/group/${group.id}/${group.attributes.slug}`} key={idx}>
            {group.attributes.name}
          </Link>
        </span>
      ))}
    </span>
  ) : (
    <></>
  );
}

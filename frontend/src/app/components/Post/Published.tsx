import format from "date-fns/format";
import { differenceInDays, differenceInHours } from "date-fns";

export default function Published(props: App.Post): React.ReactElement {
  const date = format(
    new Date(props.attributes.published ?? props.attributes.publishedAt),
    "MMM dd, yyyy, hh:ii a"
  )
    .replace(/am/i, "a.m.")
    .replace(/pm/i, "p.m.");
  return <>{date}</>;
}

export function Relative(props: App.Post) {
  const date = new Date(
    props.attributes.published ?? props.attributes.publishedAt
  );
  const hours = differenceInHours(new Date(), date);
  const thisYear = new Date().getFullYear() === date.getFullYear();
  const relative =
    hours > 24
      ? format(date, thisYear ? `MMMM d` : `MMMM d, yyyy`)
      : `${hours}h ago`;
  return <>{relative}</>;
}

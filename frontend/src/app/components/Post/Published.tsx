import format from "date-fns-tz/format";
import { differenceInHours } from "date-fns";

export default function Published(props: App.Post): React.ReactElement {
  const date = new Date(
    props.attributes.published ?? props.attributes.publishedAt
  );
  const formattedDate = format(date, "MMM dd, yyyy, hh:ii a", {
    timeZone: process.env.TIMEZONE ?? "",
  })
    .replace(/am/i, "a.m.")
    .replace(/pm/i, "p.m.");
  return <time dateTime={date.toISOString()}>{formattedDate}</time>;
}

export function Relative(props: App.Post) {
  const date = new Date(
    props.attributes.published ?? props.attributes.publishedAt
  );
  const hours = differenceInHours(new Date(), date);
  const thisYear = new Date().getFullYear() === date.getFullYear();
  const relative =
    hours > 24
      ? format(date, thisYear ? `MMMM d` : `MMMM d, yyyy`, {
          timeZone: process.env.TIMEZONE ?? "",
        })
      : `${hours}h ago`;
  return <>{relative}</>;
}

import { format } from "date-fns-tz";
import { differenceInHours, differenceInMinutes, isFuture } from "date-fns";

export default function Published(props: App.Post): React.ReactElement {
  const date = new Date(
    props.attributes.published ?? props.attributes.publishedAt
  );
  const formattedDate = format(date, "MMM dd, yyyy", {
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
  const minutes = differenceInMinutes(new Date(), date);
  const thisYear = new Date().getFullYear() === date.getFullYear();
  if (isFuture(date)) {
    return <>Now</>;
  }
  const relative =
    hours === 0
      ? `${minutes}m ago`
      : hours > 16
      ? format(date, thisYear ? `MMMM d` : `MMMM d, yyyy`, {
          timeZone: "Europe/Berlin",
        })
      : `${hours}h ago`;
  return <>{relative}</>;
}

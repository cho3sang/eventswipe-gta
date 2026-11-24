import { GtaEvent } from "../types";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
  month: "short",
  day: "numeric"
});

const longDateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "long",
  month: "long",
  day: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit"
});

export function formatEventDate(event: GtaEvent) {
  const start = new Date(event.start_datetime);
  const end = new Date(event.end_datetime);

  return `${dateFormatter.format(start)} at ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

export function formatLongEventDate(event: GtaEvent) {
  const start = new Date(event.start_datetime);
  const end = new Date(event.end_datetime);

  return `${longDateFormatter.format(start)} from ${timeFormatter.format(start)} to ${timeFormatter.format(end)}`;
}

export function formatMessageTime(value: string) {
  return timeFormatter.format(new Date(value));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

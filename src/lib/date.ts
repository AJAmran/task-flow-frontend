const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export const dateOnlyValue = (iso?: string | null): string => {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

export const toISODateTime = (dateOnly: string): string =>
  `${dateOnly}T00:00:00.000Z`;

export const isDateOnly = (value: string): boolean => DATE_ONLY.test(value);

/**
 * Sprint and project schedules are stored as UTC midnight so the picked
 * calendar day never shifts. Rendering must therefore also be pinned to UTC,
 * otherwise a date-only value shows the previous day west of UTC.
 */
export const formatDayUTC = (value?: string | null): string =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(value))
    : "—";

export const isPastDayUTC = (value?: string | null): boolean => {
  if (!value) {
    return false;
  }
  const day = dateOnlyValue(value);
  const today = dateOnlyValue(new Date().toISOString());
  return day !== "" && day < today;
};

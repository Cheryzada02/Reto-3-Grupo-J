const DOMINICAN_TIME_ZONE = "America/Santo_Domingo";

function parseDatabaseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return new Date(value);

  const trimmed = value.trim();
  const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const looksLikeDateTime = /^\d{4}-\d{2}-\d{2}[ t]\d{2}:\d{2}/i.test(trimmed);

  return new Date(looksLikeDateTime && !hasTimeZone ? `${trimmed}Z` : trimmed);
}

export function formatDateTime(value) {
  if (!value) return "Sin fecha";

  const date = parseDatabaseDate(value);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: DOMINICAN_TIME_ZONE,
  });
}

export function formatDateOnly(value) {
  const date = value ? parseDatabaseDate(value) : new Date();

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleDateString("es-DO", {
    dateStyle: "medium",
    timeZone: DOMINICAN_TIME_ZONE,
  });
}

export function formatTimeOnly(value) {
  const date = value ? parseDatabaseDate(value) : new Date();

  if (Number.isNaN(date.getTime())) return "Sin hora";

  return date.toLocaleTimeString("es-DO", {
    timeStyle: "short",
    timeZone: DOMINICAN_TIME_ZONE,
  });
}

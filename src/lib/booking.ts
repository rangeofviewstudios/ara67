/** Validation shared by the browser and the server action. */

export const FIELD_NAMES = ["name", "email", "company", "service", "date", "message"] as const;
export type BookingField = (typeof FIELD_NAMES)[number];
export type BookingValues = Record<BookingField, string>;
export type BookingErrors = Partial<Record<BookingField, string>>;

export type BookingState = {
  status: "idle" | "invalid" | "sent" | "not_connected";
  values: BookingValues;
  errors: BookingErrors;
};

export const EMPTY_VALUES: BookingValues = {
  name: "",
  email: "",
  company: "",
  service: "",
  date: "",
  message: "",
};

export function readValues(formData: FormData): BookingValues {
  const values = { ...EMPTY_VALUES };
  for (const field of FIELD_NAMES) {
    const value = formData.get(field);
    values[field] = typeof value === "string" ? value.trim() : "";
  }
  return values;
}

/** Today's date in Atlanta, as YYYY-MM-DD. Calls are booked on Atlanta time. */
export function todayInAtlanta(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function validateBooking(values: BookingValues): BookingErrors {
  const errors: BookingErrors = {};

  if (!values.name) errors.name = "Please add your name.";
  else if (values.name.length > 120) errors.name = "Please shorten your name.";

  if (!values.email) errors.email = "Please add your email.";
  else if (values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please check this email address.";
  }

  if (values.company.length > 120) errors.company = "Please shorten the company name.";

  if (!values.service) errors.service = "Please choose one.";
  else if (values.service.length > 80) errors.service = "Please choose one of the options.";

  if (values.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = "Please choose a valid date.";
    else if (values.date < todayInAtlanta()) errors.date = "Please choose a date from today on.";
  }

  if (!values.message) errors.message = "Please tell us a little about the project.";
  else if (values.message.length > 4000) errors.message = "Please keep this under 4,000 characters.";

  return errors;
}

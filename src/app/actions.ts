"use server";

import { readValues, validateBooking, type BookingState, EMPTY_VALUES } from "@/lib/booking";
import { deliverBooking } from "@/lib/deliver-booking";

export async function submitBooking(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Real visitors never fill the hidden field, so quietly end here for bots.
  if (formData.get("website")) {
    return { status: "sent", values: EMPTY_VALUES, errors: {} };
  }

  const values = readValues(formData);
  const errors = validateBooking(values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", values, errors };
  }

  const delivered = await deliverBooking(values);
  return delivered
    ? { status: "sent", values: EMPTY_VALUES, errors: {} }
    : { status: "not_connected", values, errors: {} };
}

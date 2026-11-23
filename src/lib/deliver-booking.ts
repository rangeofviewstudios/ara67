import type { BookingValues } from "./booking";

/**
 * The one place to connect the booking form to email, a CRM, or a calendar.
 * Return true only once the request has really been delivered.
 *
 * Nothing is connected yet, so this returns false and the form asks visitors
 * to email instead of telling them their request was sent.
 */
export async function deliverBooking(_booking: BookingValues): Promise<boolean> {
  return false;
}

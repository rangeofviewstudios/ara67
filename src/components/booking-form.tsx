"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitBooking } from "@/app/actions";
import {
  EMPTY_VALUES,
  readValues,
  todayInAtlanta,
  validateBooking,
  type BookingErrors,
  type BookingField,
  type BookingState,
} from "@/lib/booking";
import { ButtonLabel } from "./button-label";

const INITIAL_STATE: BookingState = { status: "idle", values: EMPTY_VALUES, errors: {} };

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label flex justify-between gap-4">
        <span>{label}</span>
        {optional && <span className="text-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="form-note mt-2 text-sm font-bold">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingForm({
  services,
  email,
  successMessage,
  compact = false,
}: {
  services: string[];
  email: string;
  successMessage: string;
  /** The short version for the footer: only the fields needed to start a conversation. */
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitBooking, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState<BookingErrors | null>(null);
  const [minDate, setMinDate] = useState<string>();
  const statusRef = useRef<HTMLDivElement>(null);

  const errors = clientErrors ?? state.errors;

  useEffect(() => {
    setMinDate(todayInAtlanta());
  }, []);

  useEffect(() => {
    setClientErrors(null);
    if (state.status === "sent" || state.status === "not_connected") {
      statusRef.current?.focus();
    }
  }, [state]);

  function focusFirstError(form: HTMLFormElement, found: BookingErrors) {
    const first = Object.keys(found)[0] as BookingField | undefined;
    if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  // A message about a field clears as soon as the visitor starts fixing it.
  function clearFieldError(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as BookingField;
    if (!errors[field]) return;
    const remaining = { ...errors };
    delete remaining[field];
    setClientErrors(remaining);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateBooking(readValues(new FormData(event.currentTarget)));
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setClientErrors(found);
      focusFirstError(event.currentTarget, found);
    } else {
      setClientErrors(null);
    }
  }

  if (state.status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="form-note border-t border-line pt-6 outline-none">
        <p className="type-label text-index">Request received</p>
        <p className="mt-3 max-w-[32ch] text-2xl leading-snug font-bold">{successMessage}</p>
      </div>
    );
  }

  const describedBy = (field: BookingField) => (errors[field] ? `${field}-error` : undefined);
  const invalid = (field: BookingField) => (errors[field] ? true : undefined);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onInput={clearFieldError}
      noValidate
      className="flex flex-col gap-f34"
    >
      <div className="grid gap-f34 sm:grid-cols-2 sm:gap-x-f21">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={state.values.name}
            aria-required="true"
            aria-invalid={invalid("name")}
            aria-describedby={describedBy("name")}
            className="field-input"
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            defaultValue={state.values.email}
            aria-required="true"
            aria-invalid={invalid("email")}
            aria-describedby={describedBy("email")}
            className="field-input"
          />
        </Field>
        {!compact && (
          <>
            <Field id="company" label="Company" optional error={errors.company}>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                defaultValue={state.values.company}
                aria-invalid={invalid("company")}
                aria-describedby={describedBy("company")}
                className="field-input"
              />
            </Field>
            <Field id="date" label="Preferred date" optional error={errors.date}>
              <input
                id="date"
                name="date"
                type="date"
                min={minDate}
                defaultValue={state.values.date}
                aria-invalid={invalid("date")}
                aria-describedby={describedBy("date")}
                className="field-input"
              />
            </Field>
          </>
        )}
      </div>

      <fieldset aria-describedby={describedBy("service")}>
        <legend className="type-label">What do you need?</legend>
        <div className="mt-f13 flex flex-wrap gap-f8">
          {[...services, "Not sure yet"].map((service) => (
            <label key={service} className="chip-option relative cursor-pointer">
              <input
                type="radio"
                name="service"
                value={service}
                defaultChecked={state.values.service === service}
                className="peer absolute inset-0 cursor-pointer opacity-0"
              />
              <span className="chip flex min-h-11 items-center rounded-[2px] border border-line px-4 text-sm font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-fg">
                {service}
              </span>
            </label>
          ))}
        </div>
        {errors.service && (
          <p id="service-error" className="form-note mt-2 text-sm font-bold">
            {errors.service}
          </p>
        )}
      </fieldset>

      <Field id="message" label="About the project" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={compact ? 2 : 4}
          defaultValue={state.values.message}
          aria-required="true"
          aria-invalid={invalid("message")}
          aria-describedby={describedBy("message")}
          className="field-input resize-y"
        />
      </Field>

      <div className="trap-field" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4">
        <button type="submit" disabled={pending} className="button-primary w-full disabled:opacity-60 sm:w-auto sm:self-start">
          <ButtonLabel>{pending ? "Sending" : "Request a conversation"}</ButtonLabel>
        </button>
        {state.status === "not_connected" && (
          <div ref={statusRef} tabIndex={-1} role="alert" className="form-note border-l-2 border-accent pl-4 outline-none">
            <p className="font-bold">Your request has not been sent.</p>
            <p className="text-muted">
              This form is not connected yet. Please email{" "}
              <a href={`mailto:${email}`} className="text-fg underline underline-offset-3">
                {email}
              </a>{" "}
              instead.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

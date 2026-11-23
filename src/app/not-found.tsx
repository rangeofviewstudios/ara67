import Link from "next/link";
import { ButtonLabel } from "@/components/button-label";

export default function NotFound() {
  return (
    <main className="page-gutter flex min-h-dvh flex-col justify-center">
      <p className="type-label text-index">404. Also Atlanta&apos;s area code.</p>
      <h1 className="type-display mt-f21 max-w-[14ch]">This page isn&apos;t here.</h1>
      <Link href="/" className="button-primary mt-8 self-start">
        <ButtonLabel>Back to home</ButtonLabel>
      </Link>
    </main>
  );
}

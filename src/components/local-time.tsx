"use client";

import { useEffect, useState } from "react";

/** The time at the studio. It appears once the page is running and turns over on the minute. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      setTime(format.format(new Date()));
      timer = setTimeout(tick, 60000 - (Date.now() % 60000));
    }
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [timeZone]);

  if (!time) return null;
  const [hours, rest] = time.split(":");

  return (
    <time className="local-time">
      {hours}
      <span className="local-time-colon">:</span>
      {rest}
    </time>
  );
}

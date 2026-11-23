import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops Next treating a parent folder as the project root.
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  // The content reader finds these files at runtime, so the host cannot detect them on its own.
  // Needed whenever a page re-renders on the server, such as the form without JavaScript.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default nextConfig;

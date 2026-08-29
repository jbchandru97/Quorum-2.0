import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The markdown fixtures are read from disk at request time so they
     can be edited during a rehearsal without a rebuild. That read is
     opaque to the module tracer, so the files are declared here to be
     packed into the deployed output. See readMarkdownFixture(). */
  outputFileTracingIncludes: {
    "/**": ["./fixtures/**/*.md"],
  },

  async redirects() {
    return [
      /* Quorum's front door is the workspace. */
      { source: "/", destination: "/quorum/threads", permanent: false },

      /* Links shared against the original Malbank deployment still land. */
      { source: "/intro", destination: "/demo/intro", permanent: false },
      { source: "/playground", destination: "/demo/playground", permanent: false },
      { source: "/case-study", destination: "/demo/intro", permanent: false },
      { source: "/mal-ai", destination: "/demo/playground/assistant", permanent: false },
    ];
  },
};

export default nextConfig;

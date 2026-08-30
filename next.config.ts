import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The markdown fixtures are read from disk at request time so they
     can be edited during a rehearsal without a rebuild. That read is
     opaque to the module tracer, so the files are declared here to be
     packed into the deployed output. See readMarkdownFixture(). */
  outputFileTracingIncludes: {
    /* The agent's repo search reads these trees from disk at request
       time (src/lib/quorum/repo-search.ts), and the markdown fixtures
       are read per-request so they can be edited during a rehearsal. */
    "/**": [
      "./fixtures/**/*",
      "./docs/**/*.md",
      "./src/app/demo/**/*",
      "./src/components/demo/**/*",
    ],
  },

  async redirects() {
    return [
      /* Quorum's front door is the playground under review. */
      { source: "/", destination: "/demo/playground", permanent: false },

      /* Links shared against the original Malbank deployment still land. */
      { source: "/intro", destination: "/demo/intro", permanent: false },
      { source: "/playground", destination: "/demo/playground", permanent: false },
      { source: "/case-study", destination: "/demo/intro", permanent: false },
      { source: "/mal-ai", destination: "/demo/playground/assistant", permanent: false },
    ];
  },
};

export default nextConfig;

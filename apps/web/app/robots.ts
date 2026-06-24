import type { MetadataRoute } from "next";

const SITE = "https://www.whiskymart.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep transactional/account routes out of the index.
      disallow: ["/checkout", "/cart", "/account", "/api/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}

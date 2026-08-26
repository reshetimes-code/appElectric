import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/order-confirmation", "/cart"],
      },
    ],
    sitemap: "https://appelectric.example/sitemap.xml",
  };
}

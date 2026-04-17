import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://nidlocal.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/parametres/",
          "/notifications/",
          "/auth/",
          "/messages/",
          "/favorites/",
          "/nouveau-post",
          "/annonces/publier",
          "/annonces/comparer",
          "/recherche",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

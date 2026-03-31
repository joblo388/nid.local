const BASE_URL = "https://nidlocal.com";
const PUBLISHER = { "@type": "Organization", name: "nid.local", url: BASE_URL };

export function generateWebAppSchema(name: string, url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} | nid.local`,
    url: `${BASE_URL}${url}`,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "fr-CA",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  };
}

export function generateArticleSchema(headline: string, url: string, description: string, datePublished?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${BASE_URL}${url}`,
    publisher: PUBLISHER,
    inLanguage: "fr-CA",
    datePublished: datePublished || "2026-03-30",
    dateModified: "2026-03-30",
  };
}

export function generateFAQSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function generateDatasetSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${BASE_URL}${url}`,
    publisher: PUBLISHER,
    inLanguage: "fr-CA",
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

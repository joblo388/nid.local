import { cookies } from "next/headers";
import { type Locale, t as translate, getLocaleFromCookie } from "./i18n";

/**
 * Server-side locale helper. Reads the locale cookie from Next.js headers.
 * Use in Server Components and generateMetadata.
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieString = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  return getLocaleFromCookie(cookieString);
}

/**
 * Server-side translation helper. Returns a t() function bound to the current locale.
 */
export async function getServerT(): Promise<(key: string) => string> {
  const locale = await getServerLocale();
  return (key: string) => translate(key, locale);
}

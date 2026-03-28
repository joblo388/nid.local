"use client";

import { useState, useEffect, useCallback } from "react";
import { type Locale, t as translate, getLocaleFromCookie } from "./i18n";

/**
 * Client hook that reads locale from document.cookie and provides a t() helper.
 */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    setLocale(getLocaleFromCookie(document.cookie));
  }, []);

  const t = useCallback(
    (key: string) => translate(key, locale),
    [locale]
  );

  return { locale, t };
}

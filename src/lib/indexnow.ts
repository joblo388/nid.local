const SITE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";
const INDEX_NOW_KEY = "0c261b07a71e45deaad152260c769c46";

/**
 * Notify search engines (Bing, Yandex, Naver, Seznam) of new or updated URLs
 * via the IndexNow protocol. Also pings Google's sitemap endpoint.
 */
export async function notifySearchEngines(paths: string[]) {
  if (process.env.NODE_ENV !== "production") return;
  if (!paths.length) return;

  const urls = paths.map((p) => `${SITE_URL}${p}`);

  // IndexNow (Bing, Yandex, Naver, Seznam all share it)
  const indexNowPromise = fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEX_NOW_KEY,
      keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
      urlList: urls,
    }),
  }).catch(() => {});

  // Google sitemap ping
  const googlePingPromise = fetch(
    `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`
  ).catch(() => {});

  await Promise.allSettled([indexNowPromise, googlePingPromise]);
}

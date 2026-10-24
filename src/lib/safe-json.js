export async function safeFetchJson(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

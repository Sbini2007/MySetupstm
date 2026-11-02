export function slugifyGuideTitle(title) {
  return String(title || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeGuides(guides) {
  if (!Array.isArray(guides)) return [];

  return guides
    .filter((guide) => guide && typeof guide.title === "string")
    .map((guide) => {
      const title = guide.title.trim();
      return {
        slug: slugifyGuideTitle(guide.slug || title),
        title,
        description: typeof guide.description === "string" ? guide.description.trim() : "",
        content: typeof guide.content === "string" ? guide.content : "",
      };
    })
    .filter((guide) => guide.title && guide.slug);
}

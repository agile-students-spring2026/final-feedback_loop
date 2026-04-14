export const strip = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(strip);
  if (typeof doc !== "object") return doc;
  const { _id, ...rest } = doc;
  return rest;
};

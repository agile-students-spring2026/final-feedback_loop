const FOLLOWS_KEY = "followedProjectIds";

export const loadFollows = () => {
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveFollows = (ids) => {
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(ids));
};

export const isFollowing = (id) => loadFollows().includes(id);

export const toggleFollow = (id) => {
  const current = loadFollows();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  saveFollows(next);
  return next;
};

export const API = "http://localhost:7002";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const clearUser = () => localStorage.removeItem(USER_KEY);

export const logout = () => {
  clearToken();
  clearUser();
};

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"])
    headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401 && token) {
    logout();
    window.location.assign("/signin");
  }
  return res;
};

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = () => process.env.JWT_SECRET || "dev-secret";
const EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;

export const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export const signToken = (payload) =>
  jwt.sign(payload, SECRET(), { expiresIn: EXPIRES_IN() });

export const verifyToken = (token) => jwt.verify(token, SECRET());

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

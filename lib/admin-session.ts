import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE_SEC = 12 * 60 * 60;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "";
  return secret.length >= 16 ? secret : "";
}

export function adminAuthReady() {
  return Boolean(sessionSecret() && process.env.ADMIN_PASSWORD?.trim());
}

function sign(body: string) {
  return createHmac("sha256", sessionSecret()).update(body).digest("base64url");
}

export function adminPasswordMatches(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const left = createHash("sha256").update(password).digest();
  const right = createHash("sha256").update(expected).digest();
  return expected.length > 0 && timingSafeEqual(left, right);
}

export async function createAdminSession() {
  if (!sessionSecret()) {
    throw new Error("Admin sign-in is not configured.");
  }
  const body = String(Date.now() + MAX_AGE_SEC * 1000);
  const jar = await cookies();
  jar.set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdmin() {
  if (!sessionSecret()) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value || "";
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return false;
  const body = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const expected = sign(body);
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  const exp = Number(body);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized.");
  }
}

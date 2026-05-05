import { cookies, headers } from "next/headers";

export function isAuthorized(): boolean {
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) return false;

  const headerToken = headers().get("x-admin-token") || "";
  if (headerToken && headerToken === token) return true;

  const cookieStore = cookies();
  const cookieToken = cookieStore.get("admin_token")?.value || "";
  return cookieToken === token;
}

export function setAuthCookie(res: Response, token: string) {
  res.headers.set("Set-Cookie", `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`); // 30 days
}

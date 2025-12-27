import { z } from "zod";

export const LeadSchema = z.object({
  websiteType: z.enum(["ecommerce", "services"]),
  mainIssue: z.string().min(2),
  trafficSource: z.string().min(2),
  monthlyTraffic: z.string().min(1),
  analytics: z.string().min(1),
  goal: z.string().min(2),
  email: z.string().email(),
  messenger: z.string().optional().default(""),
});

export type Lead = z.infer<typeof LeadSchema>;

export function requireAdminToken(token?: string | null) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  return token === expected;
}

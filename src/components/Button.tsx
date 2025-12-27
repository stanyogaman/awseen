import Link from "next/link";
import React from "react";
import { cn } from "@/components/cn";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90"
      : "border hover:bg-gray-50";
  return (
    <Link className={cn(base, styles, className)} href={href}>
      {children}
    </Link>
  );
}

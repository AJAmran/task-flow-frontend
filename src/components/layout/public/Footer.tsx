"use client";

import Link from "next/link";
import { ArrowUp, ShieldCheck, Wallet, Zap } from "lucide-react";
import { Logo } from "@/assets/logo";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Product",
    links: [
      { name: "Features", url: "/features" },
      { name: "Pricing", url: "/pricing" },
      { name: "Dashboard", url: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", url: "/about" },
      { name: "Contact", url: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Login", url: "/login" },
      { name: "Register", url: "/register" },
    ],
  },
];

const trust = [
  { icon: Zap, label: "Sprints & boards" },
  { icon: ShieldCheck, label: "Role-based access" },
  { icon: Wallet, label: "bKash billing" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t bg-[#0a2e36] text-teal-50">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <Logo size={32} href="" />
              <span>TaskFlow</span>
            </Link>
            <p className="max-w-xs text-sm text-teal-100/70">
              Project management for modern teams. Plan sprints, track
              tasks, and ship faster.
            </p>
            <ul className="flex flex-col gap-2">
              {trust.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-xs text-teal-100/70"
                  >
                    <Icon className="size-3.5 text-teal-300" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
          {columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="flex flex-col gap-3"
            >
              <h3 className="text-xs font-bold tracking-wider text-teal-300/80 uppercase">
                {col.title}
              </h3>
              {col.links.map((link) => (
                <Link
                  key={link.url + link.name}
                  href={link.url}
                  className="w-fit text-sm text-teal-100/70 transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-teal-100/60 sm:flex-row">
          <p>© 2026 TaskFlow. All rights reserved.</p>
          <p className="hidden sm:block">
            Boards · Sprints · Teams · Billing
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-100/70 hover:bg-white/10 hover:text-white"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <ArrowUp /> Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}

import { Logo } from "@/assets/logo";
import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo size={32} />
            <span>TaskFlow</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Project management for modern teams. Plan sprints, track tasks, and
            ship faster.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            {col.links.map((link) => (
              <Link
                key={link.url + link.name}
                href={link.url}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© 2026 TaskFlow. All rights reserved.</p>
          <p>Built with Next.js for teams that ship.</p>
        </div>
      </div>
    </footer>
  );
}

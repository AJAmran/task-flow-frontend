import { cn } from "@/lib/utils";

const palettes = [
  "bg-teal-100 text-teal-900",
  "bg-cyan-100 text-cyan-900",
  "bg-amber-100 text-amber-900",
  "bg-violet-100 text-violet-900",
  "bg-rose-100 text-rose-900",
  "bg-emerald-100 text-emerald-900",
];

function paletteFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return palettes[hash % palettes.length];
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AvatarInitials({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-7 text-[11px]",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
  };

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold",
        sizes[size],
        paletteFor(name || "?"),
        className,
      )}
    >
      {initialsOf(name || "?")}
    </span>
  );
}

export function AvatarStack({
  names,
  max = 4,
}: {
  names: string[];
  max?: number;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;

  if (names.length === 0) {
    return null;
  }

  return (
    <span className="flex -space-x-2">
      {shown.map((name) => (
        <AvatarInitials
          key={name}
          name={name}
          size="sm"
          className="ring-2 ring-card"
        />
      ))}
      {extra > 0 && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground ring-2 ring-card">
          +{extra}
        </span>
      )}
    </span>
  );
}

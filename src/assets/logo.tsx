import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: number;
  href?: string;
  priority?: boolean;
  className?: string;
  alt?: string;
};

export function Logo({
  size = 40,
  href = "/",
  priority = false,
  className = "",
  alt = "TaskFlow",
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
      sizes={`${size}px`}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      aria-label="Go to homepage"
      className="inline-flex shrink-0"
    >
      {image}
    </Link>
  );
}

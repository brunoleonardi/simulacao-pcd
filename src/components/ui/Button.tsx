import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
};

const variants = {
  primary:
    "bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 dark:active:bg-neutral-300",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: Props) {
  const base =
    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black";

  if (href) {
    return (
      <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

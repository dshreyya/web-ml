import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = BaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type ButtonAsButton = BaseProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variants: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-ocean-900 text-sand-50 hover:bg-ocean-700 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300",
  secondary:
    "bg-transparent text-ocean-900 border border-ocean-900/25 hover:border-ocean-900/60 hover:bg-ocean-900/[0.03] dark:text-sand-100 dark:border-sand-100/25 dark:hover:border-sand-100/50 dark:hover:bg-sand-100/[0.04]",
  ghost:
    "bg-transparent text-ocean-900 hover:bg-ocean-900/[0.05] dark:text-sand-100 dark:hover:bg-sand-100/[0.06]",
};

const sizes: Record<NonNullable<BaseProps["size"]>, string> = {
  md: "px-5 py-2.5 text-[13.5px]",
  lg: "px-7 py-3.5 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 ease-out",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

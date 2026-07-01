import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
};

export function IconButton({
  className,
  icon,
  label,
  isActive,
  type = "button",
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md border text-white transition disabled:cursor-not-allowed disabled:opacity-45",
        isActive
          ? "border-zinc-950 bg-zinc-950"
          : "text-zinc-700 border-zinc-300 bg-white hover:bg-zinc-100",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}

import * as React from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-14 flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 text-base text-white outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20",
        className,
      )}
      {...props}
    />
  );
}

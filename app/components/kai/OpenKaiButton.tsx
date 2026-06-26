"use client";

import type { ReactNode } from "react";

type OpenKaiButtonProps = {
  children: ReactNode;
  className?: string;
  query?: string;
};

export function OpenKaiButton({
  children,
  className,
  query,
}: OpenKaiButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("kai:open", {
            detail: query ? { query } : undefined,
          }),
        );
      }}
    >
      {children}
    </button>
  );
}

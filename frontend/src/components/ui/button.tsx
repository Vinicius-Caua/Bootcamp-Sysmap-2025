import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 rounded-sm text-white shadow-xs hover:bg-primary-500/90",
        secondary:
          " border rounded-sm border-primary-600 bg-white text-primary-600 shadow-xs hover:bg-border-600/90 hover:text-primary-500/90",
        outline:
          "border rounded-sm border-title bg-white shadow-xs hover:border-title/90",
        danger:
          "bg-danger rounded-sm text-white shadow-xs hover:bg-danger/90 focus-visible:ring-danger/20",
        dangerOutline:
          "border rounded-sm border-danger bg-white text-danger shadow-xs hover:border-danger/60 hover:text-danger/60 focus-visible:danger/20",
        light: "border rounded-md text-text hover:bg-text/10",
        dark: "rounded-md bg-text text-white hover:bg-text/90",
        onlyText: "text-text bg-transparent",
      },
      size: {
        default: "px-4 py-3 has-[>svg]:px-3",
        sm: "px-4 py-0 has-[>svg]:px-3",
        lg: "px-6 py-3 rounded-md has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

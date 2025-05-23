"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "font-sans text-text rounded-lg border border-border shadow-lg p-4 min-w-[320px]",
          title: "text-title font-bold text-base",
          description: "text-text text-sm font-medium",
          success:
            "bg-white border-emerald-500 border-l-[8px] shadow-lg shadow-emerald-100",
          error:
            "bg-white border-red-600 border-l-[8px] shadow-lg shadow-red-100",
          info: "bg-white border-black border-l-[8px] shadow-lg shadow-gray-200",
          warning:
            "bg-white border-orange-500 border-l-[8px] shadow-lg shadow-orange-100",
          actionButton:
            "bg-primary-600 text-white hover:bg-primary-700 font-medium px-4 py-2",
          cancelButton:
            "bg-white text-text border border-border hover:bg-gray-100 font-medium",
          closeButton: "text-gray-600 hover:text-gray-900 p-1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

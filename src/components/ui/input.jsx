import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-[3px] border border-[#DFE1E6] bg-[#FAFBFC] px-3 py-2 text-sm text-[#172B4D] placeholder:text-[#6B778C] focus-visible:outline-none focus-visible:bg-white focus-visible:border-[#4C9AFF] focus-visible:ring-1 focus-visible:ring-[#4C9AFF] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

import * as React from "react"

import { cn } from "@/lib/utils"

function EnquireInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full border-b border-foreground outline-none focus:outline-none py-[10px]",
        "text-[18px] wide:text-[20px] text-role",
        "leading-[23px] wide:leading-[24px]",
        className
      )}
      {...props}
    />
  )
}

export { EnquireInput }

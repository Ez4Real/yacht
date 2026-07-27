import * as React from "react"

import { cn } from "@/lib/utils"

function EnquireTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full border border-foreground outline-none focus:outline-none p-[10px] min-h-[140px]",
        "text-[18px] wide:text-[20px] text-role",
        "leading-[23px] wide:leading-[24px]",
        className
      )}
      {...props}
    />
  )
}

export { EnquireTextarea }

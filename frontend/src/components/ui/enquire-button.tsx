import * as React from "react"
import { cn } from "@/lib/utils"


function EnquireButton({ className, type, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "bg-foreground py-[12.5px] px-[30px]",
        "text-background text-[26px] leading-[35px]",
        className
      )}
      {...props}
    />
  )      
}

export { EnquireButton }
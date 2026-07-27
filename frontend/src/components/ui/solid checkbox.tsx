import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"
import { useTheme } from "../theme-provider"

function SolidCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "appearance-none inline-flex items-center justify-center shrink-0",
        "border border-foreground shadow-none rounded-xs h-[24px] w-[24px] p-[4px] m-0 ",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <img
            src={
              `/assets/icons/${
                isDark
                  ? "enquire-checkmark-light.svg"
                  : "enquire-checkmark-dark.svg"}
              `} 
            alt=""
            className="w-[16px] h-[16px]"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { SolidCheckbox }

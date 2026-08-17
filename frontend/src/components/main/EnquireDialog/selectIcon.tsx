import { cn } from "@/lib/utils"

type SelectIconProps = {
  collapsed: boolean
}

export const SelectIcon = ({ collapsed }: SelectIconProps) => {
  return (
    <div className="p-[12px]">
      <svg
        viewBox="0 0 18 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn(
          "size-5 text-foreground transition-transform duration-350 ease-in-out",
          collapsed && "rotate-180",
        )}
      >
        <path
          d="M1.73242 1H15.5879L8.66016 13L1.73242 1Z"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </div>
  )
}

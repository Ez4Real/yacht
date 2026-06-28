import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";


type ThemeSwitcherProps = {
  className?: string
}

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      className={`p-0  mobile:hidden tablet:block ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="text-main-nav">
        {isDark ? "light mode" : "dark mode"}
      </span>
    </Button>
  )
}

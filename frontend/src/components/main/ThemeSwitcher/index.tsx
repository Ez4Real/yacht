import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/admin/theme-provider";

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      className={`p-0 h-[44px] text-main-nav ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="font-normal text-main">
        {isDark ? "light mode" : "dark mode"}
      </span> 
    </Button>
  );
}
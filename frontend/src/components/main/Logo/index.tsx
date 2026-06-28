import { useTheme } from "@/components/theme-provider";

type LogoProps = {
  className?: string;
};

export function Logo({ className = "" }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <img
      src={isDark ? "/assets/icons/logo-dark.svg" : "/assets/icons/logo-light.svg"}
      alt="BMA Yachts"
      className={className}
    />
  );
}
import { useTheme } from "@/components/theme-provider";
import { Link } from "@tanstack/react-router";


export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className="flex justify-end">

      <div className="w-[100%] tablet:w-[66%] laptop:w-[49.1%] gap-[20px] tablet:gap-[10px] desktop:gap-[30px]">

        <Link to="/" className="flex items-center mb-[20px] tablet:mb-[10px] laptop:mb-[10px] desktop:mb-[30px]">
          <p className="text-main-nav">instagram</p>
          <img
            className="w-[38px]"
            src={
              isDark
                ? "/assets/icons/arrow-dark.svg"
                : "/assets/icons/arrow.svg"
            }
            alt="inst"
          />
        </Link>

        <Link to="/">
          <p className="text-main-nav">broker@bmayachts.com</p>
        </Link>

      </div>
    </footer>
  )
}

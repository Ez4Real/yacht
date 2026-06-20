import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/admin/theme-provider";
import { Link } from "@tanstack/react-router";

type FooterProps = {
  fullWidth?: boolean;
  transparent?: boolean;
};

export const Footer = ({ fullWidth = false, transparent = false, }: FooterProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const footerWrapperClass = fullWidth ? "w-full" : "w-[50%]";
  const footerClass = transparent
    ? "flex justify-end z-1 text-foreground"
    : "flex justify-end z-1 bg-background text-foreground";

  return (
    <footer className={footerClass}>
      <div className={`${footerWrapperClass}`}>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-[30px]">
            <Button variant="ghost" className="flex items-center p-0 gap-0">
              <div className="flex items-center text-main-nav">
                <Link to="/" className="flex justify-center items-center">
                  instagram
                  <div className="w-[44px] h-[44px]">
                    <img
                      src={
                        isDark
                          ? "/assets/icons/arrow-dark.svg"
                          : "/assets/icons/arrow.svg"
                      }
                    />
                  </div>
                </Link>
              </div>
            </Button>

            <Button variant="ghost" className="flex items-center p-0 gap-0">
              <div className="text-main-nav h-[44px]">
                broker@bmayachts.com
              </div>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
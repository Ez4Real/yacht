import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/admin/theme-provider";

type FooterProps = {
  fullWidth?: boolean;
  transparent?: boolean;
};

export const Footer = ({ fullWidth = false, transparent = false, }: FooterProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

 const footerWrapperClass = fullWidth ? "w-full" : "w-[50%]";
 const footerClass = transparent
  ? "flex justify-end z-1 text-foreground"
  : "flex justify-end z-1 bg-background text-foreground";

  return (
    <footer className={footerClass}>
      <div className={`${footerWrapperClass} py-[30px]`}>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-[30px]">
            <Button variant="ghost" className="flex items-center p-0 gap-0">
              <div className="flex items-center font-normal text-main">
                <p>instagram</p>
                <div className="w-[44px] h-[44px] flex justify-center items-center">
                  <img
                    src={
                      isDark
                        ? "/assets/icons/arrow-dark.svg"
                        : "/assets/icons/arrow-right.svg"
                    }
                  />
                </div>
              </div>
            </Button>

            <Button variant="ghost" className="flex items-center p-0 gap-0">
              <div className="font-normal text-main">
                broker@bmayachts.com
              </div>
            </Button>
          </div>

          <Button
            variant="ghost"
            className="p-0 gap-0"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <div className="font-normal text-main">
              {isDark ? "light mode" : "dark mode"}
            </div>
          </Button>
        </div>
      </div>
    </footer>
  );
};
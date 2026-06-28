import { Link, useLocation } from "@tanstack/react-router"
import { Footer } from "@/components/main/Footer"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeSwitcher } from "../ThemeSwitcher"

const menuItems = [
  { label: "home", to: "/", activePath: "/" },
  { label: "team", to: "/members", activePath: "/members" },
  { label: "sales", to: "/sales", activePath: "/sales" },
  { label: "charters", to: "/charters", activePath: "/charters" },
  { label: "about us", to: "/about", activePath: "/about" },
  { label: "destinations", to: "/destinations", activePath: "/destinations" },
  { label: "concierge", to: "/concierge", activePath: "/concierge" },
  {
    label: "charter management",
    to: "/charter-management",
    activePath: "/charter-management",
  },
  {
    label: "owner representation",
    to: "/owner-representation",
    activePath: "/owner-representation",
  },
  {
    label: "spinnaker magazine",
    to: "/spinnaker-magazine",
    activePath: "/spinnaker-magazine",
  },
]

export const Menu = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const location = useLocation()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center transition-none"
                >
                    <p className="text-main-nav">menu</p>

                    <img
                        src={
                            isDark
                                ? "/assets/icons/plus-dark.svg"
                                : "/assets/icons/plus.svg"
                        }
                        alt="Open menu"
                        className="w-[38px]"
                    />
                </Button>
            </SheetTrigger>

      <SheetContent
        side="right"
        className="
                !fixed 
                !inset-0 
                !z-50 
                !max-w-none 
                !w-screen 
                !h-screen 
                border-0 
                bg-transparent 
                text-foreground 
                p-0
                ">
                <div className="flex h-screen justify-end">

                    <SheetClose asChild>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="flex-1 h-full cursor-default"
                        />
                    </SheetClose>

                    <div className="
                        w-[calc(100%)]
                        tablet:w-[calc(66%+35px)] 
                        laptop:w-[calc(50%+40px)]
                        desktop:w-[calc(50%+45px)]

                        h-full
                        bg-background 
                        flex 
                        flex-col 

                        pt-[13px] 
                        tablet:pt-[20px]
                        desktop:pt-[30px]

                        pr-[11px]
                        tablet:pr-[20px]
                        laptop:pr-[40px]
                        desktop:pr-[30px]
                        wide:pr-[50px]

                        pb-[40px]
                        tablet:pb-[20px]
                        desktop:pb-[40px]
                        wide:pb-[50px]

                        pl-[10px]
                        tablet:pl-[42px]
                        desktop:pl-[50px]
                        ">

                        <div className="flex justify-between pb-[13px] mobile:pb-[0]">
                            <SheetClose asChild>
                                <Button
                                    variant="ghost"
                                    className="
                                    flex items-center 
                                    p-0 
                                    gap-0 
                                    transition-none
                                    ">
                                    <p className="text-main-nav">menu</p>
                                    <img
                                        src={
                                            isDark
                                                ? "/assets/icons/minus-dark.svg"
                                                : "/assets/icons/minus.svg"
                                        }
                                        alt="Close menu"
                                        className="w-[38px]"
                                    />
                                </Button>
                            </SheetClose>

                            <Button variant="ghost"
                                className="
                                flex 
                                items-center 
                                p-0 
                                gap-0 
                                transition-none
                                mr-[-11px]
                                tablet:mr-[0]
                                ">
                                <p className="text-main-nav">enquire</p>
                                <img
                                    src={
                                        isDark
                                            ? "/assets/icons/plus-dark.svg"
                                            : "/assets/icons/plus.svg"
                                    }
                                    alt="iconPlus"
                                    className="w-[38px]"
                                />
                            </Button>
                        </div>
                        <nav className="
                            mt-[30px]
                            tablet:mt-[40px]
                            laptop:mt-[30px]

                            gap-[20px] 
                            tablet:gap-[5px]
                            desktop:gap-[10px]
                            flex 
                            flex-col 
                            items-start
                        ">
                            {menuItems.map((item) => {
                                const isActive =
                                    item.to === "/members"
                                        ? location.pathname.startsWith("/members")
                                        : item.to === "/destinations"
                                            ? location.pathname.startsWith("/destinations")
                                            : location.pathname === item.to;

                                return (
                                    <SheetClose asChild key={item.label}>
                                        <Link
                                            to={item.to}
                                            className={`text-menu ${isActive ? "text-foreground" : "text-role"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </nav>

                        <div className="mt-auto flex justify-between items-end w-[100%]">
                            <div className="flex items-end justify-end">
                                <div className="flex flex-col items-start gap-[20px] tablet:gap-[10px] desktop:gap-[30px]">

                                    <Link to="/" className="flex justify-center items-center">
                                        <p className="text-main-nav">instagram</p>
                                        <img
                                            className="w-[38px] tablet:w-[44px] laptop:w-[38px] desktop:w-[44px]"
                                            src={
                                                isDark
                                                    ? "/assets/icons/arrow-dark.svg"
                                                    : "/assets/icons/arrow.svg"
                                            }
                                            alt="instagramIcon"
                                        />
                                    </Link>

                                    <Link to="/" className="">
                                        <p className="text-main-nav">broker@bmayachts.com</p>
                                    </Link>

                                </div>
                            </div>
                            <ThemeSwitcher />
                        </div>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
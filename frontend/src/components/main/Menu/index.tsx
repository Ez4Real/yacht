import { Button } from "@/components/ui/button";
import { Footer } from "@/components/main/Footer";
import { useTheme } from "@/components/theme-provider";
import { Link, useLocation } from "@tanstack/react-router";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
    { label: "home", to: "/", activePath: "/" },
    { label: "team", to: "/members", activePath: "/members" },
    { label: "sales", to: "/sales", activePath: "/sales" },
    { label: "charters", to: "/charters", activePath: "/charters" },
    { label: "about us", to: "/about", activePath: "/about" },
    { label: "destinations", to: "/destinations", activePath: "/destinations" },
    { label: "concierge", to: "/concierge", activePath: "/concierge" },
    { label: "charter management", to: "/charter-management", activePath: "/charter-management" },
    { label: "owner representation", to: "/owner-representation", activePath: "/owner-representation" },
    { label: "spinnaker magazine", to: "/spinnaker-magazine", activePath: "/spinnaker-magazine" },
];

export const Menu = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const location = useLocation();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center w-[113px] h-[44px] p-0 gap-0 transition-none"
                >
                    <p className="font-normal text-main">menu</p>

                    <div className="w-[44px] h-[44px] flex justify-center items-center">
                        <img
                            src={
                                isDark
                                    ? "/assets/icons/plus-dark.svg"
                                    : "/assets/icons/plus.svg"
                            }
                            alt="Open menu"
                        />
                    </div>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="!fixed !inset-0 !z-50 !max-w-none !w-screen !h-screen border-0 bg-transparent text-foreground p-0"
            >
                <div className="flex h-screen">
                    <SheetClose asChild>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="w-1/2 h-full cursor-default"
                        />
                    </SheetClose>
                    <div className="ml-auto w-1/2 bg-background pl-[50px] pt-[30px] pr-[52px] pb-[20px] flex flex-col h-full">

                        <div className="flex justify-between">
                            <SheetClose asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center p-0 gap-0 transition-none"
                                >
                                    <p className="font-normal text-main">menu</p>

                                    <div className="w-[44px] h-[44px] flex justify-center items-center">
                                        <img
                                            src={
                                                isDark
                                                    ? "/assets/icons/minus-dark.svg"
                                                    : "/assets/icons/minus.svg"
                                            }
                                            alt="Close menu"
                                        />
                                    </div>
                                </Button>
                            </SheetClose>

                            <Button variant="ghost" className="flex items-center p-0 gap-0 transition-none">
                                <p className="font-normal text-main">enquire</p>

                                <div className="w-[44px] h-[44px] flex justify-center items-center">
                                    <img
                                        src={
                                            isDark
                                                ? "/assets/icons/plus-dark.svg"
                                                : "/assets/icons/plus.svg"
                                        }
                                        alt=""
                                    />
                                </div>
                            </Button>
                        </div>
                        <nav className="mt-[30px] gap-[10px] flex flex-col items-start">
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
                                            className={`text-title leading-[120%] ${isActive ? "text-foreground" : "text-role"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </nav>
                        <div className="mt-auto">
                            <Footer fullWidth transparent />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
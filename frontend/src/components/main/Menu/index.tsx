import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/main/Footer";
import { useTheme } from "@/components/admin/theme-provider";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const menuItems = [
    { label: "home", to: "/" },
    { label: "team", to: "/members" },
    { label: "sales", to: "/" },
    { label: "charters", to: "/" },
    { label: "about us", to: "/" },
    { label: "destinations", to: "/" },
    { label: "concierge", to: "/" },
    { label: "charter management", to: "/" },
    { label: "owner representation", to: "/" },
    { label: "spinnaker magazine", to: "/" },
];

export const Menu = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

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
                className="!fixed !inset-0 !z-50 !max-w-none !w-screen !h-screen border-0 bg-background text-foreground p-0"
            >
                <div className="flex h-screen">
                    <div className="w-1/2 bg-[#84858B]" />

                    <div className="w-1/2 pl-[50px] pt-[30px] pr-[52px] flex flex-col justify-between">
                        <div>
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
                                {menuItems.map((item, index) => (
                                    <SheetClose asChild key={item.label}>
                                        <Link
                                            to={item.to}
                                            className={`cursor-default text-title leading-[120%] ${index === 0 ? "text-foreground" : "text-role"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                        </div>

                        <Footer fullWidth transparent />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/admin/theme-provider";
import { Link } from "@tanstack/react-router";
import { Menu } from "@/components/main/Menu";

export const Header = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <header className="pt-[30px] pb-[30px] sticky top-0 z-10 bg-background text-foreground">
            <nav>
                <div className="flex justify-between items-center">
                    <div className="w-full">
                        <Button asChild variant="ghost" className="p-0 gap-0">
                            <Link to="/" className="font-normal text-main">
                                back
                            </Link>
                        </Button>
                    </div>

                    <div className="flex justify-between w-full">
                        <Button
                            variant="ghost"
                            className="flex items-center w-[113px] h-[44px] p-0 gap-0"
                        >
                            <p className="font-normal text-main">
                                <Menu />
                            </p>
                            <div className="w-[44px] h-[44px] flex justify-center items-center">
                                <img
                                    src={
                                        isDark
                                            ? "/assets/icons/plus-dark.svg"
                                            : "/assets/icons/plus.svg"
                                    }
                                />
                            </div>
                            
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center w-[136px] h-[44px] p-0 gap-0"
                        >
                            <p className="font-normal text-main">enquire</p>
                            <div className="w-[44px] h-[44px] flex justify-center items-center">
                                <img
                                    src={
                                        isDark
                                            ? "/assets/icons/plus-dark.svg"
                                            : "/assets/icons/plus.svg"
                                    }
                                />
                            </div>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};
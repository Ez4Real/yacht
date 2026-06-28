import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Menu } from "@/components/main/Menu";
import { useLocation } from "@tanstack/react-router";

export const Header = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <header>
            <nav>
                <div className="
                    
                    flex 
                    justify-between 
                    items-center 
                    
                    pt-[13px]
                    tablet:pt-[20px]
                    desktop:pt-[30px]

                    pb-[13px]
                    tablet:pb-[30px]
                    laptop:pb-[40px]
                    desktop:pb-[30px]
                ">
                    <div className="
                        mobile:hidden
                        tablet:block
                    ">
                        {!isHomePage && (
                            <Button onClick={() => window.history.back()} variant="ghost" className="p-0 gap-0">
                                <span className="text-main-nav">back</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-between w-[100%] tablet:w-[66%] laptop:w-[49.1%]">

                        <Menu />

                        <Button
                            variant="ghost"
                            className="flex items-center p-0 gap-0 mr-[-10px] tablet:mr-[0]"
                        >
                            <p className="text-main-nav">enquire</p>
                            <div className="w-[38px] flex justify-center items-center">
                                <img
                                    src={
                                        isDark
                                            ? "/assets/icons/plus-dark.svg"
                                            : "/assets/icons/plus.svg"
                                    }
                                    alt="iconPlus"
                                />
                            </div>
                        </Button>

                    </div>
                </div>
            </nav>
        </header>
    );
};
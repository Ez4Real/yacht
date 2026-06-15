import { Button } from "@/components/ui/button"

export const Header = () => {
    return (
        <header className="mr-[-6px] pt-[30px] pb-[30px]">
            <nav>
                <div className="flex justify-between items-center">

                    <div className="w-full">
                        <Button
                        variant="ghost"
                        className="p-[0px] gap-[0px]"
                    >
                        <p className="text-[#501500] font-[400] text-[26px]">back</p>
                    </Button>
                    </div>

                    <div className="flex gap-[659px] w-full">
                        <Button
                            variant="ghost"
                            className="flex items-center align-center w-[113px] h-[44px] p-[0px] gap-[0px]"
                        >
                            <p className="text-[#501500] font-[400] text-[26px]">menu</p>
                            <div className="w-[44px] h-[44px] flex justify-center items-center align-center">
                                <img src="/assets/icons/plus.svg" />
                            </div>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center align-center w-[136px] h-[44px] p-[0px] gap-[0px]"
                        >
                            <p className="text-[#501500] font-[400] text-[26px]">enquire</p>
                            <div className="w-[44px] h-[44px] flex justify-center items-center align-center">
                                <img src="/assets/icons/plus.svg" />
                            </div>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};
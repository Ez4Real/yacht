import { Button } from "@/components/ui/button"

export const Footer = () => {
    return (
        <footer>
            <div className="flex">
                <div className="w-full pointer-events-none">
                    <Button
                        variant="ghost"
                        className="p-[0px] gap-[0px]"
                    >

                    </Button>
                </div>

                <div className="flex w-full items-end justify-between">
                    <div className="flex flex-col items-start gap-[30px]">
                        <Button
                            variant="ghost"
                            className="flex items-center align-center p-[0px] gap-[0px]"
                        >
                            <div className="flex justify-center items-center align-center text-[#501500] font-[400] text-[26px]">
                                <p>instagram</p>
                                <div className="w-[44px] h-[44px] flex justify-center items-center align-center">
                                    <img src="/assets/icons/arrow-right.svg" />
                                </div>
                            </div>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center align-center p-[0px] gap-[0px]"
                        >
                            <div className="text-[#501500] font-[400] text-[26px]">
                                broker@bmayachts.com
                            </div>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        className="flex items-center align-center p-[0px] gap-[0px]"
                    >
                        <div className="text-[#501500] font-[400] text-[26px]">
                            dark mode
                        </div>
                    </Button>
                </div>
            </div>
        </footer>
    );
};
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { EnquireInput } from "@/components/ui/enquire-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
// import { useMutation } from "@tanstack/react-query";
import { EnquireTextarea } from "@/components/ui/enquire-textarea";
import { SolidCheckbox } from "@/components/ui/solid checkbox";
import { OpenAPI } from "@/client";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { EnquireButton } from "@/components/ui/enquire-button";

const formSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    reason: z.string().min(1, { message: "Reason is required" }),
    additional_info: z.string().min(1, { message: "Full name is required" }).optional(),
    contact: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

type MenuDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onShowMenu: () => void;
};

export const EnquireDialog = ({
    open,
    onOpenChange,
    onShowMenu
}: MenuDialogProps) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const email = OpenAPI.EMAIL

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
        },
    })

    // const mutation = useMutation({
    //     mutationFn: (data: FormData) =>
    //         ItemsService.updateItem({ id: item.id, requestBody: data }),
    //     onSuccess: () => {
    //     showSuccessToast("Item updated successfully")
    //     setIsOpen(false)
    //     onSuccess()
    //     },
    //     onError: handleError.bind(showErrorToast),
    //     onSettled: () => {
    //     queryClient.invalidateQueries({ queryKey: ["items"] })
    //     },
    // })

    // const onSubmit = (data: FormData) => {
    //     mutation.mutate(data)
    // }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
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
            </SheetTrigger>

            <SheetContent
                side="right"
                className="
          !fixed 
          !inset-0 
          !z-999
          !max-w-none 
          !w-screen 
          !h-screen 
          border-0 
          bg-transparent 
          text-foreground 
          p-0
        "
                aria-describedby={undefined}
            >
                <SheetTitle className="sr-only">
                    Navigation menu
                </SheetTitle>
                <div className="flex h-screen justify-end">
                    <SheetClose asChild>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="flex-1 h-full cursor-default"
                        />
                    </SheetClose>
                    <div
                        className="
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
                        "
                    >
                        <div className="flex justify-between pb-[13px] mobile:pb-[0]">
                            <Button
                                variant="ghost"
                                className="
                                    flex
                                    items-center
                                    p-0
                                    gap-0
                                    transition-none
                                    mr-[-11px]
                                    tablet:mr-[0]
                                "
                                onClick={onShowMenu}
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

                            <SheetClose asChild>
                                <Button
                                    variant="ghost"
                                    className="
                                    flex items-center 
                                    p-0 
                                    gap-0 
                                    transition-none
                                "
                                >
                                    <p className="text-main-nav">enquire</p>
                                    <img
                                        src={
                                            isDark
                                                ? "/assets/icons/minus-dark.svg"
                                                : "/assets/icons/minus.svg"
                                        }
                                        alt="Close enquire"
                                        className="w-[38px]"
                                    />
                                </Button>
                            </SheetClose>


                        </div>

                        <p
                            className="
                            enquire-title
                            mt-[42.5px]
                            tablet:mt-[27px]
                            laptop:mt-[18px]
                            desktop:mt-[30px]
                            wide:mt-[54.5px]
                          "
                        >
                            Let's Chat
                        </p>
                        <p className="
                            text-role
                            text-[18px]
                            desktop:text-[22px]

                            mt-[10px]
                            tracking-[0.02em]

                            whitespace-pre-line
                            tablet:whitespace-normal
                        "
                        >
                            Get in touch with one of our teams{"\n"}around the world
                        </p>

                        <Form {...form}>

                            <form
                                // onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div
                                  className="
                                    flex
                                    flex-col
                                    mt-[20px]
                                    tablet:mt-[45px]
                                    laptop:mt-[20px]
                                    desktop:mt-[30px]
                                    wide:mt-[50px]

                                    gap-[20px]
                                    laptop:gap-[15px]
                                    desktop:gap-[20px]
                                    wide:gap-[30px]
                                  "
                                >

                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) =>
                                            <FormItem
                                            className="
                                                border-0
                                            "
                                            >
                                                <FormControl>
                                                    <EnquireInput
                                                        type="text"
                                                        {...field}
                                                        placeholder="first and last name*"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        }
                                    >

                                    </FormField>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) =>
                                            <FormItem
                                            className="
                                                border-0
                                            "
                                            >
                                                <FormControl>
                                                    <EnquireInput
                                                        type="email"
                                                        {...field}
                                                        placeholder="email*"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) =>
                                            <FormItem
                                            className="
                                                border-0
                                            "
                                            >
                                                <FormControl>
                                                    <EnquireInput
                                                        type="text"
                                                        {...field}
                                                        placeholder="first and last name*"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="reason"
                                        render={({ field }) =>
                                            <FormItem
                                            className="
                                                border-0
                                            "
                                            >
                                                <FormControl>
                                                    <EnquireInput
                                                        type="text"
                                                        {...field}
                                                        placeholder="reason for enquiry*"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="additional_info"
                                        render={({ field }) =>
                                            <FormItem
                                            className="
                                                border-0
                                            "
                                            >
                                                <FormControl>
                                                    <EnquireTextarea
                                                        {...field}
                                                        placeholder="let us know any information you have in mind"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        }
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact"
                                        render={({ field }) => (
                                        <FormItem className="flex items-center gap-3 space-y-0 items-start">
                                            <FormControl>
                                            <div className="p-[10px]">
                                                <SolidCheckbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </div>
                                            </FormControl>
                                            <FormLabel
                                              className="
                                                font-normal
                                                text-[18px]

                                                wide:text-[20px]
                                              "
                                              
                                            >
                                                I confirm that I consent to being contacted by BMA in relation to the interests and details I have indicated above. For further details please see our Privacy Policy
                                            </FormLabel>
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <EnquireButton
                                    type="submit"
                                    className="
                                      mt-[20px]
                                      desktop:mt-[30px]
                                      wide:mt-[50px]


                                      w-[120px]
                                      
                                      mobile:hidden
                                      laptop:block
                                    "
                                >
                                    send
                                </EnquireButton>
                            </form>
                        </Form>


                        <div className="mt-auto flex justify-between items-end w-[100%]">
                            <div className="flex items-end justify-end">
                                <div className="flex flex-col items-start gap-[20px] tablet:gap-[10px] desktop:gap-[30px]">
                                    <a
                                    className="text-main-nav"
                                    href={`mailto:${email}`}
                                    target="_blank"
                                    >
                                    {email}
                                    </a>
                                </div>
                            </div>
                            <ThemeSwitcher />
                        </div>
                        
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}

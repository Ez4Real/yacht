import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { type EnquireContactCreate, EnquiresService, OpenAPI } from "@/client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { EnquireButton } from "@/components/ui/enquire-button"
import { EnquireInput } from "@/components/ui/enquire-input"
import { EnquireTextarea } from "@/components/ui/enquire-textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"
import { ThemeSwitcher } from "../ThemeSwitcher"
import { SelectIcon } from "./selectIcon"
import { SolidCheckbox } from "@/components/ui/solid checkbox"

const formSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Full name is required" })
    .refine((value) => value.split(/\s+/).length >= 2, {
      message: "Please enter both your first and last name",
  }),
  email: z.email({ message: "Invalid email address" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, {
      message: "Invalid phone number",
    })
    .or(z.literal(""))
    .optional(),
  customFields: z
    .array(
      z.object({
        id: z.string(),
        fieldValue: z.string(),
      }),
    )
    .max(2)
    .optional(),
  contact: z.boolean().refine((value) => value === true, {
    message: "You must agree before submitting",
  }),
})

type FormData = z.infer<typeof formSchema>

type EnquireDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShowMenu: () => void
}

export const EnquireDialog = ({
  open,
  onOpenChange,
  onShowMenu,
}: EnquireDialogProps) => {
  const { theme } = useTheme()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const isDark = theme === "dark"
  const email = OpenAPI.EMAIL

  const [selectOpen, setSelectOpen] = useState<boolean>(false)
  const enquiryReasonOptions = [
    { label: "charter", value: "charter" },
    { label: "sale", value: "sale" },
    { label: "management", value: "management" },
    { label: "other", value: "other" },
  ]

  useEffect(() => {
    document.body.classList.toggle("enquire-dialog-open", open)

    return () => {
      document.body.classList.remove("enquire-dialog-open")
    }
  }, [open])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    // mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      customFields: [
        { id: "reason", fieldValue: "" },
        { id: "note", fieldValue: "" },
      ],
      contact: false,
    },
  })

  const { mutate, data, isPending} = useMutation({
    mutationFn: (data: EnquireContactCreate) =>
      EnquiresService.createEnquireContact({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Enquire created successfully")
      form.reset()
      onOpenChange(false)
      console.log("Response: ", data)
    },
    onError: handleError.bind(showErrorToast),
  })

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      phone: data.phone?.trim() || null,
      customFields: data.customFields?.filter(
        (field) => field.fieldValue.trim() !== "",
      ),
    }
    mutate(payload)
  }

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
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
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
              h-dvh
              min-h-0
              overflow-y-auto
              overscroll-contain
              
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
            <p
              className="
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
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem className="border-0">
                        <FormControl>
                          <EnquireInput
                            type="text"
                            {...field}
                            placeholder="first and last name*"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="border-0">
                        <FormControl>
                          <EnquireInput
                            type="email"
                            {...field}
                            placeholder="email*"
                            required
                          />
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="border-0">
                        <FormControl>
                          <EnquireInput
                            type="text"
                            {...field}
                            placeholder="phone"
                          />
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customFields.0.fieldValue"
                    render={({ field }) => {
                      const selectedReason = enquiryReasonOptions.find(
                        (option) => option.value === field.value,
                      )

                      return (
                        <FormItem>
                          <Collapsible
                            open={selectOpen}
                            onOpenChange={setSelectOpen}
                            className="rounded-md"
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                type="button"
                                className="
                                  flex items-center relative w-full justify-between
                                  text-[18px] text-role
                                  after:absolute
                                  after:inset-x-0
                                  after:bottom-0
                                  after:h-px
                                  after:bg-foreground
                                  after:content-['']
                                "
                              >
                                {selectedReason?.label || "reason for enquiry"}

                                <SelectIcon collapsed={selectOpen} />
                              </button>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <div className="flex flex-col items-start">
                                {enquiryReasonOptions.map((option) => {
                                  const isSelected =
                                    field.value === option.value

                                  return (
                                    <Button
                                      variant="ghost"
                                      key={option.value}
                                      onClick={() => {
                                        field.onChange(option.value)
                                        setSelectOpen(false)
                                      }}
                                      className={cn(
                                        "w-full justify-start items-start",
                                        "text-[18px] leading-[23px]",
                                        "rounded-none",
                                        "py-[10px]",
                                        "border-0 border-b",
                                        isSelected
                                          ? "border-foreground"
                                          : "border-role",
                                      )}
                                    >
                                      {option.label}
                                    </Button>
                                  )
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="customFields.1.fieldValue"
                    render={({ field }) => (
                      <FormItem className="border-0">
                        <FormControl>
                          <EnquireTextarea
                            {...field}
                            placeholder="let us know any information you have in mind"
                          />
                        </FormControl>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0 items-start">
                        <FormControl>
                          <div className="p-[10px]">
                            <SolidCheckbox
                              id="contact"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormLabel htmlFor="contact"
                          className="
                            font-normal
                            text-[18px]
                            wide:text-[20px]
                          "
                        >
                          I confirm that I consent to being contacted by BMA in
                          relation to the interests and details I have indicated
                          above. For further details please see our Privacy
                          Policy
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                 
                  
                </div>
                <EnquireButton
                  type="submit"
                  disabled={isPending}
                  className="
                  mt-[20px]
                  desktop:mt-[30px]
                  wide:mt-[50px]
                  w-[120px]
                "
                >
                  send
                </EnquireButton>
              </form>
            </Form>

            <div
              className="
                flex justify-between items-end w-[100%] bg-red
                mt-[68px]
                tablet:mt-[34px]
                laptop:mt-[32px]
                desktop:mt-[26px]
                wide:mt-[108px]
              "
            >
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

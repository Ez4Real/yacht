import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  type Body_info_pages_create_info_page,
  InfoPagesService,
} from "@/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"

const formSchema = z.object({
  info_page_base: z.object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(64, { message: "Title must be at most 64 characters" }),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .max(512, { message: "Description must be at most 512 characters" }),
    content1: z
      .string()
      .min(1, { message: "Content 1 is required" })
      .max(2048, { message: "Content 1 must be at most 2048 characters" }),
    content2: z
      .string()
      .max(2048, { message: "Content 2 must be at most 2048 characters" })
      .optional(),
    content3: z
      .string()
      .max(2048, { message: "Content 2 must be at most 2048 characters" })
      .optional(),
    services: z.object({
      title: z
        .string()
        .min(1, { message: "Service title is required" })
        .max(64, { message: "Service title must be at most 64 characters" }),
      content: z
        .string()
        .min(1, { message: "Service content is required" })
        .max(2048, { message: "Service content must be at most 2048 characters" })
    }).optional()
  }),
  banner_image: z
    .file({ message: "Banner image is required" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, and WebP images are allowed",
    ),
  block_1_image: z
    .file()
    .optional()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG, and WebP images are allowed",
      },
    ),
  block_2_image: z
    .file()
    .optional()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG, and WebP images are allowed",
      },
    ),
})

type FormData = z.infer<typeof formSchema>

const AddInfoPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      info_page_base: {
        title: "",
        description: "",
        content1: "",
        content2: "",
        content3: "",
        services: undefined,
      },
      banner_image: undefined as File | undefined,
      block_1_image: undefined as File | undefined,
      block_2_image: undefined as File | undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Body_info_pages_create_info_page) =>
      InfoPagesService.createInfoPage({ formData: data }),
    onSuccess: () => {
      showSuccessToast("Info page created successfully")
      form.reset()
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["info-pages"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  const banner_image = form.watch("banner_image")
  const block_1_image = form.watch("block_1_image")
  const block_2_image = form.watch("block_2_image")

  const bannerImagePreviewUrl = useMemo(() => {
    if (!banner_image) return null
    return URL.createObjectURL(banner_image)
  }, [banner_image])

  const Block1ImagePreviewUrl = useMemo(() => {
    if (!block_1_image) return null
    return URL.createObjectURL(block_1_image)
  }, [block_1_image])

  const Block2ImagePreviewUrl = useMemo(() => {
    if (!block_2_image) return null
    return URL.createObjectURL(block_2_image)
  }, [block_2_image])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">
          <Plus className="mr-2" />
          Add InfoPage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add InfoPage</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new info page.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-4 items-start overflow-y-auto max-h-[80vh] scrollbar-hide">
              <FormField
                control={form.control}
                name="info_page_base.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        type="text"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info_page_base.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="banner_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner image <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0])
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {bannerImagePreviewUrl && (
                  <img
                    src={bannerImagePreviewUrl}
                    alt="Upload preview"
                    className="object-cover rounded-md"
                  />
                )}
              </div>

              <FormItem />

              <FormField
                control={form.control}
                name="info_page_base.content1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Content 1 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content 1" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="block_1_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Block 1 Image{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0])
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {Block1ImagePreviewUrl && (
                  <img
                    src={Block1ImagePreviewUrl}
                    alt="Upload preview"
                    className="object-cover rounded-md"
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="info_page_base.content2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Content 2 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="block_2_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Block 2 Image{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0])
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {Block2ImagePreviewUrl && (
                  <img
                    src={Block2ImagePreviewUrl}
                    alt="Upload preview"
                    className="object-cover rounded-md"
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="info_page_base.content3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Content 3 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem />

              <FormField
                control={form.control}
                name="info_page_base.services"
                render={({ field }) => {
                  const hasServices = field.value != null
                  
                  return (
                    <>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={hasServices}
                            onCheckedChange={
                              (checked) => {
                                if (checked) {
                                  field.onChange({ title: "", content: "", })
                                } else {
                                  field.onChange(undefined)
                                }
                              }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer"> Add services </FormLabel>
                      </FormItem> {hasServices && (
                        <div className="col-span-2 grid grid-cols-2 gap-4 items-start">
                          <FormField
                            control={form.control}
                            name="info_page_base.services.title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Services title <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Services title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>)}
                          />
                          <FormField
                            control={form.control}
                            name="info_page_base.services.content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Services content <span className="text-destructive">*</span>
                                </FormLabel>
                                <Textarea placeholder="Services content" {...field} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )} </>)
                }} />


            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={mutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddInfoPage

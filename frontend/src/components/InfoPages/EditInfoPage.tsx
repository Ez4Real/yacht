import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { type InfoPagePublic, InfoPagesService, OpenAPI } from "@/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
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
      .max(2024, { message: "Content 2 must be at most 2048 characters" })
      .optional(),
    content3: z
      .string()
      .max(2024, { message: "Content 3 must be at most 2048 characters" })
      .optional(),
  }),
  banner_image: z
    .file()
    .optional()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG, and WebP images are allowed",
      },
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

interface EditInfoPageProps {
  infoPage: InfoPagePublic
  onSuccess: () => void
}

const EditInfoPage = ({ infoPage, onSuccess }: EditInfoPageProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      info_page_base: {
        title: infoPage.title,
        description: infoPage.description,
        content1: infoPage.content1,
        content2: infoPage.content2 ?? undefined,
        content3: infoPage.content3 ?? undefined,
      },
      banner_image: undefined,
      block_1_image: undefined,
      block_2_image: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      InfoPagesService.updateInfoPage({
        id: infoPage.id,
        formData: data,
      }),
    onSuccess: () => {
      showSuccessToast("Info page updated successfully")
      setIsOpen(false)
      onSuccess()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["info-pages"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  const bannerImage = form.watch("banner_image")
  const block_1_image = form.watch("block_1_image")
  const block_2_image = form.watch("block_2_image")

  const bannerImagePreviewUrl = useMemo(() => {
    if (bannerImage) {
      return URL.createObjectURL(bannerImage)
    }

    return infoPage.banner_image?.url
      ? `${OpenAPI.BASE}/media${infoPage.banner_image.url}`
      : null
  }, [bannerImage, infoPage.banner_image?.url])

  const Block1ImagePreviewUrl = useMemo(() => {
    if (block_1_image) {
      return URL.createObjectURL(block_1_image)
    }

    return infoPage.block_1_image?.url
      ? `${OpenAPI.BASE}/media${infoPage.block_1_image.url}`
      : null
  }, [block_1_image, infoPage.block_1_image?.url])

  const Block2ImagePreviewUrl = useMemo(() => {
    if (block_2_image) {
      return URL.createObjectURL(block_2_image)
    }

    return infoPage.block_2_image?.url
      ? `${OpenAPI.BASE}/media${infoPage.block_2_image.url}`
      : null
  }, [block_2_image, infoPage.block_2_image?.url])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        <Pencil />
        Edit Info Page
      </DropdownMenuItem>
      <DialogContent className="sm:max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Info Page</DialogTitle>
              <DialogDescription>
                Update the info page details below.
              </DialogDescription>
            </DialogHeader>
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
                      <Input placeholder="Title" type="text" {...field} />
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
                      <Textarea placeholder="Description" {...field} />
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
                    alt={
                      infoPage.banner_image?.alt_text ||
                      "Info page banner image"
                    }
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
                      <Textarea placeholder="Content 1" {...field} />
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
                        Block 1 image{" "}
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
                    alt={
                      infoPage.banner_image?.alt_text ||
                      "Info page block 1 image"
                    }
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
                        Block 2 image{" "}
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
                    alt={
                      infoPage.banner_image?.alt_text ||
                      "Info page block 2 image"
                    }
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

export default EditInfoPage

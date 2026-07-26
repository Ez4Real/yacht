import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  type Body_destinations_create_destination,
  DestinationsService,
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

const formSchema = z.object({
  destination_base: z.object({
    region: z.string().min(1, { message: "Region is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    destination: z.string().min(1, { message: "Destination is required" }),
    description: z
      .string()
      .min(1, { message: "Description is required" })
      .max(512, { message: "Description must be at most 512 characters" }),
    content1: z
      .string()
      .min(1, { message: "Content 1 is required" })
      .max(1024, { message: "Content 1 must be at most 1024 characters" }),
    content2: z
      .string()
      .min(1, { message: "Content 2 is required" })
      .max(2024, { message: "Content 2 must be at most 1024 characters" }),
  }),
  banner_image: z
    .instanceof(File, { message: "Banner image is required" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, and WebP images are allowed",
    ),
  side_image: z
    .instanceof(File, { message: "Side image is required" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, and WebP images are allowed",
    ),
})

type FormData = z.infer<typeof formSchema>

const AddDestination = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      destination_base: {
        region: "",
        country: "",
        destination: "",
        description: "",
        content1: "",
        content2: "",
      },
      banner_image: undefined as File | undefined,
      side_image: undefined as File | undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Body_destinations_create_destination) =>
      DestinationsService.createDestination({ formData: data }),
    onSuccess: () => {
      showSuccessToast("Destination created successfully")
      form.reset()
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  const banner_image = form.watch("banner_image")
  const side_image = form.watch("side_image")

  const bannerImagePreviewUrl = useMemo(() => {
    if (!banner_image) return null
    return URL.createObjectURL(banner_image)
  }, [banner_image])

  const sideImagePreviewUrl = useMemo(() => {
    if (!side_image) return null
    return URL.createObjectURL(side_image)
  }, [side_image])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">
          <Plus className="mr-2" />
          Add Destination
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Destination</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new destination.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-4 items-start overflow-y-auto max-h-[80vh] scrollbar-hide">
              <FormField
                control={form.control}
                name="destination_base.region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Region <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Region"
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
                name="destination_base.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country"
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
                name="destination_base.destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Destination <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Destination"
                        type="text"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem />

              <FormField
                control={form.control}
                name="destination_base.description"
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

              <FormItem />

              <FormField
                control={form.control}
                name="destination_base.content1"
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

              <FormField
                control={form.control}
                name="destination_base.content2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Content 2 <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content 2" {...field} required />
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

              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="side_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Side image <span className="text-destructive">*</span>
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

                {sideImagePreviewUrl && (
                  <img
                    src={sideImagePreviewUrl}
                    alt="Upload preview"
                    className="object-cover rounded-md"
                  />
                )}
              </div>
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

export default AddDestination

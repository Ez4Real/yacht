// import { zodResolver } from "@hookform/resolvers/zod"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { Pencil } from "lucide-react"
// import { useMemo, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { type DestinationPublic, DestinationsService, OpenAPI } from "@/client"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { LoadingButton } from "@/components/ui/loading-button"
// import useCustomToast from "@/hooks/useCustomToast"
// import { handleError } from "@/utils"
// import { Textarea } from "../ui/textarea"

// const formSchema = z.object({
//   destination_base: z.object({
//     region: z.string().min(1, { message: "Region is required" }),
//     country: z.string().min(1, { message: "Country is required" }),
//     destination: z.string().min(1, { message: "Destination is required" }),
//     description: z
//       .string()
//       .min(1, { message: "Description is required" })
//       .max(512, { message: "Description must be at most 512 characters" }),
//     content1: z
//       .string()
//       .min(1, { message: "Content 1 is required" })
//       .max(1024, { message: "Content 1 must be at most 1024 characters" }),
//     content2: z
//       .string()
//       .min(1, { message: "Content 2 is required" })
//       .max(2024, { message: "Content 2 must be at most 1024 characters" }),
//   }),
//   banner_image: z
//     .instanceof(File, { message: "Banner image is required" })
//     .optional()
//     .refine(
//       (file) =>
//         !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
//       {
//         message: "Only JPG, PNG, and WebP images are allowed",
//       },
//     ),
//   side_image: z
//     .instanceof(File, { message: "Side image is required" })
//     .optional()
//     .refine(
//       (file) =>
//         !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
//       {
//         message: "Only JPG, PNG, and WebP images are allowed",
//       },
//     ),
// })

// type FormData = z.infer<typeof formSchema>

// interface EditDestinationProps {
//   destination: DestinationPublic
//   onSuccess: () => void
// }

// const EditDestination = ({ destination, onSuccess }: EditDestinationProps) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const queryClient = useQueryClient()
//   const { showSuccessToast, showErrorToast } = useCustomToast()

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     mode: "onBlur",
//     criteriaMode: "all",
//     defaultValues: {
//       destination_base: {
//         region: destination.region,
//         country: destination.country,
//         destination: destination.destination,
//         description: destination.description,
//         content1: destination.content1,
//         content2: destination.content2 ?? undefined,
//       },
//       banner_image: undefined,
//       side_image: undefined,
//     },
//   })

//   const mutation = useMutation({
//     mutationFn: (data: FormData) =>
//       DestinationsService.updateDestination({
//         id: destination.id,
//         formData: data,
//       }),
//     onSuccess: () => {
//       showSuccessToast("Destination updated successfully")
//       setIsOpen(false)
//       onSuccess()
//     },
//     onError: handleError.bind(showErrorToast),
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["destinations"] })
//     },
//   })

//   const onSubmit = (data: FormData) => {
//     mutation.mutate(data)
//   }

//   const bannerImage = form.watch("banner_image")
//   const sideImage = form.watch("side_image")

//   const bannerImagePreviewUrl = useMemo(() => {
//     if (bannerImage) {
//       return URL.createObjectURL(bannerImage)
//     }

//     return destination.banner_image?.url
//       ? `${OpenAPI.BASE}/media${destination.banner_image.url}`
//       : null
//   }, [bannerImage, destination.banner_image?.url])

//   const sideImagePreviewUrl = useMemo(() => {
//     if (sideImage) {
//       return URL.createObjectURL(sideImage)
//     }

//     return destination.side_image?.url
//       ? `${OpenAPI.BASE}/media${destination.side_image.url}`
//       : null
//   }, [sideImage, destination.side_image?.url])

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DropdownMenuItem
//         onSelect={(e) => e.preventDefault()}
//         onClick={() => setIsOpen(true)}
//       >
//         <Pencil />
//         Edit Destination
//       </DropdownMenuItem>
//       <DialogContent className="sm:max-w-4xl">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <DialogHeader>
//               <DialogTitle>Edit Destination</DialogTitle>
//               <DialogDescription>
//                 Update the destination details below.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid grid-cols-2 gap-4 py-4 items-start overflow-y-auto max-h-[80vh] scrollbar-hide">
//               <FormField
//                 control={form.control}
//                 name="destination_base.region"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Region <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Input placeholder="Region" type="text" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="destination_base.country"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Country <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Input placeholder="Country" type="text" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="destination_base.destination"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Destination <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Input placeholder="Destination" type="text" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormItem />

//               <FormField
//                 control={form.control}
//                 name="destination_base.description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Description <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Description" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormItem />

//               <FormField
//                 control={form.control}
//                 name="destination_base.content1"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Content 1 <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Content 1" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="destination_base.content2"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Content 2 <span className="text-destructive">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Content 2" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex flex-col gap-2">
//                 <FormField
//                   control={form.control}
//                   name="banner_image"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Banner image <span className="text-destructive">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/png,image/jpeg,image/webp"
//                           onChange={(e) => {
//                             field.onChange(e.target.files?.[0])
//                           }}
//                           name={field.name}
//                           onBlur={field.onBlur}
//                           ref={field.ref}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {bannerImagePreviewUrl && (
//                   <img
//                     src={bannerImagePreviewUrl}
//                     alt={
//                       destination.banner_image?.alt_text ||
//                       "Destination banner image"
//                     }
//                     className="object-cover rounded-md"
//                   />
//                 )}
//               </div>

//               <div className="flex flex-col gap-2">
//                 <FormField
//                   control={form.control}
//                   name="side_image"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Side image <span className="text-destructive">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/png,image/jpeg,image/webp"
//                           onChange={(e) => {
//                             field.onChange(e.target.files?.[0])
//                           }}
//                           name={field.name}
//                           onBlur={field.onBlur}
//                           ref={field.ref}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {sideImagePreviewUrl && (
//                   <img
//                     src={sideImagePreviewUrl}
//                     alt={
//                       destination.banner_image?.alt_text ||
//                       "Destination banner image"
//                     }
//                     className="object-cover rounded-md"
//                   />
//                 )}
//               </div>
//             </div>

//             <DialogFooter>
//               <DialogClose asChild>
//                 <Button variant="outline" disabled={mutation.isPending}>
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <LoadingButton type="submit" loading={mutation.isPending}>
//                 Save
//               </LoadingButton>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default EditDestination

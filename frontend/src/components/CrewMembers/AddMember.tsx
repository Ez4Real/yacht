import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type Body_crew_members_create_crew_member, CrewMemberRolesService, CrewMembersService } from "@/client"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { Textarea } from "../ui/textarea"


const formSchema = z.object({
  crew_member_base: z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    role_id: z
      .uuid("Invalid role id")
      .min(1, "Role is required"),
    color: z.string().min(1, { message: "Color is required" }),
    email: z
      .email("Invalid email address")
      .min(1, { message: "Email is required" })
      .trim()
      .toLowerCase(), 
    instagram: z
      .string()
      .trim()
      .min(1, { message: "Instagram is required" }),
    background: z.string().min(1, { message: "Background is required" }),
    motto: z.string().min(1, { message: "Background is required" })
  }),
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPG, PNG, and WebP images are allowed"
  )
})

type FormData = z.infer<typeof formSchema>

const AddMember = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const { data: roles } = useSuspenseQuery({
    queryFn: () =>
      CrewMemberRolesService.readCrewMemberRoles(),
    queryKey: ["crew_member_roles"],
  })

  const roleOptions = useMemo(() => roles.data.map((role) => ({
      label: role.name,
      value: role.id,
    })),
  [roles.data])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      crew_member_base: {
        first_name: "",
        last_name: "",
        role_id: "",
        color: "",
        email: "",
        instagram: "",
        background: "",
        motto: "",
      },
      image: undefined as File | undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Body_crew_members_create_crew_member) =>
      CrewMembersService.createCrewMember({ formData: data }),
    onSuccess: () => {
      showSuccessToast("Item created successfully")
      form.reset()
      setIsOpen(false)
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }


  const image = form.watch("image")

  const previewUrl = useMemo(() => {
    if (!image) return null
    return URL.createObjectURL(image)
  }, [image])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">
          <Plus className="mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new crew member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <FormField
                control={form.control}
                name="crew_member_base.first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First name"
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
                name="crew_member_base.last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last name"
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
                name="crew_member_base.role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      >
                      <FormControl>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue
                            placeholder="Select a role"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>

                          {roleOptions.map((role) => (
                            <SelectItem
                              key={role.value}
                              value={role.value}
                            >
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crew_member_base.color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Color <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Color"
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
                name="crew_member_base.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        autoComplete="email"
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
                name="crew_member_base.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Instagram <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@username"
                        autoComplete="off"
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
                name="crew_member_base.background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Member background"
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
                name="crew_member_base.motto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Motto <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Member motto"
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Image <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        // {...field}
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

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-32 object-cover rounded-md"
                />
              )}
              
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

export default AddMember

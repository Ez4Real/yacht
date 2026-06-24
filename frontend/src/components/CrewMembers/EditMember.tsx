import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { OpenAPI } from "@/client"
import { CrewMemberPublic, CrewMemberRolesService, CrewMembersService } from "@/client"
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
    .optional()
})

type FormData = z.infer<typeof formSchema>

interface EditMemberProps {
  member: CrewMemberPublic
  onSuccess: () => void
}

const EditMember = ({ member, onSuccess }: EditMemberProps) => {
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
        first_name: member.first_name,
        last_name: member.last_name,
        role_id: member.role_id,
        color: member.color,
        email: member.email,
        instagram: member.instagram,
        background: member.background,
        motto: member.motto,
      },
      image: undefined
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      CrewMembersService.updateCrewMember({
        id: member.id,
        formData: data,
      }),
    onSuccess: () => {
      showSuccessToast("Member updated successfully")
      setIsOpen(false)
      onSuccess()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["crew_member"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }


  const image = form.watch("image")

  const previewUrl = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image)
    }

    return member.image?.url
      ? `${OpenAPI.BASE}/media${member.image.url}`
      : null
  }, [image, member.image?.url])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        <Pencil />
        Edit Member
      </DropdownMenuItem>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
              <DialogDescription>
                Update the member details below.
              </DialogDescription>
            </DialogHeader>
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
                  alt={member.image?.alt_text || "Member image"}
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

export default EditMember

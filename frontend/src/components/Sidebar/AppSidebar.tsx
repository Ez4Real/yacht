import { Sailboat, Users, UserCog } from "lucide-react"

import { SidebarAppearance } from "@/components/Common/Appearance"
import { Logo } from "@/components/Common/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { type Item, Main } from "./Main"
import { User } from "./User"

const baseItems: Item[] = [
  { icon: Sailboat, title: "Go to Website", path: "/" },
  // { icon: Briefcase, title: "Items", path: "/items" },
  { icon: UserCog, title: "Crew Member Roles", path: "/admin/crew-member-role" },
]

export function AppSidebar() {
  const { user: currentUser } = useAuth()

  const items: Item[] = currentUser?.is_superuser
    ? [
      { icon: Users, title: "Users", path: "/admin/admin-management" }, ...baseItems]
    : baseItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" />
      </SidebarHeader>
      <SidebarContent>
        <Main items={items} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <User user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

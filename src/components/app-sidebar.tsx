import ROUTERS from "@/constants/routes"
import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: ROUTERS.ADMIN.dashboard,
      icon: IconDashboard,
    },
    {
      title: "Quản lý sản phẩm",
      url: ROUTERS.ADMIN.products.root,
      icon: IconListDetails,
    },
    {
      title: "Quản lý danh mục",
      url: ROUTERS.ADMIN.categories.root,
      icon: IconListDetails,
    },
    {
      title: "Quản lý màu sắc",
      url: ROUTERS.ADMIN.colors.root,
      icon: IconListDetails,
    },
    {
      title: "Quản lý thương hiệu",
      url: ROUTERS.ADMIN.brands.root,
      icon: IconListDetails,
    },
    {
      title: "Quản lý người dùng",
      url: ROUTERS.ADMIN.users.root,
      icon: IconChartBar,
    },


  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">E-commerce Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, type JSX } from "react";
import { useLocation, useNavigate } from "react-router";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: JSX.Element
  }[]
}) {

  const location = useLocation();
  const navigate = useNavigate();

  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              onClick={() => {
                setOpenMobile(false);
                navigate(item.url);
              }}
              key={item.title} className={location.pathname === item.url ? "bg-secondary text-secondary-foreground rounded-lg" : ""}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

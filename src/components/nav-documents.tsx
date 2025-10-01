"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useUIStore } from "@/store";
import { ComponentIcon, ExternalLinkIcon, UsersIcon } from "lucide-react";
export function NavDocuments() {
	const { isMobile } = useSidebar();
	const recentlyVisited = [
		{
			name: "Users",
			link: "/users",
			icon: <UsersIcon />,
		},
		{
			name: "Groups",
			link: "/groups",
			icon: <ComponentIcon />,
		},
	];

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Manage</SidebarGroupLabel>
			<SidebarMenu>
				{recentlyVisited.map((item, index) => (
					<SidebarMenuItem key={index}>
						<SidebarMenuButton asChild>
							<Link to={item.link}>
								{item.icon}
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

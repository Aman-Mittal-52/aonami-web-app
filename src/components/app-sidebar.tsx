import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	DatabaseIcon,
	ExternalLinkIcon,
	FolderIcon,
	Frame,
	GalleryVerticalEnd,
	HouseIcon,
	InfoIcon,
	ListIcon,
	Map,
	PieChart,
	RefreshCcwDotIcon,
	SearchIcon,
	Settings2,
	SettingsIcon,
	SquareTerminal,
	WorkflowIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { NavDocuments } from "@/components/nav-documents.tsx";
import { NavSecondary } from "@/components/nav-secondary.tsx";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: HouseIcon,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: FolderIcon,
		},
		{
			title: "Workflows",
			url: "/workflows",
			icon: WorkflowIcon,
		},
		{
			title: "Executions",
			url: "/executions",
			icon: RefreshCcwDotIcon,
		},
		{
			title: "Tasks",
			url: "/tasks",
			icon: ListIcon,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: SettingsIcon,
		},
		{
			title: "Get Help",
			url: "#",
			icon: InfoIcon,
		},
		{
			title: "Search",
			url: "#",
			icon: SearchIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

	const { setOpen, open } = useSidebar()

	React.useEffect(() => {
		setTimeout(() => {
			setOpen(false)
		}, 4000);
	}, [])

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
								<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
									<img
										src="/logo/logo.svg"
										className="w-6 aspect-square dark:invert"
									/>
								</div>
								<span className={`text-base font-semibold ${open ? "" : "hidden"}`}>
									Aonami Inc.
								</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}

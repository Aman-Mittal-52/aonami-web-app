import React, { useEffect, useMemo } from "react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { useLocation, useNavigate } from "react-router";
import { useStore, useUIStore } from "@/store";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

function Breadcrumbs() {
	const location = useLocation();
	const navigate = useNavigate();
	const { pushRecentlyVisited } = useUIStore();
	const { getProject, getWorkflow, getExecution } = useStore();
	const crumbs: { label: string; location: string }[] = useMemo(() => {
		const pathNames = location.pathname
			.split("/")
			.filter((name) => name.length);

		console.log(pathNames, "pathNames");

		if (pathNames.length === 0) {
			return [];
		}

		if (pathNames.length === 1) {
			return [{ label: pathNames[0], location: location.pathname }];
		}

		if (pathNames.length === 2) {
			if (pathNames[0] === "projects") {
				return [
					{
						label: pathNames[0],
						location: location.pathname.slice(
							0,
							location.pathname.indexOf(pathNames[1])
						),
					},
					{
						label: getProject(pathNames[1])?.name || pathNames[1],
						location: location.pathname,
					},
				];
			}

			if (pathNames[0] === "workflows") {
				return [
					{
						label: pathNames[0],
						location: location.pathname.slice(
							0,
							location.pathname.indexOf(pathNames[1])
						),
					},
					{
						label: getWorkflow(pathNames[1])?.name || pathNames[1],
						location: location.pathname,
					},
				];
			}

			if (pathNames[0] === "executions") {
				const execution = getExecution(pathNames[1]);
				const workflow = getWorkflow(execution?.workflowId);
				console.log(pathNames[1], getExecution(pathNames[1]));
				return [
					{
						label: pathNames[0],
						location: location.pathname.slice(
							0,
							location.pathname.indexOf(pathNames[1])
						),
					},
					{
						label: workflow?.name || pathNames[1],
						location: location.pathname,
					},
				];
			}
		}

		throw new Error("Invalid path");
	}, [location.pathname]);

	useEffect(() => {
		if (crumbs.length > 0) {
			pushRecentlyVisited({
				name: crumbs[crumbs.length - 1].label,
				link: location.pathname,
			});
		}
	}, [crumbs]);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem key="/" className="hidden md:block">
					<BreadcrumbLink onClick={() => navigate("/")}>
						Dashboard
					</BreadcrumbLink>
				</BreadcrumbItem>
				{crumbs.length > 0 &&
					crumbs.map((crumb, index) => (
						<>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem key={crumb.location}>
								{index === crumbs.length - 1 ? (
									<BreadcrumbPage>
										<BreadcrumbLink
											onClick={() =>
												navigate(crumb.location)
											}
											className="capitalize"
										>
											{crumb.label}
										</BreadcrumbLink>
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										onClick={() => navigate(crumb.location)}
										className="capitalize"
									>
										{crumb.label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</>
					))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function Layout({ children }: { children: React.ReactNode }) {


	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex px-4 h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 mr-2">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumbs />
					</div>
					<ModeToggle />
				</header>
				<ScrollArea className="max-h-[calc(100vh-64px)] ">
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<>{children}</>
					</div>
				</ScrollArea>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default Layout;

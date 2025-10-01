import { useEffect, useMemo } from "react";
import ApiClient from "../utils/api/client";
import { PermissionEnum, useAuthStore, useStore, type Project } from "@/store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { create } from "zustand";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { ProjectVisibility } from "@/utils/api/resources/ProjectResource";
import { RefreshCw, Zap, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type SharedStore = {
	isCreateDialogOpen: boolean;
	query: string;
	setIsCreateDialogOpen: (isOpen: boolean) => void;
	setQuery: (q: string) => void;
};

const useSharedStore = create<SharedStore>((set) => ({
	isCreateDialogOpen: false,
	query: "",
	setIsCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
	setQuery: (q) => set({ query: q }),
}));

function ProjectCard({ project }: { project: Project }) {
	return (
		<Card className="mb-8 p-0">
			<CardContent className="p-6">
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
					<div>
						<div className="flex items-center gap-2">
							<Package className="text-primary size-5" />
							<h2 className="text-lg font-semibold">
								{project.name}
							</h2>
							<Badge>
								{project.visibility ===
								ProjectVisibility.PRIVATE
									? "Private"
									: "Team"}
							</Badge>
						</div>
						<p className="text-muted-foreground mt-1 text-sm">
							{project.description}
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline">Manage</Button>
					</div>
				</div>

				<div className="mt-6 space-y-4">
					<div>
						<div className="mb-2 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Zap className="text-primary size-4" />
								<span className="text-sm font-medium">
									Workflows
								</span>
							</div>
							<span className="text-sm">143 / 200</span>
						</div>
						<Progress value={71.5} className="h-2" />
					</div>

					<div>
						<div className="mb-2 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<RefreshCw className="text-primary size-4" />
								<span className="text-sm font-medium">
									Monthly Executions
								</span>
							</div>
							<span className="text-sm">8,543 / 10,000</span>
						</div>
						<Progress value={85.43} className="h-2" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function CreateProjectDialog() {
	const { isCreateDialogOpen, setIsCreateDialogOpen } = useSharedStore();
	const { addProject } = useStore();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	// const [categories, setCategories] = useState<string[]>([]);
	const [visibility, setVisibility] = useState<ProjectVisibility>(
		ProjectVisibility.TEAM
	);
	const handleCreate = async () => {
		try {
			const response = await ApiClient.projects.create({
				name,
				description,
				categories: "",
				visibility,
			});

			addProject(response);
		} catch (e) {
			console.log(e);
		}

		setIsCreateDialogOpen(false);
	};

	return (
		<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add new project</DialogTitle>
						<DialogDescription>
							Click create when you&apos;re ready.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="name-1">Name</Label>
							<Input
								id="name-1"
								name="name"
								required
								placeholder="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="description-1">Description</Label>
							<Input
								id="description-1"
								name="description"
								required
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="project-1">Visibility</Label>
							<Select
								required
								onValueChange={(value) =>
									setVisibility(
										Number(value) as ProjectVisibility
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a project" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Visibility</SelectLabel>
										<SelectItem
											value={ProjectVisibility.PRIVATE.toString()}
										>
											Private
										</SelectItem>
										<SelectItem
											value={ProjectVisibility.TEAM.toString()}
										>
											Team
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsCreateDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button onClick={handleCreate}>Create</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}

function Toolbar() {
	const { permissions } = useAuthStore();
	const query = useSharedStore((state) => state.query);
	const setQuery = useSharedStore((state) => state.setQuery);
	const setIsCreateDialogOpen = useSharedStore(
		(state) => state.setIsCreateDialogOpen
	);
	const showAddProjectButton =
		permissions.includes(PermissionEnum.WRITE_PROJECT) ||
		permissions.includes(PermissionEnum.ALL);
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Filter projects..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
			{showAddProjectButton && (
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						onClick={() => setIsCreateDialogOpen(true)}
					>
						Add Project
					</Button>
				</div>
			)}
		</div>
	);
}

function Projects() {
	const { query } = useSharedStore((state) => state);
	const { projects } = useStore();
	const filteredProjects = useMemo(() => {
		if (!query || !query.length) return projects;
		return projects.filter((project) =>
			project.name.toLowerCase().includes(query.toLowerCase())
		);
	}, [query, projects]);

	return (
		<div className="grid auto-rows-min gap-4 md:grid-cols-3">
			{filteredProjects.map((project) => {
				return <ProjectCard key={project.id} project={project} />;
			})}
		</div>
	);
}

function ProjectPage() {
	const { setProjects } = useStore();

	useEffect(() => {
		ApiClient.projects.getAll().then(setProjects);
	}, []);

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Projects
						</h2>
						<p className="text-muted-foreground">
							View your projects or create one.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<CreateProjectDialog />
					<Toolbar />
					<Projects />
				</div>
			</div>
		</>
	);
}

export default ProjectPage;

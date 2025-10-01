import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import { create } from "zustand";
import { useNavigate } from "react-router";
import {
	useStore,
	type Workflow,
	useAuthStore,
	PermissionEnum,
} from "@/store.ts";
import axios from "axios";
import { toast } from "sonner";
import TimeAgo from "react-timeago";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FolderIcon, PlayIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SharedStore {
	workflowId: string | null;
	setWorkflowId: (q: string) => void;
	isRunWorkflowDialogOpen: boolean;
	isCreateDialogOpen: boolean;
	query: string;
	setQuery: (q: string) => void;
	setIsCreateDialogOpen: (isOpen: boolean) => void;
	setIsRunWorkflowDialogOpen: (isOpen: boolean) => void;
}

export const useSharedStore = create<SharedStore>((set) => ({
	workflowId: null,
	setWorkflowId: (q: string) => set({ workflowId: q }),
	isRunWorkflowDialogOpen: false,
	isCreateDialogOpen: false,
	query: "",
	setQuery: (q) => set({ query: q }),
	setIsCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
	setIsRunWorkflowDialogOpen: (isOpen) =>
		set({ isRunWorkflowDialogOpen: isOpen }),
}));

export function RunWorkflowDialog() {
	const { isRunWorkflowDialogOpen, setIsRunWorkflowDialogOpen, workflowId } =
		useSharedStore();
	const { addExecution, workflows } = useStore();

	const [file1, setFile1] = useState<string | File>(
		"s3://aonamireconbucket/actual_values.csv"
	);
	const [file2, setFile2] = useState<string | File>(
		"s3://aonamireconbucket/expected_values.csv"
	);

	const navigate = useNavigate();

	const [UTR, setUTR] = useState("UTR002");

	const workflow = useMemo(
		() => workflows.find((w) => w.id === workflowId),
		[workflowId, workflows]
	);

	const readFileAsText = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target?.result as string);
			reader.onerror = (error) => reject(error);
			reader.readAsText(file);
		});
	};

	const parseCSV = (csvText: string): any[] => {
		const lines = csvText.split('\n');
		if (lines.length === 0) return [];

		const headers = lines[0].split(',').map(header => header.trim());
		return lines.slice(1)
			.map(line => {
				if (!line.trim()) return null;
				const values = line.split(',');
				return headers.reduce((obj, header, index) => {
					obj[header] = values[index]?.trim() || '';
					return obj;
				}, {} as Record<string, string>);
			})
			.filter(Boolean);
	};

	const handleFile1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setFile1(file);

		try {
			const fileContent = await readFileAsText(file);
			const parsedData = parseCSV(fileContent);
			console.log('File 1 data:', parsedData);
		} catch (error) {
			console.error('Error reading file 1:', error);
		}
	};

	const handleFile2Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setFile2(file);

		try {
			const fileContent = await readFileAsText(file);
			const parsedData = parseCSV(fileContent);
			console.log('File 2 data:', JSON.stringify(parsedData));
		} catch (error) {
			console.error('Error reading file 2:', error);
		}
	};

	const handleRunWorkflow = async () => {
		console.log(UTR);

		try {
			// For stashfin workflows, don't send file inputs as they're hardcoded in backend
			const payload = workflow?.workflowType === 'stashfin'
				? { workflowId }
				: { workflowId, utrNumber: UTR, file1, file2 };

			const response = await axios.post("/executions", payload);

			addExecution(response.data);

			toast("Execution has been started", {
				description: (
					<div>
						Ran {workflow ? workflow.name : "workflow"}{" "}
						<TimeAgo date={response.data.createdAt} />
					</div>
				),
				position: "top-center",
				action: {
					label: "View",
					onClick: () => navigate(`/executions/${response.data.id}`),
				},
			});
		} catch (e) {
			console.log(e);
		}

		setIsRunWorkflowDialogOpen(false);
	};

	// For stashfin workflows, show a simplified dialog without inputs
	if (workflow?.workflowType === 'stashfin') {
		return (
			<Dialog
				open={isRunWorkflowDialogOpen}
				onOpenChange={setIsRunWorkflowDialogOpen}
			>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Run Stashfin Workflow</DialogTitle>
						<DialogDescription>
							This workflow will run with pre-configured S3 buckets and settings. Click run when you're ready.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() => setIsRunWorkflowDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button onClick={handleRunWorkflow}>Run</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={isRunWorkflowDialogOpen}
			onOpenChange={setIsRunWorkflowDialogOpen}
		>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Run workflow</DialogTitle>
						<DialogDescription>
							Click run when you&apos;re ready.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="utr-1">UTR Number</Label>
							<Input
								id="utr-1"
								name="utr"
								required
								placeholder="UTR Number"
								value={UTR}
								onChange={(e) => setUTR(e.target.value)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="file1-1">Comparison Sheet</Label>
							<Input
								id="file1-1"
								name="file1"
								type="file"
								onChange={handleFile1Change}
								required
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="file2-1">Expected Sheet</Label>
							<Input
								id="file2-1"
								name="file2"
								type="file"
								onChange={handleFile2Change}
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsRunWorkflowDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button onClick={handleRunWorkflow}>Run</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}

export function CreateWorkflowDialog() {
	const { isCreateDialogOpen, setIsCreateDialogOpen } = useSharedStore();
	const { addWorkflow, projects } = useStore();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [projectId, setProjectId] = useState("");
	const [workflowType, setWorkflowType] = useState<"recon" | "stashfin">("recon");

	// Reset form when dialog opens
	useEffect(() => {
		if (isCreateDialogOpen) {
			setName("");
			setDescription("");
			setProjectId("");
			setWorkflowType("recon");
		}
	}, [isCreateDialogOpen]);

	const handleCreate = async () => {
		console.log(name, description);

		try {
			const response = await axios.post("/workflows", {
				name,
				description,
				projectId,
				workflowType,
			});

			addWorkflow(response.data);
		} catch (e) {
			console.log(e);
		}

		// Reset form
		setName("");
		setDescription("");
		setProjectId("");
		setWorkflowType("recon");
		setIsCreateDialogOpen(false);
	};

	return (
		<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add new workflow</DialogTitle>
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
							<Label htmlFor="project-1">Project</Label>
							<Select
								required
								onValueChange={(value) => setProjectId(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a project" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Projects</SelectLabel>
										{projects.map((project) => {
											return (
												<SelectItem value={project.id}>
													{project.name}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="workflow-type-1">Workflow Type</Label>
							<Select
								required
								value={workflowType}
								onValueChange={(value: "recon" | "stashfin") => setWorkflowType(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select workflow type" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Workflow Types</SelectLabel>
										<SelectItem value="recon">
											Reconciliation
										</SelectItem>
										<SelectItem value="stashfin">
											Stashfin Email Process
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
	const showAddWorkflowButton =
		permissions.includes(PermissionEnum.CREATE_WORKFLOW) ||
		permissions.includes(PermissionEnum.ALL);
	const setQuery = useSharedStore((state) => state.setQuery);
	const setIsCreateDialogOpen = useSharedStore(
		(state) => state.setIsCreateDialogOpen
	);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Filter workflows..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
			{showAddWorkflowButton && (
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						onClick={() => setIsCreateDialogOpen(true)}
					>
						Add Workflow
					</Button>
				</div>
			)}
		</div>
	);
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
	const navigate = useNavigate();
	const { permissions } = useAuthStore();
	const { projects, addExecution, getUser, users } = useStore();
	const { setIsRunWorkflowDialogOpen, setWorkflowId } = useSharedStore();
	const project = projects.find(
		(project) => project.id === workflow.projectId
	);
	const user = useMemo(
		() => getUser(workflow.createdById),
		[workflow.createdById, users]
	);

	const showRunWorkflowButton =
		permissions.includes(PermissionEnum.CREATE_EXECUTION) ||
		permissions.includes(PermissionEnum.ALL);

	const showManageWorkflowButton =
		permissions.includes(PermissionEnum.CREATE_WORKFLOW) ||
		permissions.includes(PermissionEnum.ALL);

	return (
		<div
			data-slot="card"
			className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full overflow-hidden pt-0 "
		>
			<figure className="relative aspect-video w-full">
				<img
					alt={`${workflow.name} - ${workflow.description}`}
					loading="lazy"
					decoding="async"
					data-nimg="fill"
					className="object-cover md:h-full"
					src="https://iili.io/FlSNXGp.png"
					style={{
						position: "absolute",
						height: "100%",
						width: "100%",
						inset: 0,
						color: "transparent",
					}}
				/>
			</figure>
			<div data-slot="card-content" className="px-6 space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-2">
						<span
							data-slot="badge"
							className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
						>
							<FolderIcon className="size-3" />
							{project ? project.name : workflow.projectId}
						</span>
						<span
							data-slot="badge"
							className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden ${workflow.workflowType === 'stashfin'
								? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
								: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
								}`}
						>
							{workflow.workflowType === 'stashfin' ? 'Stashfin Email Process' : 'Reconciliation'}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<Avatar className="size-6">
							<AvatarImage src={user?.avatarSrc} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</div>
				</div>
				<h3 className="text-xl leading-tight font-bold">
					{workflow.name}
				</h3>
				<p className="text-muted-foreground text-sm">
					{workflow.description}
				</p>
				<div className="flex flex-col gap-2">
					<Button
						className="flex-1"
						onClick={() => navigate(`/workflows/${workflow.id}`)}
						variant="outline"
						disabled={!showManageWorkflowButton}
					>
						Manage
					</Button>
					<Button
						className="flex-1"
						onClick={() => {
							setIsRunWorkflowDialogOpen(true);
							setWorkflowId(workflow.id);
						}}
						variant="default"
						disabled={!showRunWorkflowButton}
					>
						Run <PlayIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

function Workflows() {
	const { query } = useSharedStore((state) => state);
	const { workflows } = useStore();
	const filteredWorkflows = useMemo(() => {
		if (!query || !query.length) return workflows;
		return workflows.filter((workflow) =>
			workflow.name.toLowerCase().includes(query.toLowerCase())
		);
	}, [query, workflows]);

	return (
		<div className="grid  gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
			{filteredWorkflows.map((workflow) => (
				<WorkflowCard key={workflow.id} workflow={workflow} />
			))}
		</div>
	);
}

function WorkflowPage() {
	const { setWorkflows } = useStore();

	//Todo: Move these to client
	const fetchWorkflows = async () => {
		const response = await axios.get("/workflows");
		return response.data;
	};

	const loadWorkflows = async () => {
		const workflows = await fetchWorkflows();
		setWorkflows(workflows);
	};

	useEffect(() => {
		loadWorkflows();
	}, []);

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Workflows
						</h2>
						<p className="text-muted-foreground">
							View your workflows or create one.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<RunWorkflowDialog />
					<CreateWorkflowDialog />
					<Toolbar />
					<Workflows />
				</div>
			</div>
		</>
	);
}

export default WorkflowPage;

import { useCallback, useEffect, useMemo } from "react";
import ApiClient from "../utils/api/client";
import { PermissionEnum, useStore, type Project, useAuthStore } from "@/store";

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

import { ProjectVisibility } from "@/utils/api/resources/ProjectResource";
import { RefreshCw, ChevronDown, Package, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { CommandEmpty, Command } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import { CommandItem } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type SharedStore = {
	editingGroupId: string | null;
	isCreateDialogOpen: boolean;
	query: string;
	setIsCreateDialogOpen: (isOpen: boolean) => void;
	setQuery: (q: string) => void;
	setEditingGroupId: (id: string | null) => void;
};

const useSharedStore = create<SharedStore>((set) => ({
	isCreateDialogOpen: false,
	query: "",
	editingGroupId: null,
	setIsCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
	setQuery: (q) => set({ query: q }),
	setEditingGroupId: (id) => set({ editingGroupId: id }),
}));

const permissions = [
	{
		name: "Allow all permissions",
		description:
			"Allows all permissions for the users that are in this group.",
		value: PermissionEnum.ALL,
	},
	{
		name: "View projects",
		description: "Allows the users to view projects.",
		value: PermissionEnum.VIEW_PROJECT,
	},
	{
		name: "Create new projects",
		description: "Allows the users to create new projects.",
		value: PermissionEnum.WRITE_PROJECT,
	},
	{
		name: "Create new workflows",
		description: "Allows the users to create new workflows.",
		value: PermissionEnum.CREATE_WORKFLOW,
	},
	{
		name: "View workflows",
		description: "Allows the users to view workflows.",
		value: PermissionEnum.VIEW_WORKFLOW,
	},
	{
		name: "View executions",
		description: "Allows the users to view executions and logs",
		value: PermissionEnum.VIEW_EXECUTION,
	},
	{
		name: "Create new executions",
		description:
			"Allows the users to run workflows andcreate new executions.",
		value: PermissionEnum.CREATE_EXECUTION,
	},
	{
		name: "Create new users",
		description: "Allows the users to create new users.",
		value: PermissionEnum.CREATE_USERS,
	},
	{
		name: "View users",
		description: "Allows the users to view users.",
		value: PermissionEnum.VIEW_USERS,
	},
];

function ManageGroupDialog() {
	const { editingGroupId, setEditingGroupId } = useSharedStore();
	const { groups, addGroup, updateGroup } = useStore();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [checkedPermissions, setCheckedPermissions] = useState<
		PermissionEnum[]
	>([]);

	const group = useMemo(() => {
		return groups.find((group) => group.id === editingGroupId);
	}, [editingGroupId, groups]);

	useEffect(() => {
		if (group) {
			setName(group.name);
			setDescription(group.description);
			setCheckedPermissions(group.permissions);
		}
	}, [group]);

	const handleUpdate = async () => {
		try {
			const response = await axios.put(`/groups/${editingGroupId}`, {
				name,
				description,
				permissions: checkedPermissions,
			});

			updateGroup(response.data.id, response.data);
		} catch (e) {
			console.log(e);
		}

		setEditingGroupId(null);
	};

	return (
		<Dialog open={Boolean(editingGroupId)}>
			<form onSubmit={handleUpdate}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Update group</DialogTitle>
						<DialogDescription>
							You can manage permissions in the next step.
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
							<Label htmlFor="permissions-1">Permissions</Label>
							<div className="flex flex-col gap-6">
								{permissions.map((permission) => {
									const key =
										permission.name +
										permission.value.toString();

									const isChecked =
										checkedPermissions.includes(
											permission.value
										);

									return (
										<div className="flex items-start gap-3">
											<Checkbox
												checked={isChecked}
												onCheckedChange={(checked) => {
													if (checked) {
														setCheckedPermissions([
															...checkedPermissions,
															permission.value,
														]);
													} else {
														setCheckedPermissions(
															checkedPermissions.filter(
																(p) =>
																	p !==
																	permission.value
															)
														);
													}
												}}
												name="permission"
												key={key}
											/>
											<div className="grid gap-2">
												<Label htmlFor={key}>
													{permission.name}
												</Label>
												<p className="text-muted-foreground text-sm">
													{permission.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setEditingGroupId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button onClick={handleUpdate}>Update</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}

function CreateGroupDialog() {
	const { isCreateDialogOpen, setIsCreateDialogOpen } = useSharedStore();
	const { groups, addGroup } = useStore();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [checkedPermissions, setCheckedPermissions] = useState<
		PermissionEnum[]
	>([]);

	const handleCreate = async () => {
		try {
			const response = await axios.post("/groups", {
				name,
				description,
				permissions: checkedPermissions,
			});

			addGroup(response.data);
		} catch (e) {
			console.log(e);
		}

		setIsCreateDialogOpen(false);
	};

	return (
		<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
			<form onSubmit={handleCreate}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Create new group</DialogTitle>
						<DialogDescription>
							You can manage permissions in the next step.
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
							<Label htmlFor="permissions-1">Permissions</Label>
							<div className="flex flex-col gap-6">
								{permissions.map((permission) => {
									const key =
										permission.name +
										permission.value.toString();

									const isChecked =
										checkedPermissions.includes(
											permission.value
										);

									return (
										<div className="flex items-start gap-3">
											<Checkbox
												checked={isChecked}
												onCheckedChange={(checked) => {
													if (checked) {
														setCheckedPermissions([
															...checkedPermissions,
															permission.value,
														]);
													} else {
														setCheckedPermissions(
															checkedPermissions.filter(
																(p) =>
																	p !==
																	permission.value
															)
														);
													}
												}}
												name="permission"
												key={key}
											/>
											<div className="grid gap-2">
												<Label htmlFor={key}>
													{permission.name}
												</Label>
												<p className="text-muted-foreground text-sm">
													{permission.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
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
	const query = useSharedStore((state) => state.query);
	const setQuery = useSharedStore((state) => state.setQuery);
	const setIsCreateDialogOpen = useSharedStore(
		(state) => state.setIsCreateDialogOpen
	);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Search groups..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
			<div className="flex items-center gap-2">
				<Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
					Add New Group
				</Button>
			</div>
		</div>
	);
}

function GroupList() {
	const { permissions } = useAuthStore();
	const { query, setEditingGroupId } = useSharedStore((state) => state);
	const { groups, users } = useStore();
	const filteredGroups = useMemo(() => {
		if (!query || !query.length) return groups;
		return groups.filter((group) =>
			group.name.toLowerCase().includes(query.toLowerCase())
		);
	}, [query, groups]);

	const getUser = useCallback(
		(userId: string) => {
			return users.find((user) => user.id === userId);
		},
		[users]
	);

	const showManageAndCreateGroup =
		permissions.includes(PermissionEnum.ALL) ||
		permissions.includes(PermissionEnum.CREATE_USERS);

	return (
		<div className="grid gap-6">
			{filteredGroups.map((group, index) => (
				<>
					<Separator key={group.id + "separator"} />
					<div
						key={group.id}
						className="flex items-center justify-between gap-4"
					>
						<div className="flex items-center gap-4">
							<div>
								<p className="text-sm leading-none font-medium">
									{group.name}
								</p>
								<p className="text-muted-foreground text-sm">
									{group.description}
								</p>
							</div>
							<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
								{users
									.filter((user) => user.groupId === group.id)
									.map((user) => (
										<Avatar>
											<AvatarImage
												src={user.avatarSrc}
												alt={user.name}
											/>
											<AvatarFallback>
												{user.name.slice(2)}
											</AvatarFallback>
										</Avatar>
									))}
							</div>
						</div>
						{showManageAndCreateGroup && (
							<Button
								onClick={() => setEditingGroupId(group.id)}
								variant="outline"
							>
								Manage
							</Button>
						)}
					</div>
				</>
			))}
		</div>
	);
}

function ManageGroupPage() {
	const { groups } = useStore();

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Groups
						</h2>
						<p className="text-muted-foreground">
							Manage user groups.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<ManageGroupDialog />
					<CreateGroupDialog />
					<Toolbar />
					<GroupList />
				</div>
			</div>
		</>
	);
}

export default ManageGroupPage;

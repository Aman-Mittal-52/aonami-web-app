import { useCallback, useEffect, useMemo } from "react";
import ApiClient from "../utils/api/client";
import { PermissionEnum, useAuthStore, useStore, type Project } from "../store";

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
import { RefreshCw, ChevronDown, UserPen } from "lucide-react";
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

type SharedStore = {
	editingUserId: string | null;
	isCreateDialogOpen: boolean;
	query: string;
	setIsCreateDialogOpen: (isOpen: boolean) => void;
	setQuery: (q: string) => void;
	setEditingUserId: (id: string | null) => void;
};

const useSharedStore = create<SharedStore>((set) => ({
	isCreateDialogOpen: false,
	query: "",
	setIsCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
	setQuery: (q) => set({ query: q }),
	editingUserId: null,
	setEditingUserId: (id) => set({ editingUserId: id }),
}));

function EditUserDialog() {
	const { editingUserId, setEditingUserId } = useSharedStore();
	const { users, groups, updateUser } = useStore();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [groupId, setGroupId] = useState<string | null>(null);

	const user = useMemo(() => {
		return users.find((user) => user.id === editingUserId);
	}, [editingUserId, users]);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setGroupId(user.groupId);
		}
	}, [user]);

	const handleUpdate = async () => {
		try {
			const response = await axios.put(`/users/${editingUserId}`, {
				name,
				email,
				password,
				groupId,
			});

			updateUser(response.data.id, response.data);
		} catch (e) {
			console.log(e);
		}

		setEditingUserId(null);
	};

	return (
		<Dialog open={Boolean(editingUserId)}>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Update user</DialogTitle>
						<DialogDescription>
							Click update when you&apos;re ready.
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
							<Label htmlFor="email-1">Email</Label>
							<Input
								id="email-1"
								name="email"
								required
								placeholder="Email"
								value={email}
								type="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="group-1">Group</Label>
							<Select
								required
								onValueChange={(value) => setGroupId(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a group" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Groups</SelectLabel>
										{groups.map((group) => (
											<SelectItem
												key={group.id}
												value={group.id}
											>
												{group.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password-1">Password</Label>
							<Input
								id="password-1"
								name="password"
								required
								placeholder="Password"
								value={password}
								type="password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setEditingUserId(null)}
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

function CreateUserDialog() {
	const { isCreateDialogOpen, setIsCreateDialogOpen } = useSharedStore();
	const { addUser, groups } = useStore();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [groupId, setGroupId] = useState<string | null>(null);

	const handleCreate = async () => {
		try {
			const response = await axios.post("/users", {
				name,
				email,
				password,
				groupId,
			});

			addUser(response.data);
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
						<DialogTitle>Add new user</DialogTitle>
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
							<Label htmlFor="email-1">Email</Label>
							<Input
								id="email-1"
								name="email"
								required
								placeholder="Email"
								value={email}
								type="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="group-1">Group</Label>
							<Select
								required
								onValueChange={(value) => setGroupId(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a group" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Groups</SelectLabel>
										{groups.map((group) => (
											<SelectItem
												key={group.id}
												value={group.id}
											>
												{group.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="password-1">Password</Label>
							<Input
								id="password-1"
								name="password"
								required
								placeholder="Password"
								value={password}
								type="password"
								onChange={(e) => setPassword(e.target.value)}
							/>
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
	const showInviteUserButton =
		permissions.includes(PermissionEnum.ALL) ||
		permissions.includes(PermissionEnum.CREATE_USERS);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Search users..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
			<div className="flex items-center gap-2">
				{showInviteUserButton && (
					<Button
						size="sm"
						onClick={() => setIsCreateDialogOpen(true)}
					>
						Invite User
					</Button>
				)}
			</div>
		</div>
	);
}

function TeamMembers() {
	const { query, setEditingUserId, editingUserId } = useSharedStore(
		(state) => state
	);
	const { id } = useAuthStore((state) => state);
	const { users, groups, updateUser } = useStore();
	const { permissions } = useAuthStore();

	const showEditUserButton =
		permissions.includes(PermissionEnum.ALL) ||
		permissions.includes(PermissionEnum.CREATE_USERS);

	const filteredUsers = useMemo(() => {
		if (!query || !query.length) return users;
		return users.filter((user) =>
			user.name.toLowerCase().includes(query.toLowerCase())
		);
	}, [query, users]);

	const getGroup = useCallback(
		(groupId: string) => {
			return groups.find((group) => group.id === groupId);
		},
		[groups]
	);

	const updateUserGroup = useCallback(
		async (userId: string, groupId: string) => {
			await axios.put(`/users/${userId}`, {
				groupId,
			});
			updateUser(userId, {
				groupId,
			});
		},
		[users]
	);

	return (
		<div className="grid gap-6">
			{filteredUsers.map((user) => (
				<div
					key={user.name}
					className="flex items-center justify-between gap-4"
				>
					<div className="flex items-center gap-4">
						<Avatar className="border">
							<AvatarImage src={user.avatarSrc} alt="Image" />
							<AvatarFallback>
								{user.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-0.5">
							<p className="text-sm leading-none font-medium">
								{user.name}{" "}
								{!user.lastLoggedInAt && (
									<Badge
										className="px-1.5 py-px ml-1 text-xs"
										variant="default"
									>
										Invited
									</Badge>
								)}
							</p>
							<p className="text-muted-foreground text-xs">
								{user.email}
							</p>
						</div>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								disabled={user.id === id || !showEditUserButton}
								variant="outline"
								size="sm"
								className="ml-auto shadow-none"
							>
								{getGroup(user.groupId)?.name} <ChevronDown />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0" align="end">
							<Command>
								<CommandInput placeholder="Select role..." />
								<CommandList>
									<CommandEmpty>No roles found.</CommandEmpty>
									<CommandGroup>
										{groups.map((group) => (
											<CommandItem
												onSelect={() =>
													updateUserGroup(
														user.id,
														group.id
													)
												}
												key={group.name}
											>
												<div className="flex flex-col">
													<p className="text-sm font-medium">
														{group.name}
													</p>
													<p className="text-muted-foreground">
														{group.description}
													</p>
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<Button
						disabled={!showEditUserButton}
						onClick={() => setEditingUserId(user.id)}
						variant="outline"
						size="sm"
					>
						<UserPen className="size-4" />
						Edit
					</Button>
				</div>
			))}
		</div>
	);
}

function ManagerUserPage() {
	const { users, groups } = useStore();

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Team Members
						</h2>
						<p className="text-muted-foreground">
							Invite your team members to collaborate.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<EditUserDialog />
					<CreateUserDialog />
					<Toolbar />
					<TeamMembers />
				</div>
			</div>
		</>
	);
}

export default ManagerUserPage;

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
	ExecutionStatus,
} from "@/store.ts";
import { DataTable } from "../ExecutionPage/data-table";

("use client");

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { TimerIcon } from "lucide-react";
import axios from "axios";

export const columns: ColumnDef<Task>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		cell: ({ row }) => <div>{row.getValue("id")}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "message",
		cell: ({ row }) => {
			return (
				<div className="flex gap-2">
					<span className="max-w-[500px] truncate font-medium">
						{row.getValue("message")}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		cell: ({ row }) => {
			return (
				<div className="flex w-[100px] items-center gap-2">
					<TimerIcon className="text-muted-foreground size-4" />
					<span>Pending</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { updateExecution } = useStore();
			const { id, status, remark, remarkAcknowledged } = row.original;

			const handleMarkAcknowledged = async () => {
				const response = await axios.put(`/executions/${id}`, {
					status: ExecutionStatus.COMPLETED,
					remarkAcknowledged: true,
				});
				updateExecution(id, response.data);
			};

			return (
				<div className="flex gap-2">
					<Button
						onClick={handleMarkAcknowledged}
						variant="outline"
						size="sm"
					>
						Finish
					</Button>
					<Button
						onClick={handleMarkAcknowledged}
						variant="destructive"
						size="sm"
					>
						Reject
					</Button>
				</div>
			);
		},
	},
];

interface SharedStore {
	isCreateDialogOpen: boolean;
	query: string;
	setQuery: (q: string) => void;
	setIsCreateDialogOpen: (isOpen: boolean) => void;
}

export const useSharedStore = create<SharedStore>((set) => ({
	isCreateDialogOpen: false,
	query: "",
	setQuery: (q) => set({ query: q }),
	setIsCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
}));

function Toolbar() {
	const query = useSharedStore((state) => state.query);
	const setQuery = useSharedStore((state) => state.setQuery);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					placeholder="Filter tasks..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
		</div>
	);
}

function Tasks() {
	const { query } = useSharedStore((state) => state);
	const { workflows, executions } = useStore();

	console.log(executions);

	const tasks = useMemo(() => {
		return executions
			.filter(
				(execution) =>
					execution.remark?.length && !execution.remarkAcknowledged
			)
			.map((execution) => {
				const workflow = workflows.find(
					(workflow) => workflow.id === execution.workflowId
				);

				return {
					id: execution.id,
					name: workflow?.name,
					message: execution.remark,
					description: workflow?.description,
					createdAt: execution.createdAt,
					status: execution.status,
				};
			});
	}, [executions, workflows]);
	const filteredTasks = useMemo(() => {
		if (!query || !query.length) return tasks;
		return tasks.filter((task) =>
			task.message.toLowerCase().includes(query.toLowerCase())
		);
	}, [query, tasks]);

	return (
		<div className="flex w-full">
			<DataTable data={filteredTasks} columns={columns} />
		</div>
	);
}

function TaskListPage() {
	const { executions, workflows } = useStore();

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Tasks
						</h2>
						<p className="text-muted-foreground">
							View your pending tasks.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<Toolbar />
					<Tasks />
				</div>
			</div>
		</>
	);
}

export default TaskListPage;

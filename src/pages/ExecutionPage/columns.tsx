"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type ColumnDef } from "@tanstack/react-table"
import { CircleCheck, MoreHorizontal } from "lucide-react"
import {ExecutionStatus, type Execution} from "@/store";
import TimeAgo from "react-timeago"
import { Badge } from "@/components/ui/badge"
import { Loader } from "lucide-react"
import { useStore } from "@/store";
import { Link } from "react-router"

export const columns: ColumnDef<Execution>[] = [
    {
        id: "id",
        header: "Key",
        cell: ({ row }) => {
            return <Link to={`/executions/${row.original.id}`} className="text-left font-muted-foreground">{row.original.id}</Link>
        },
    },
  {
    accessorKey: "workflowId",
    header: "Workflow",
    cell: ({ row }) => {
        const workflows = useStore.getState().workflows;
        const workflow = workflows.find(w => w.id === row.original.workflowId);
        return <Link to={`/workflows/${workflow?.id}`} className="text-left font-medium hover:underline">{workflow ? workflow.name : row.original.workflowId}</Link>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === ExecutionStatus.COMPLETED ? (
            <CircleCheck color="#fff" className="fill-green-500 dark:fill-green-400" />
          ) : (
            <Loader />
          )}
          {row.original.status === ExecutionStatus.COMPLETED ? "Completed" : "Running"}
        </Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return <TimeAgo date={row.original.createdAt} />
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      return <TimeAgo date={row.original.updatedAt} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              Copy execution ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View execution</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/workflows/${row.original.workflowId}`}>View workflow</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
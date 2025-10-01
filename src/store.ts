import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProjectVisibility } from "./utils/api/resources/ProjectResource";

interface RecentlyVisited {
	name: string;
	link: string;
}

interface UIState {
	recentlyVisited: RecentlyVisited[];
	setRecentlyVisited: (recentlyVisited: RecentlyVisited[]) => void;
	pushRecentlyVisited: (recentlyVisited: RecentlyVisited) => void;
}

//should be stored in local storage
//Only top 4 items should be stored
//That's it.
export const useUIStore = create<UIState>()(
	persist(
		(set) => ({
			recentlyVisited: [],
			setRecentlyVisited: (recentlyVisited) => set({ recentlyVisited }),
			//only top 4 items should be stored
			pushRecentlyVisited: (recentlyVisitedItem: RecentlyVisited) =>
				set((state) => ({
					recentlyVisited: [
						recentlyVisitedItem,
						...state.recentlyVisited.slice(0, 4),
					],
				})),
		}),
		{
			name: "ui-storage",
		}
	)
);

interface AuthState {
	token: string | null;
	email: string | null;
	id: string | null;
	name: string | null;
	organizationId: string | null;
	permissions: PermissionEnum[];
	login: (data: {
		token: string;
		email: string;
		id: string;
		name: string;
		organizationId: string;
		permissions: PermissionEnum[];
	}) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			email: null,
			id: null,
			name: null,
			organizationId: null,
			permissions: [],
			login: ({ token, email, id, name, organizationId, permissions }) =>
				set({ token, email, id, name, organizationId, permissions }),
			logout: () =>
				set({ token: null, email: null, id: null, name: null }),
		}),
		{
			name: "auth-storage",
		}
	)
);

export interface Workflow {
	id: string;
	name: string;
	description: string;
	workflowType: "recon" | "stashfin";
	createdById: string;
	totalRuns: string;
	avgDurationInSeconds: string;
	createdAt: string;
	updatedAt: string;
}

export enum ExecutionStatus {
	QUEUED = 0,
	RUNNING = 10,
	PAUSED = 20,
	WAITING_FOR_INPUT = 30,
	COMPLETED = 40,
	FAILED = 50,
	CANCELLED = 60,
}

export interface Execution {
	id: string;
	workflowId: string;
	status: ExecutionStatus;
	startedById: string;
	createdAt: string;
	updatedAt: string;
	remark: string;
	remarkAcknowledged: boolean;
}

export interface Project {
	id: string;
	name: string;
	description: string;
	categories: string;
	visibility: ProjectVisibility;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	groupId: string;
	avatarSrc: string | null;
	lastLoggedInAt: string | null;
}

export enum PermissionEnum {
	ALL = 1,
	VIEW_PROJECT = 200,
	WRITE_PROJECT = 299,
	VIEW_WORKFLOW = 500,
	CREATE_WORKFLOW = 599,
	VIEW_EXECUTION = 400,
	CREATE_EXECUTION = 499,
	VIEW_USERS = 300,
	CREATE_USERS = 399,
}

export interface Group {
	id: string;
	name: string;
	description: string;
	permissions: PermissionEnum[];
	createdAt: string;
	updatedAt: string;
}

interface StoreState {
	users: User[];
	workflows: Workflow[];
	projects: Project[];
	groups: Group[];
	addUser: (user: User) => void;
	setGroups: (groups: Group[]) => void;
	setUsers: (users: User[]) => void;
	setProjects: (projects: Project[]) => void;
	addProject: (project: Project) => void;
	removeProjectById: (id: string) => void;
	updateProject: (id: string, update: Partial<Project>) => void;
	setWorkflows: (workflows: Workflow[]) => void;
	addWorkflow: (workflow: Workflow) => void;
	removeWorkflowById: (id: string) => void;
	updateWorkflow: (id: string, update: Partial<Workflow>) => void;
	executions: Execution[];
	setExecutions: (executions: Execution[]) => void;
	addExecution: (execution: Execution) => void;
	removeExecutionById: (id: string) => void;
	updateExecution: (id: string, update: Partial<Execution>) => void;
	getWorkflow: (id: string) => Workflow | undefined;
	getUser: (id: string) => User | undefined;
	getProject: (id: string) => Project | undefined;
	getExecution: (id: string) => Execution | undefined;
	updateUser: (id: string, update: Partial<User>) => void;
	addGroup: (group: Group) => void;
	updateGroup: (id: string, update: Partial<Group>) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
	users: [],
	setUsers: (users) => set({ users }),
	addUser: (user) => set((state) => ({ users: [...state.users, user] })),
	projects: [],
	groups: [],
	addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
	updateGroup: (id, update) =>
		set((state) => ({
			groups: state.groups.map((group) =>
				group.id === id ? { ...group, ...update } : group
			),
		})),
	updateUser: (id, update) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.id === id ? { ...user, ...update } : user
			),
		})),
	setGroups: (groups) => set({ groups }),
	getUser: (id) => get().users.find((user) => user.id === id),
	setProjects: (projects) => set({ projects }),
	addProject: (project) =>
		set((state) => ({ projects: [...state.projects, project] })),
	removeProjectById: (id) =>
		set((state) => ({
			projects: state.projects.filter((project) => project.id !== id),
		})),
	updateProject: (id, update) =>
		set((state) => ({
			projects: state.projects.map((project) =>
				project.id === id ? { ...project, ...update } : project
			),
		})),
	workflows: [],
	setWorkflows: (workflows) => set({ workflows }),
	addWorkflow: (workflow) =>
		set((state) => ({ workflows: [...state.workflows, workflow] })),
	removeWorkflowById: (id) =>
		set((state) => ({
			workflows: state.workflows.filter((workflow) => workflow.id !== id),
		})),
	executions: [],
	updateWorkflow: (id, update) =>
		set((state) => ({
			workflows: state.workflows.map((workflow) =>
				workflow.id === id ? { ...workflow, ...update } : workflow
			),
		})),
	updateExecution: (id, update) =>
		set((state) => ({
			executions: state.executions.map((execution) =>
				execution.id === id ? { ...execution, ...update } : execution
			),
		})),
	setExecutions: (executions) => set({ executions }),
	addExecution: (execution) =>
		set((state) => ({ executions: [...state.executions, execution] })),
	removeExecutionById: (id) =>
		set((state) => ({
			executions: state.executions.filter(
				(execution) => execution.id !== id
			),
		})),
	getProject: (id) => get().projects.find((project) => project.id === id),
	getExecution: (id) =>
		get().executions.find((execution) => execution.id === id),
	getWorkflow: (id) => get().workflows.find((workflow) => workflow.id === id),
}));

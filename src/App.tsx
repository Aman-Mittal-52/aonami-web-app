import { PermissionEnum, useAuthStore } from "@/store";
import axios from "axios";
import { Routes, Route } from "react-router";
import { useEffect } from "react";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectPage from "@/pages/ProjectPage";
import Layout from "@/pages/Layout";
import WorkflowPage from "@/pages/WorkflowPage";
import ExecutionPage from "@/pages/ExecutionPage/ExecutionPage";
import ExecutionDetailPage from "@/pages/ExecutionDetailPage/ExecutionDetailPage";
import { useInitialize } from "./hooks/use-initialize";
import WorkflowEditorPage from "@/pages/WorkflowEditorPage/WorkflowEditorPage";
import ManagerUserPage from "./pages/ManagerUserPage";
import ManagerGroupPage from "./pages/ManagerGroupPage";
import AccessDeniedPage from "@/pages/AccessDeniedPage";
import AccessControl from "@/pages/AccessControl";
import TaskListPage from "./pages/TaskList/TaskList";
import NotFound from "@/pages/NotFound";
import Canvas from "./pages/canvas";

// Configure axios base URL
const isProd = import.meta.env?.PROD || false;
axios.defaults.baseURL = isProd
	? "https://api.aonamitech.com"
	: "http://52.66.218.50/api";

console.log(
	`%c Running! ${isProd ? "PROD" : "DEV"} `,
	"background: #222; color: #bada55"
);
console.log(
	`%c API: ${axios.defaults.baseURL} `,
	"background: #222; color: #bada55"
);

function App() {
	const { token } = useAuthStore();

	// Set authorization header when token changes
	useEffect(() => {
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			axios.defaults.headers.common["Authorization"] = null;
		}
	}, [token]);

	if (!token) {
		return <LoginPage />;
	}

	return <ProtectedApp />;
}

// We create a new component that runs inside the token-protected area.
function ProtectedApp() {
	useInitialize();

	//Todo: Add permission for dashboard and have permission nesting.
	//A user should have read permission for a resource if he is able to write
	//to that resource.
	const routes = [
		{
			path: "/",
			element: <DashboardPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.WRITE_PROJECT,
				PermissionEnum.VIEW_PROJECT,
				PermissionEnum.CREATE_WORKFLOW,
				PermissionEnum.VIEW_WORKFLOW,
				PermissionEnum.CREATE_EXECUTION,
				PermissionEnum.VIEW_EXECUTION,
				PermissionEnum.CREATE_USERS,
				PermissionEnum.VIEW_USERS,
			],
		},
		{
			path: "/projects",
			element: <ProjectPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.WRITE_PROJECT,
				PermissionEnum.VIEW_PROJECT,
			],
		},
		{
			path: "/workflows",
			element: <WorkflowPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_WORKFLOW,
				PermissionEnum.VIEW_WORKFLOW,
			],
		},
		{
			path: "/workflows/:workflowId",
			element: <WorkflowEditorPage />,
			permissions: [PermissionEnum.ALL, PermissionEnum.CREATE_WORKFLOW],
		},
		{
			path: "/executions",
			element: <ExecutionPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.VIEW_EXECUTION,
				PermissionEnum.CREATE_EXECUTION,
			],
		},
		{
			path: "/executions/:executionId",
			element: <ExecutionDetailPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_EXECUTION,
				PermissionEnum.VIEW_EXECUTION,
			],
		},
		{
			path: "/users",
			element: <ManagerUserPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_USERS,
				PermissionEnum.VIEW_USERS,
			],
		},
		{
			path: "/groups",
			element: <ManagerGroupPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_USERS,
				PermissionEnum.VIEW_USERS,
			],
		},
		{
			path: "/tasks",
			element: <TaskListPage />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_USERS,
				PermissionEnum.VIEW_USERS,
				PermissionEnum.CREATE_EXECUTION,
				PermissionEnum.VIEW_EXECUTION,
			],
		},
		{
			path: "/canvas",
			element: <Canvas />,
			permissions: [
				PermissionEnum.ALL,
				PermissionEnum.CREATE_USERS,
				PermissionEnum.VIEW_USERS,
				PermissionEnum.CREATE_EXECUTION,
				PermissionEnum.VIEW_EXECUTION,
			],
		},
	];

	return (
		<Layout>

			<Routes>
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={
								<AccessControl permissions={route.permissions}>
									{route.element}
								</AccessControl>
						}
						/>
					))}
					<Route path="*" element={<NotFound />} />
			</Routes>
		</Layout>
	);
}

export default App;


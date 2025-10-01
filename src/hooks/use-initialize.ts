import { useAuthStore, useStore } from "@/store";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function useInitialize() {
	const { token, clear } = useAuthStore();
	const { setProjects, setWorkflows, setExecutions, setUsers, setGroups } =
		useStore();
	const navigate = useNavigate();

	const handleUnauthorized = () => {
		clear();
		navigate("/login");
	};

	const loadProjects = async () => {
		try {
			const response = await axios.get("/projects");
			setProjects(response.data);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				handleUnauthorized();
			}
		}
	};

	const loadWorkflows = async () => {
		try {
			const response = await axios.get("/workflows");
			setWorkflows(response.data);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				handleUnauthorized();
			}
		}
	};

	const loadExecutions = async () => {
		try {
			const response = await axios.get("/executions");
			setExecutions(response.data);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				handleUnauthorized();
			}
		}
	};

	const loadUsers = async () => {
		try {
			const response = await axios.get("/users");
			setUsers(response.data);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				handleUnauthorized();
			}
		}
	};

	const loadGroups = async () => {
		try {
			const response = await axios.get("/groups");
			setGroups(response.data);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				handleUnauthorized();
			}
		}
	};

	useEffect(() => {
		if (!token) return;
		loadProjects();
		loadWorkflows();
		loadExecutions();
		loadUsers();
		loadGroups();
	}, [token]);
}

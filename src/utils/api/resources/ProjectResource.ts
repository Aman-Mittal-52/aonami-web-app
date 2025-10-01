import axios from "axios";

export enum ProjectVisibility {
    PRIVATE = 1,
    TEAM = 5,
}

interface ProjectResponse {
    id: string;
    name: string;
    description: string;
    organizationId: string;
    createdById: string;
    workflowCount: number;
    categories: string;
    visibility: ProjectVisibility;
    createdAt: string;
    updatedAt: string;
}

const ProjectResource = {
    getAll: async () => {
        const response = await axios.get<ProjectResponse[]>('/projects');
        return response.data;
    },
    getOne: async (id: string) => {
        const response = await axios.get<ProjectResponse>(`/projects/${id}`);
        return response.data;
    },
    create: async (project: Pick<ProjectResponse, 'name' | 'description' | 'categories' | 'visibility'>) => {
        const response = await axios.post<ProjectResponse>('/projects', project);
        return response.data;
    }
}
export default ProjectResource;
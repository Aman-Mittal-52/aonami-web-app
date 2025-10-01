import { useLocation, useParams } from "react-router";
import { useStore, type Workflow } from "@/store.ts";
import Editor from "./Editor.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import EditorSidebar from "./EditorSidebar.tsx";

function WorkflowEditorPage() {
	console.log(location.pathname);
	const { workflowId } = useParams();
	//Todo: Move these to client

	return (
		<div className="flex flex-row grow relative border rounded-xl overflow-hidden">
			<ReactFlowProvider>
				<Editor />
				<EditorSidebar workflowId={workflowId} />
			</ReactFlowProvider>
		</div>
	);
}

export default WorkflowEditorPage;

import {
	ReactFlow,
	addEdge,
	Background,
	Controls,
	useNodesState,
	useEdgesState,
	MiniMap,
	ReactFlowProvider,
	type Connection,
	type Edge,
	type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PanelLeft, UploadCloud, Mail } from "lucide-react";
import { Card } from "@/components/ui/card"; // Shadcn card
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
	// You can define custom node components later here if needed
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeOptions = [
	{
		type: "api",
		label: "File Upload",
		description: "Uploads the input files to upstream",
		icon: <UploadCloud className="w-4 h-4 mr-2" />,
	},
	{
		type: "action",
		label: "Send Email",
		description: "Sends an email to the recipient",
		icon: <Mail className="w-4 h-4 mr-2" />,
	},
	{
		type: "trigger",
		label: "Receive Email",
		description: "Looks for all incoming emails",
		icon: <Mail className="w-4 h-4 mr-2" />,
	},
];

export function RightPanel({ data }: { data: Node }) {
	return (
		<div className="w-1/4 bg-muted p-4 border-r space-y-4">
			{nodeOptions.map((node) => (
				<div
					draggable
					onDragStart={(event) => {
						event.dataTransfer.setData(
							"application/reactflow",
							node.type
						);
						event.dataTransfer.effectAllowed = "move";
					}}
					className="bg-background relative flex items-center justify-center rounded-xl shadow-xs xl:col-start-10 xl:col-end-24 row-span-3 lg:row-start-1 lg:col-start-4 lg:col-end-20 col-start-2 col-end-16 row-start-1 rounded-tl-xl rounded-tr-xl rounded-b-xl workflows-hero-card"
				>
					<div className="bg-primary-background relative h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-[11px] p-[11px] rounded-tl-none rounded-tr-[11px] rounded-b-[11px]">
						<div className="border-subtle-stroke flex gap-x-1.5 border-b pb-[11px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={20}
								height={20}
								fill="none"
								viewBox="0 0 22 22"
							>
								<rect
									width={20}
									height={20}
									x={1}
									y={1}
									fill="#E5EEFF"
									rx={6}
								/>
								<path
									stroke="#407FF2"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.5 9v4c0 1.2 0 1.7.2 2.2.2.3.5.6.9.8.4.3 1 .3 2.1.3h2.6c1.1 0 1.7 0 2.1-.3.4-.2.7-.5.9-.8.2-.5.2-1 .2-2.1V8.8v0c0-1 0-1.4-.2-1.8a2 2 0 0 0-1-1.1 5 5 0 0 0-1.8-.1H9.7c-1.1 0-1.7 0-2.1.2a2 2 0 0 0-.9.8c-.2.5-.2 1-.2 2.2h0Z"
								/>
								<path
									stroke="#407FF2"
									strokeLinecap="round"
									d="M11 7.2v.9M11 12.4v.8M9.5 12.4h2.2c.3 0 .6-.1.8-.3.2-.2.4-.5.4-.8a1 1 0 0 0-.4-.8c-.2-.2-.5-.3-.8-.3h-1.4c-.3 0-.6 0-.8-.3a1 1 0 0 1-.4-.7c0-.3.2-.6.4-.8.2-.2.5-.3.8-.3h2.2"
								/>
								<path stroke="#407FF2" d="M6.5 14.7h9" />
								<rect
									width={20}
									height={20}
									x={1}
									y={1}
									stroke="#D6E5FF"
									rx={6}
								/>
							</svg>
							<span className="text-dark-foreground text-dark flex-1 truncate text-sm tracking-[-0.3px]">
								{node.label}
							</span>
							<Badge variant="outline">{node.type}</Badge>
						</div>
						<p className="text-stone-600 mt-2 truncate text-xs">
							{node.description}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

export default function Editor() {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback(
		(params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
		[]
	);

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();

			const type = event.dataTransfer.getData("application/reactflow");
			if (!type || !reactFlowWrapper.current) return;

			const bounds = (
				reactFlowWrapper.current as HTMLDivElement
			).getBoundingClientRect();
			const position = {
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top,
			};

			const newNode: Node = {
				id: `${type}-${Date.now()}`,
				type: "default",
				position,
				data: { label: type },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[setNodes]
	);

	const onDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	return (
		<div className="flex-1 h-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onDrop={handleDrop}
				onDragOver={onDragOver}
				fitView
				nodeTypes={nodeTypes}
			>
				{/* <MiniMap /> */}
				<Controls />
				<Background />
			</ReactFlow>
		</div>
	);
}

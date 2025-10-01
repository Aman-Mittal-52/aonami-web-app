import {
	CommandInput,
	CommandSeparator,
	Command,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useStore } from "@/store";
import {
	Calendar,
	Smile,
	Calculator,
	User,
	Settings,
	CreditCard,
	Mail,
	Upload,
	Filter,
	Slack,
	Webhook,
	FilterIcon,
} from "lucide-react";
import { create } from "zustand";

interface SharedState {
	query: string;
	setQuery: (query: string) => void;
}

const useSharedState = create<SharedState>((set) => ({
	query: "",
	setQuery: (query) => set({ query }),
}));

enum BlockCategory {
	TRIGGER = "trigger",
	UTILITIES = "utilities",
	CONDITIONS = "conditions",
}

const blocksByCategory = {
	triggers: [
		{
			id: "email-trigger",
			category: BlockCategory.TRIGGER,
			name: "Receive Email",
			description: "Trigger a workflow when an email is received",
			icon: Mail,
		},
		{
			id: "manual-upload-trigger",
			category: BlockCategory.TRIGGER,
			name: "Manual Upload",
			description: "Trigger a workflow when a file is uploaded",
			icon: Upload,
		},
		{
			id: "webhook-trigger",
			category: BlockCategory.TRIGGER,
			name: "Webhook",
			description: "Trigger a workflow when a webhook is received",
			icon: Webhook,
		},
	],
	utilities: [
		{
			id: "upload-file",
			category: BlockCategory.UTILITIES,
			name: "Upload file",
			description: "Upload a file to the workflow",
			icon: Upload,
		},
		{
			id: "send-email",
			category: BlockCategory.UTILITIES,
			name: "Send Email",
			description: "Send an email",
			icon: Mail,
		},
		{
			id: "send-slack",
			category: BlockCategory.UTILITIES,
			name: "Send Slack",
			description: "Send a Slack message",
			icon: Slack,
		},
	],
	conditions: [
		{
			id: "filter",
			category: BlockCategory.CONDITIONS,
			name: "Filter",
			description: "Filter a list of items",
			icon: Filter,
		},
		{
			id: "if-else",
			category: BlockCategory.CONDITIONS,
			name: "If-Else",
			description: "If-Else a list of items",
			icon: Filter,
		},
		{
			id: "switch",
			category: BlockCategory.CONDITIONS,
			name: "Switch",
			description: "Switch a list of items",
			icon: Filter,
		},
	],
};

function Blocks() {
	const categories = Object.keys(blocksByCategory);

	return (
		<div className="flex flex-col gap-[16px]">
			{categories.map((category) => (
				<BlockCategoryBox key={category} category={category} />
			))}
		</div>
	);
}

function BlockCategoryBox({ category }: { category: string }) {
	const query = useSharedState((state) => state.query);

	const blocks = blocksByCategory[category];
	const filteredBlocks = blocks.filter((block) =>
		block.name.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="flex flex-col items-stretch justify-start gap-[8px] w-full">
			<p className="text-xs  text-muted-foreground text-sm capitalize font-medium">
				{category}
			</p>
			{filteredBlocks.map((block) => (
				<div
					className="cursor-pointer block bg-background border transition-[background-color] duration-[0.1s] ease-[ease-in-out] p-0 rounded-xl"
					key={block.id}
				>
					<div className="flex flex-row items-center justify-start gap-2 w-full h-10 px-2">
						<div className="bg-background h-[26px] w-[26px] shrink-0 overflow-hidden flex flex-col items-center justify-center gap-1 rounded-md">
							<block.icon size={16} />
						</div>
						<p className="text-sm font-medium">{block.name}</p>
					</div>
				</div>
			))}
		</div>
	);
}

export default function EditorSidebar({ workflowId }: { workflowId: string }) {
	const { query, setQuery } = useSharedState();
	const workflow = useStore((state) =>
		state.workflows.find((w) => w.id === workflowId)
	);

	return (
		<div className="bg-sidebar h-full w-auto p-4 flex flex-col">
			<header>
				<p className="text-sm font-medium">{workflow?.name}</p>
				<span className="text-sm font-medium text-muted-foreground">
					{workflow?.description || "Write a description..."}
				</span>
			</header>
			<Separator className="my-4" />
			<div className="flex flex-col gap-4">
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search blocks..."
				/>
				<Blocks />
			</div>
		</div>
	);
}

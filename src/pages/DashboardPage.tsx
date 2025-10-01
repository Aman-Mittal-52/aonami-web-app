import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Area } from "recharts";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Workflow } from "lucide-react";
import { AnimatedDashboard } from "@/components/dashboard/animated-dashboard";
import { useNavigate } from "react-router";

const data = [
	{
		durationInSeconds: 14405,
		executions: 50,
		finished: 40,
		errors: 10,
	},
	{
		durationInSeconds: 10400,
		executions: 100,
		finished: 90,
		errors: 10,
	},
	{
		durationInSeconds: 26475,
		executions: 200,
		finished: 190,
		errors: 10,
	},
	{
		durationInSeconds: 11244,
		executions: 300,
		finished: 100,
		errors: 200,
	},
	{
		durationInSeconds: 9400,
		executions: 89,
		finished: 70,
		errors: 19,
	},
	{
		durationInSeconds: 9600,
		executions: 239,
		finished: 220,
		errors: 19,
	},
	{
		durationInSeconds: 8200,
		executions: 78,
		finished: 76,
		errors: 2,
	},
	{
		durationInSeconds: 7000,
		executions: 89,
		finished: 88,
		errors: 1,
	},
];

const totalExecutions = data.reduce((acc, curr) => acc + curr.executions, 0);
const totalFinished = data.reduce((acc, curr) => acc + curr.finished, 0);
const totalErrors = data.reduce((acc, curr) => acc + curr.errors, 0);

console.table({
	totalExecutions,
	totalFinished,
	totalErrors,
	sum: totalFinished + totalErrors,
});

const chartConfig = {
	durationInSeconds: {
		label: "Duration",
		color: "var(--primary)",
	},
	executions: {
		label: "Executions",
		color: "var(--primary)",
	},
	finished: {
		label: "Finished",
		color: "var(--primary)",
	},
	errors: {
		label: "Errors",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export default function DashboardPage() {

	const navigate = useNavigate();
	return (
		<>
			<div className='flex flex-col gap-4'>
				<div
					className="mx-auto hover:bg-background dark:hover:border-t-border bg-muted group  flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
				>
					<span className="text-foreground text-sm"><b>New:</b> Advanced workflow templates & AI agents available!</span>
					<span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

					<div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
						<div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
							<span className="flex size-6">
								<ArrowRight className="m-auto size-3" />
							</span>
							<span className="flex size-6">
								<ArrowRight className="m-auto size-3" />
							</span>
						</div>
					</div>
				</div>

				<div className='p-5 '>

					<h1 className='text-2xl font-bold'>Currents</h1>
					<p className='text-muted-foreground'>Build, run, and manage your workflows</p>
					<div className='flex justify-between my-4'>
						<div className='flex flex-col gap-2 justify-end'>
							<p className='text-lg mb-8 mr-6'>Currents is a workflow builder that allows you to build, run, and manage your workflows, all in one place.</p>
							<div className='flex gap-2'>
								<Button className="cursor-not-allowed">Chat with AI <Sparkles /></Button>
								<Button variant="outline" onClick={() => navigate('/canvas')}><Workflow /> Build</Button>
							</div>


						</div>
						<AnimatedDashboard />
					</div>
				</div>




			</div>
			<div className="grid auto-rows-min gap-4 grid-cols-4">
				<Card className="pb-0 lg:hidden xl:flex">
					<CardHeader>
						<CardDescription>Executions</CardDescription>
						<CardTitle className="text-3xl">1,145</CardTitle>
						<CardDescription>
							+16.09% from last week
						</CardDescription>
						<CardAction>
							<Button variant="ghost" size="sm">
								View
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="mt-auto max-h-[124px] flex-1 p-0">
						<ChartContainer
							config={chartConfig}
							className="size-full"
						>
							<AreaChart
								data={data}
								margin={{
									left: 0,
									right: 0,
								}}
							>
								<Area
									dataKey="executions"
									fill="var(--color-executions)"
									fillOpacity={0.05}
									stroke="var(--color-executions)"
									strokeWidth={2}
									type="monotone"
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card className="pb-0 lg:hidden xl:flex">
					<CardHeader>
						<CardDescription>Average Duration</CardDescription>
						<CardTitle className="text-3xl">3m 45s</CardTitle>
						<CardDescription>-40.1% from last week</CardDescription>
						<CardAction>
							<Button variant="ghost" size="sm">
								View
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="mt-auto max-h-[124px] flex-1 p-0">
						<ChartContainer
							config={chartConfig}
							className="size-full"
						>
							<AreaChart
								data={data}
								margin={{
									left: 0,
									right: 0,
								}}
							>
								<Area
									dataKey="durationInSeconds"
									fill="var(--color-durationInSeconds)"
									fillOpacity={0.05}
									stroke="var(--color-durationInSeconds)"
									strokeWidth={2}
									type="monotone"
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card className="pb-0 lg:hidden xl:flex">
					<CardHeader>
						<CardDescription>Finished</CardDescription>
						<CardTitle className="text-3xl">
							{totalFinished}
						</CardTitle>
						<CardDescription>-10.1% from last week</CardDescription>
						<CardAction>
							<Button variant="ghost" size="sm">
								View
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="mt-auto max-h-[124px] flex-1 p-0">
						<ChartContainer
							config={chartConfig}
							className="size-full"
						>
							<AreaChart
								data={data}
								margin={{
									left: 0,
									right: 0,
								}}
							>
								<Area
									dataKey="finished"
									fill="var(--color-finished)"
									fillOpacity={0.05}
									stroke="var(--color-finished)"
									strokeWidth={2}
									type="monotone"
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card className="pb-0 lg:hidden xl:flex">
					<CardHeader>
						<CardDescription>Errors</CardDescription>
						<CardTitle className="text-3xl">
							{totalErrors}
						</CardTitle>
						<CardDescription>-10.1% from last week</CardDescription>
						<CardAction>
							<Button variant="ghost" size="sm">
								View
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="mt-auto max-h-[124px] flex-1 p-0">
						<ChartContainer
							config={chartConfig}
							className="size-full"
						>
							<AreaChart
								data={data}
								margin={{
									left: 0,
									right: 0,
								}}
							>
								<Area
									dataKey="errors"
									fill="var(--color-errors)"
									fillOpacity={0.05}
									stroke="var(--color-errors)"
									strokeWidth={2}
									type="monotone"
								/>
							</AreaChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
			<ChartAreaInteractive />
			<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
		</>
	);
}

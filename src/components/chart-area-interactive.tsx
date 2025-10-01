"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
	{ date: "2024-04-10", success: 222, errors: 150 },
	{ date: "2024-04-11", success: 97, errors: 180 },
	{ date: "2024-04-12", success: 167, errors: 120 },
	{ date: "2024-04-13", success: 242, errors: 260 },
	{ date: "2024-04-14", success: 373, errors: 290 },
	{ date: "2024-04-15", success: 301, errors: 340 },
	{ date: "2024-04-16", success: 245, errors: 180 },
	{ date: "2024-04-17", success: 409, errors: 320 },
	{ date: "2024-04-18", success: 59, errors: 110 },
	{ date: "2024-04-19", success: 261, errors: 190 },
	{ date: "2024-04-20", success: 327, errors: 350 },
	{ date: "2024-04-21", success: 292, errors: 210 },
	{ date: "2024-04-22", success: 342, errors: 380 },
	{ date: "2024-04-23", success: 137, errors: 220 },
	{ date: "2024-04-24", success: 120, errors: 170 },
	{ date: "2024-04-25", success: 138, errors: 190 },
	{ date: "2024-04-26", success: 446, errors: 360 },
	{ date: "2024-04-27", success: 364, errors: 410 },
	{ date: "2024-04-28", success: 243, errors: 180 },
	{ date: "2024-04-29", success: 89, errors: 150 },
	{ date: "2024-04-30", success: 137, errors: 200 },
	{ date: "2024-05-01", success: 224, errors: 170 },
	{ date: "2024-05-02", success: 138, errors: 230 },
	{ date: "2024-05-03", success: 387, errors: 290 },
	{ date: "2024-05-04", success: 215, errors: 250 },
	{ date: "2024-05-05", success: 75, errors: 130 },
	{ date: "2024-05-06", success: 383, errors: 420 },
	{ date: "2024-05-07", success: 122, errors: 180 },
	{ date: "2024-05-08", success: 315, errors: 240 },
	{ date: "2024-05-09", success: 454, errors: 380 },
	{ date: "2024-05-10", success: 165, errors: 220 },
	{ date: "2024-05-11", success: 293, errors: 310 },
	{ date: "2024-05-12", success: 247, errors: 190 },
	{ date: "2024-05-13", success: 385, errors: 420 },
	{ date: "2024-05-14", success: 481, errors: 390 },
	{ date: "2024-05-15", success: 498, errors: 520 },
	{ date: "2024-05-16", success: 388, errors: 300 },
	{ date: "2024-05-17", success: 149, errors: 210 },
	{ date: "2024-05-18", success: 227, errors: 180 },
	{ date: "2024-05-19", success: 293, errors: 330 },
	{ date: "2024-05-20", success: 335, errors: 270 },
	{ date: "2024-05-21", success: 197, errors: 240 },
	{ date: "2024-05-22", success: 197, errors: 160 },
	{ date: "2024-05-23", success: 448, errors: 490 },
	{ date: "2024-05-24", success: 473, errors: 380 },
	{ date: "2024-05-25", success: 338, errors: 400 },
	{ date: "2024-05-26", success: 499, errors: 420 },
	{ date: "2024-05-27", success: 315, errors: 350 },
	{ date: "2024-05-28", success: 235, errors: 180 },
	{ date: "2024-05-29", success: 177, errors: 230 },
	{ date: "2024-05-30", success: 82, errors: 140 },
	{ date: "2024-05-31", success: 81, errors: 120 },
	{ date: "2024-06-01", success: 252, errors: 290 },
	{ date: "2024-06-02", success: 294, errors: 220 },
	{ date: "2024-06-03", success: 201, errors: 250 },
	{ date: "2024-06-04", success: 213, errors: 170 },
	{ date: "2024-06-05", success: 420, errors: 460 },
	{ date: "2024-06-06", success: 233, errors: 190 },
	{ date: "2024-06-07", success: 78, errors: 130 },
	{ date: "2024-06-08", success: 340, errors: 280 },
	{ date: "2024-06-09", success: 178, errors: 230 },
	{ date: "2024-06-10", success: 178, errors: 200 },
	{ date: "2024-06-11", success: 470, errors: 410 },
	{ date: "2024-06-12", success: 103, errors: 160 },
	{ date: "2024-06-13", success: 439, errors: 380 },
	{ date: "2024-06-14", success: 88, errors: 140 },
	{ date: "2024-06-15", success: 294, errors: 250 },
	{ date: "2024-06-16", success: 323, errors: 370 },
	{ date: "2024-06-17", success: 385, errors: 320 },
	{ date: "2024-06-18", success: 438, errors: 480 },
	{ date: "2024-06-19", success: 155, errors: 200 },
	{ date: "2024-06-20", success: 92, errors: 150 },
	{ date: "2024-06-21", success: 492, errors: 420 },
	{ date: "2024-06-22", success: 81, errors: 130 },
	{ date: "2024-06-23", success: 426, errors: 380 },
	{ date: "2024-06-24", success: 307, errors: 350 },
	{ date: "2024-06-25", success: 371, errors: 310 },
	{ date: "2024-06-26", success: 475, errors: 520 },
	{ date: "2024-06-27", success: 107, errors: 170 },
	{ date: "2024-06-28", success: 341, errors: 290 },
	{ date: "2024-06-29", success: 408, errors: 450 },
	{ date: "2024-06-30", success: 169, errors: 210 },
	{ date: "2024-07-01", success: 317, errors: 270 },
	{ date: "2024-07-02", success: 480, errors: 530 },
	{ date: "2024-07-03", success: 132, errors: 180 },
	{ date: "2024-07-04", success: 141, errors: 190 },
	{ date: "2024-07-05", success: 434, errors: 380 },
	{ date: "2024-07-06", success: 448, errors: 490 },
	{ date: "2024-07-07", success: 149, errors: 200 },
	{ date: "2024-07-08", success: 103, errors: 160 },
	{ date: "2024-07-09", success: 446, errors: 400 },
];

const chartConfig = {
	executions: {
		label: "Executions",
	},
	success: {
		label: "Success",
		color: "var(--chart-2)",
	},
	errors: {
		label: "Errors",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function ChartAreaInteractive() {
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState("90d");

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d");
		}
	}, [isMobile]);

	const filteredData = chartData.filter((item) => {
		const date = new Date(item.date);
		const referenceDate = new Date("2024-06-30");
		let daysToSubtract = 90;
		if (timeRange === "30d") {
			daysToSubtract = 30;
		} else if (timeRange === "7d") {
			daysToSubtract = 7;
		}
		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - daysToSubtract);
		return date >= startDate;
	});

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Executions</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">
						Compare for the last 3 months
					</span>
					<span className="@[540px]/card:hidden">Last 3 months</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">
							Last 3 months
						</ToggleGroupItem>
						<ToggleGroupItem value="30d">
							Last 30 days
						</ToggleGroupItem>
						<ToggleGroupItem value="7d">
							Last 7 days
						</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							size="sm"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Last 3 months" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="90d" className="rounded-lg">
								Last 3 months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								Last 30 days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							<linearGradient
								id="fillSuccess"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={chartConfig.success.color}
									stopOpacity={1.0}
								/>
								<stop
									offset="95%"
									stopColor={chartConfig.success.color}
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient
								id="fillErrors"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={chartConfig.errors.color}
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor={chartConfig.errors.color}
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							defaultIndex={isMobile ? -1 : 10}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(
											value
										).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="errors"
							type="natural"
							fill="url(#fillErrors)"
							stroke={chartConfig.errors.color}
							stackId="a"
						/>
						<Area
							dataKey="success"
							type="natural"
							fill="url(#fillSuccess)"
							stroke={chartConfig.success.color}
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

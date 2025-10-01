import { useParams } from "react-router";
import { ExecutionStatus, useStore, type Execution } from "@/store";
import { Button } from "@/components/ui/button";
import { ClockFading, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { getExecutionStatusNameFromEnum } from "@/utils/helpers";
import TimeAgo from "react-timeago";
import "./style.css";

type Log = {
	message: string;
	createdAt: string;
};

const Avatar = ({
	userId,
	createdAt,
}: {
	userId: string;
	createdAt: string;
}) => {
	const { getUser } = useStore();

	const user = getUser(userId);

	return (
		<div className="flex items-center gap-2">
			<span
				data-slot="avatar"
				className="relative flex size-6 shrink-0 overflow-hidden rounded-full border"
			>
				<img
					data-slot="avatar-image"
					className="aspect-square size-full"
					alt="Image"
					src={user?.avatarSrc}
				/>
			</span>
			<p className="flex flex-row gap-2 text-sm leading-none font-sm">
				<span className="text-uppercase">{user?.name}</span>
				<span className="text-muted-foreground">
					<TimeAgo date={new Date(createdAt)} />
				</span>
			</p>
		</div>
	);
};

const LoadingDot = () => {
	return (
		<>
			<span className="loader">
				<span className="loader__dot">.</span>
				<span className="loader__dot">.</span>
				<span className="loader__dot">.</span>
			</span>
		</>
	);
};

const TimeToReady = ({ execution }: { execution: Execution }) => {
	const endDate =
		execution.status === ExecutionStatus.COMPLETED
			? new Date(execution.updatedAt)
			: new Date();

	//mins and seconds
	const totalTime =
		endDate.getTime() - new Date(execution.createdAt).getTime();
	const mins = Math.floor(totalTime / 60000);
	const seconds = Math.floor((totalTime % 60000) / 1000);
	return `${mins}m ${seconds}s`;
};

const ExecutionDetailPage = () => {
	const { executionId } = useParams();
	const { executions, updateExecution } = useStore();

	const execution = executions.find((e) => e.id === executionId);

	const [logs, setLogs] = useState<Log[]>([]);

	const isLoading = useMemo(() => {
		if (!execution) return false;
		if (
			[
				ExecutionStatus.WAITING_FOR_INPUT,
				ExecutionStatus.RUNNING,
				ExecutionStatus.QUEUED,
				ExecutionStatus.RUNNING,
			].includes(execution.status)
		) {
			return true;
		}
		return false;
	}, [execution]);

	useEffect(() => {
		if (!isLoading && execution && logs.length == 0) {
			axios
				.get("/logs", {
					params: {
						executionId: execution.id,
					},
				})
				.then((res) => {
					setLogs(res.data);
				});
		}
		if (!isLoading || !execution) return;
		const interval = setInterval(() => {
			axios
				.get("/logs", {
					params: {
						executionId: execution.id,
					},
				})
				.then((res) => {
					setLogs(res.data);
				});
			axios.get("/executions/" + execution.id).then((res) => {
				updateExecution(execution.id, res.data);
			});
		}, 2500);
		return () => clearInterval(interval);
	}, [isLoading, execution]);

	if (!execution) {
		return <div>Execution not found</div>;
	}

	return (
		<>
			<div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-col gap-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							Execution Details
						</h2>
						<pre className="rounded-md text-muted-foreground">
							{executionId}
						</pre>
					</div>
					<Button variant="outline">
						<RotateCcw className="w-4 h-4" />
						Rerun
					</Button>
				</div>
				<div className="flex flex-col gap-4">
					<Card>
						<CardContent className="flex flex-col gap-4">
							<div className="flex flex-row gap-6">
								<div className="flex-1">
									<img
										className="rounded-md object-cover"
										src="https://iili.io/FlSNXGp.png"
										alt="logo"
									/>
								</div>
								<div className="flex-2 grid grid-cols-2 gap-4 xl:grid-cols-4 [&>div]:flex-[0_1_auto]">
									<div className="flex flex-col gap-1 xl:gap-1.5">
										<p className="text-sm text-muted-foreground font-sm">
											Created
										</p>
										<Avatar
											userId={execution.startedById}
											createdAt={execution.createdAt}
										/>
									</div>
									<div className="flex flex-col gap-1 xl:gap-1.5">
										<p className="text-sm text-muted-foreground font-sm">
											Status
										</p>
										<p className="text-sm">
											{getExecutionStatusNameFromEnum(
												execution?.status
											)}
										</p>
									</div>

									<div className="flex flex-col gap-1 xl:gap-1.5">
										<p className="text-sm text-muted-foreground font-sm">
											Time to Ready
										</p>
										<p className="text-sm flex items-center gap-2">
											<ClockFading className="w-4 h-4" />
											<TimeToReady
												execution={execution}
											/>
										</p>
									</div>
									<div className="flex flex-col gap-1 xl:gap-1.5">
										<p className="text-sm text-muted-foreground font-sm">
											Environment
										</p>
										<p className="text-sm">Production</p>
									</div>
								</div>
							</div>
							<Separator />
							<pre className="bg-muted p-4 rounded-md">
								<code className="text-sm grid">
									{logs.map((log, index) => (
										<span key={index}>
											{log.createdAt} {log.message}
										</span>
									))}
									{isLoading && <LoadingDot />}
								</code>
							</pre>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default ExecutionDetailPage;

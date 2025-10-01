import { ExecutionStatus } from "@/store";

export const getExecutionStatusNameFromEnum = (status: ExecutionStatus): string => {
    switch (status) {
        case ExecutionStatus.RUNNING:
            return "Running";
        case ExecutionStatus.COMPLETED:
            return "Completed";
        case ExecutionStatus.FAILED:
            return "Failed";
        case ExecutionStatus.CANCELLED:
            return "Cancelled";
        case ExecutionStatus.WAITING_FOR_INPUT:
            return "Waiting for Input";
        case ExecutionStatus.PAUSED:
            return "Paused";
        case ExecutionStatus.QUEUED:
            return "Queued";
        default:
            return "Unknown";
    }
}
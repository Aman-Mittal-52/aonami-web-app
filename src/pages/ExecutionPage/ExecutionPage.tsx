import { useCallback, useEffect } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useStore } from "@/store"
import axios from "axios";

function ExecutionPage() {

    const {executions, setExecutions} = useStore();

    const loadExecutions = useCallback(async () => {
        const response = await axios.get("/executions");
        setExecutions(response.data);
    }, [setExecutions]);

    useEffect(() => {
        loadExecutions();
    }, [loadExecutions]);


    return ( <>
        <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Executions
                    </h2>
                    <p className="text-muted-foreground">
                        View all workflows executions.
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
    
            <DataTable columns={columns} data={executions} />
            </div>
        </div>
    </>)
}



export default ExecutionPage;
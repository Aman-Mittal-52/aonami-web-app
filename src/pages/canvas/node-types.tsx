import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Handle, Position } from "@xyflow/react";
import { Pause, Play } from "lucide-react";
import { useCallback } from "react";
import { useState } from "react";

export function StartNode({ data }: { data: { handleStart: (isStarted: boolean) => void, isStarted: boolean } }) {

    const [isStartedInternal, setIsStartedInternal] = useState(false);

    return (
        <Card className="start-node py-2 px-4">
            <div className="flex items-center gap-2">
                Start
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost"><Play className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Start Node</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Button className="w-full" onClick={() => data.handleStart((isStarted) => {
                                setIsStartedInternal(!isStarted);
                                return !isStarted
                            })}>
                                {isStartedInternal ?
                                    <>
                                        Pause
                                        <Pause className="w-4 h-4" />
                                    </>
                                    :
                                    <>
                                        Play
                                        <Play className="w-4 h-4" />
                                    </>
                                }</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Handle type="source" position={Position.Right} />
        </Card>
    );
}


export function CardNode({ data }: { data: { label: string, description: string, position: Position } }) {
    return (
        <div className="relative">
            <Card className="start-node w-64">
                <CardHeader>
                    <CardTitle>{data.label}</CardTitle>
                    <CardDescription>{data.description}</CardDescription>
                </CardHeader>
            </Card>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={data.position} />
        </div>
    );
}

export function FindNode({ data }: { data: { label: string, description: string, position: Position } }) {
    return (
        <div className="relative bg-accent shadow p-3 rounded-xl">
            <div className="start-node w-24">
                <h1 className="text-xs font-semibold">{data.label}</h1>
                <p className="text-xs text-muted-foreground">{data.description}</p>
            </div>
            <Handle type="source" position={Position.Right} id='find-handle'  />
            <Handle type="target" position={data.position} id='find-handle-top'/>
        </div >
    )
}

export const nodeTypes = {
    startNode: StartNode,
    cardNode: CardNode,
    findNode: FindNode,
};
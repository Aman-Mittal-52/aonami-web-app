import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Play } from "lucide-react";
import { useCallback } from "react";

export function StartNode() {
 

    return (
        <HoverCard>
            <HoverCardTrigger>
                <Card className="start-node py-2 px-4">
                    <div className="flex items-center gap-2">
                        Start <Play className="w-4 h-4" />
                    </div>
                </Card>
            </HoverCardTrigger>
            <HoverCardContent>
                Start Node
            </HoverCardContent>
        </HoverCard>
    );
}

export const nodeTypes = {
    startNode: StartNode,
};
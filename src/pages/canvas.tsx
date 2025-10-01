import React, { useCallback, useState } from 'react'
import '@xyflow/react/dist/style.css';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, MiniMap, Background, Panel } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Brain, DollarSign, Eraser, Plus, Settings, SquareMousePointer } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Node, Edge } from '@xyflow/react';
import { nodeTypes } from './canvas/node-types';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const engines = [
  {
    id: 'reconciliation-engine',
    name: 'Reconciliation Engine',
    initNodes: [
      { id: 'start-node', type: 'startNode', position: { x: 0, y: 0 } },
      { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    ],
    initEdges: [{ id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'bezier' }],
  },
  {
    id: 'chargeback-engine',
    name: 'Chargeback Engine',
    initNodes: [
      { id: 'start-node', type: 'startNode', position: { x: 0, y: 0 } },
      { id: 'n2', position: { x: -100, y: 100 }, data: { label: 'Node 2' } },
      { id: 'n3', position: { x: 100, y: 100 }, data: { label: 'Node 3' } },
    ],
    initEdges: [
      { id: 'n1-n2', source: 'n2', target: 'n1', label: 'Edge 1', animated: true, type: 'bezier' },
      { id: 'n2-n3', source: 'n2', target: 'n3', label: 'Edge 2', animated: true, type: 'bezier' },
    ],
  },
  {
    id: 'fraud-detection-engine',
    name: 'Fraud Detection Engine',
    initNodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Fraud Detection Engine' } },
      { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    ],
    initEdges: [{ id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'bezier' }],
  },
  {
    id: 'settlement-engine',
    name: 'Settlement Engine',
    initNodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Settlement Engine' } },
      { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    ],
    initEdges: [{ id: 'n1-n2', source: 'n1', target: 'n2', animated: true, type: 'bezier' }],
  },
];

function Canvas() {

  const [EngineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [showEngineDialog, setShowEngineDialog] = useState(false);
  const [engineName, setEngineName] = useState('');

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


  return (
    <div className="h-[calc(100vh-64px)] w-full border rounded-xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />

        <Panel position="top-left">

          <DropdownMenu open={EngineDropdownOpen} onOpenChange={setEngineDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Engines</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => { setShowEngineDialog(true); setEngineName('Reconciliation Engine'); setEngineDropdownOpen(false) }}><Brain /> Reconciliation Engine</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setShowEngineDialog(true); setEngineName('Chargeback Engine'); setEngineDropdownOpen(false) }}><Brain /> Chargeback Engine</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setShowEngineDialog(true); setEngineName('Fraud detection Engine'); setEngineDropdownOpen(false) }}><Brain /> Fraud detection Engine</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setShowEngineDialog(true); setEngineName('Settlement Engine'); setEngineDropdownOpen(false) }}><Brain /> Settlement Engine</DropdownMenuItem>
              <DropdownMenuItem><Plus /> Add Engine Template</DropdownMenuItem>
              <DropdownMenuItem><DollarSign /> Buy Engine Template</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showEngineDialog} onOpenChange={setShowEngineDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Open {engineName}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {

                    switch (engineName) {
                      case 'Reconciliation Engine':
                        setNodes(engines[0].initNodes);
                        setEdges(engines[0].initEdges);
                        break;
                      case 'Chargeback Engine':
                        setNodes(engines[1].initNodes);
                        setEdges(engines[1].initEdges);
                        break;
                      case 'Fraud detection Engine':
                        setNodes(engines[2].initNodes);
                        setEdges(engines[2].initEdges);
                        break;
                      case 'Settlement Engine':
                        setNodes(engines[3].initNodes);
                        setEdges(engines[3].initEdges);
                        break;
                      default:
                        break;
                    }

                    setShowEngineDialog(false);
                    setEngineDropdownOpen(false)
                  }}
                >Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Panel>

        <Panel position="top-right" className="flex gap-2">
          <Button disabled={!nodes.length} onClick={() => setShowDialog(true)} >
            Save Canvas <SquareMousePointer />
          </Button>
          <Button
            // onClick={handleCreateNode}
            variant="outline">
            Create Node <Plus />
          </Button>
          <Button
            // onClick={() => setClearAlert(true)}
            variant="outline">
            Clear Canvas <Eraser />
          </Button>
        </Panel>

      </ReactFlow>
    </div>
  );
}

export default Canvas;
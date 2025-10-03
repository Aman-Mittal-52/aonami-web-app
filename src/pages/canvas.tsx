import React, { useCallback, useEffect, useState } from 'react'
import '@xyflow/react/dist/style.css';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Controls, MiniMap, Background, Panel, Position } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Brain, DollarSign, Eraser, Plus, Settings, SquareMousePointer } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Node, Edge } from '@xyflow/react';
import { nodeTypes } from './canvas/node-types';
import { useSidebar } from '@/components/ui/sidebar';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];


function Canvas() {

  const [isStarted, setIsStarted] = useState(false);
  const [EngineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [showEngineDialog, setShowEngineDialog] = useState(false);
  const [engineName, setEngineName] = useState('');

  const {setOpen} = useSidebar();

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


  useEffect(() => {
      setOpen(false);
  }, []);

  useEffect(() => {
    setEdges(eds => 
      eds.map(edge => ({
        ...edge,
        animated: isStarted
      }))
    );
  }, [isStarted]);

  const engines = [
    {
      id: 'reconciliation-engine',
      name: 'Reconciliation Engine',
      initNodes: [
        { id: 'start-node', type: 'startNode', position: { x: 0, y: 0 } , data: { handleStart:setIsStarted} },
        { id: 'customer-request', type: 'cardNode', position: { x: 280, y: 100 }, data: { label: 'Check Customer Request', description: '(UTR / MID)', position: Position.Left } },
        { id: 'banks-logs', type: 'cardNode', position: { x: 280 * 2, y: 100 }, data: { label: 'Check Banks Logs', description: 'for UTR', position: Position.Left } },
        { id: 'find-utr', type: 'findNode', position: { x: 280 * 3, y: 100 }, data: { label: 'Check UTR', description: 'UTR Found?', position: Position.Left } },
        
        //  if the urt found
        { id: 'check-bank-disbural-table', type: 'cardNode', position: { x: 280 * 4, y: 0 }, data: { label: 'Check Bank Disbural Table', description: '', position: Position.Left } },
        { id: 'check-disbural-table', type: 'cardNode', position: { x: 280 * 5, y: 0 }, data: { label: 'Check Disbural Table', description: '', position: Position.Left } },
        { id: 'store-row-values-in-state-variables', type: 'cardNode', position: { x: 280 * 6, y: 0 }, data: { label: 'Store Row Values in State Variables', description: '', position: Position.Left } },
        { id: 'update-recon-report', type: 'cardNode', position: { x: 280 * 7, y: 0 }, data: { label: 'Update Recon Report', description: '', position: Position.Left } },
        
        
        // if the urt not found
        { id: 'check-payment-table', type: 'cardNode', position: { x: 280 * 4, y: 200 }, data: { label: 'Check Payment Table', description: '', position: Position.Left } },
        { id: 'update-recon-report-not-found', type: 'cardNode', position: { x: 280 * 6, y: 200 }, data: { label: 'Update Recon Report', description: '', position: Position.Left } },

        // the match node
        { id: 'find-utr-match', type: 'findNode', position: { x: 280 * 8 + 50, y: 100 }, data: { label: 'UTR Match', description: 'UTR Matched?', position: Position.Left } },
        
        // compare node
        { id: 'compare-node', type: 'cardNode', position: { x: 280 * 9 + 50, y: 100 }, data: { label: 'Compare', description: 'Compare State Values', position: Position.Left } },
        { id: 'found-any', type: 'findNode', position: { x: 280 * 10 + 50, y: 100 }, data: { label: 'Found Any', description: 'Match Found?', position: Position.Left } },

        // other nodes
        { id: 'escalting-anomalies', type: 'cardNode', position: { x: 280 * 11, y: -100 }, data: { label: 'Escalting Anomalies', description: '', position: Position.Bottom } },
        
        // if match found
        { id: 'matched-check-payment-status', type: 'cardNode', position: { x: 280 * 12 + 50, y: 120 }, data: { label: 'Check Payment Status', description: '', position: Position.Left } },
        { id: 'matched-update-recon-report', type: 'cardNode', position: { x: 280 * 13 + 50, y: 100 }, data: { label: 'Update Recon Report', description: '', position: Position.Left } },
        { id: 'matched-identify-anomalies', type: 'cardNode', position: { x: 280 * 14 + 50, y: 100 }, data: { label: 'Identify Anomalies', description: '', position: Position.Left } },
        { id: 'matched-create-report', type: 'cardNode', position: { x: 280 * 15 + 50, y: 100 }, data: { label: 'Create Report', description: '', position: Position.Left } },
        { id: 'matched-create-operation-task', type: 'cardNode', position: { x: 280 * 16 + 50, y: 100 }, data: { label: 'Create Operation Task', description: '', position: Position.Left } },
      
        // if match not found
        { id: 'not-matched-update-report-with-mismatch', type: 'cardNode', position: { x: 280 * 11 , y: 200 }, data: { label: 'Update Report', description: 'Update Report with Mismatch & Types', position: Position.Left } },
        
      ],
      initEdges: [
        // start node
        { id: 'n1-n2', source: 'start-node', target: 'customer-request', animated: isStarted, type: 'bezier' },
        
        // if the urt found
        { id: 'customer-request-banks-logs', source: 'customer-request', target: 'banks-logs', animated: isStarted, type: 'bezier' },
        { id: 'banks-logs-find-utr', source: 'banks-logs', target: 'find-utr', animated: isStarted, type: 'bezier' },
        { id: 'find-utr-check-bank-disbural-table-found', source: 'find-utr', target: 'check-bank-disbural-table', label: 'found', animated: isStarted, type: 'bezier' },
        { id: 'check-bank-disbural-table-check-disbural-table', source: 'check-bank-disbural-table', target: 'check-disbural-table', animated: isStarted, type: 'bezier' },
        { id: 'check-disbural-table-store-row-values-in-state-variables', source: 'check-disbural-table', target: 'store-row-values-in-state-variables', animated: isStarted, type: 'bezier' },
        { id: 'store-row-values-in-state-variables-update-recon-report', source: 'store-row-values-in-state-variables', target: 'update-recon-report', animated: isStarted, type: 'bezier' },
        { id: 'update-recon-report-find-utr-match', source: 'update-recon-report', target: 'find-utr-match', animated: isStarted, type: 'bezier' },
        
        // if the urt not found
        { id: 'find-utr-check-payment-table', source: 'find-utr', target: 'check-payment-table', label: 'not found', animated: isStarted, type: 'bezier' },
        { id: 'check-payment-table-update-recon-report-not-found', source: 'check-payment-table', target: 'update-recon-report-not-found', animated: isStarted, type: 'bezier' },
        { id: 'update-recon-report-not-found-find-utr-match-not-found', source: 'update-recon-report-not-found', target: 'find-utr-match', animated: isStarted, type: 'bezier' },
      
        // compare edges
        { id: 'find-utr-match-compare-node', source: 'find-utr-match', target: 'compare-node', animated: isStarted, type: 'bezier' },
        { id: 'compare-node-found-any', source: 'compare-node', target: 'found-any', animated: isStarted, type: 'bezier' },
        { id: 'found-any-escalting-anomalies', source: 'found-any', target: 'escalting-anomalies', animated: isStarted, type: 'bezier' },

        // matched edges
        { id: 'found-any-matched-check-payment-status', source: 'found-any', target: 'matched-check-payment-status', label: 'found', animated: isStarted, type: 'bezier' },
        { id: 'matched-check-payment-status-matched-update-recon-report', source: 'matched-check-payment-status', target: 'matched-update-recon-report', animated: isStarted, type: 'bezier' },
        { id: 'matched-update-recon-report-matched-identify-anomalies', source: 'matched-update-recon-report', target: 'matched-identify-anomalies', animated: isStarted, type: 'bezier' },
        { id: 'matched-identify-anomalies-matched-create-report', source: 'matched-identify-anomalies', target: 'matched-create-report', animated: isStarted, type: 'bezier' },
        { id: 'matched-create-report-matched-create-operation-task', source: 'matched-create-report', target: 'matched-create-operation-task', animated: isStarted, type: 'bezier' },
        
        // not matched edges
        { id: 'found-any-not-matched-update-report-with-mismatch', source: 'found-any', target: 'not-matched-update-report-with-mismatch', label: 'not found', animated: isStarted, type: 'bezier' },
        { id: 'not-matched-update-report-with-mismatch-not-matched-check-payment-status', source: 'not-matched-update-report-with-mismatch', target: 'matched-check-payment-status', animated: isStarted, type: 'bezier' },

      ],
    },
    {
      id: 'chargeback-engine',
      name: 'Chargeback Engine',
      initNodes: [
        { id: 'start-node', type: 'startNode', position: { x: 0, y: 0 } },
        { id: 'card-node', type: 'cardNode', position: { x: -100, y: 100 }, data: { label: 'Node 2' } },
        { id: 'card-node', type: 'cardNode', position: { x: 100, y: 100 }, data: { label: 'Node 3' } },
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
// Canvas.jsx
import "../ressources/index.css";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import CorpusNode from "./Nodes/CorpusNode";
import MatrixNode from "./Nodes/MatrixNode";
import AutoCompletionNode from "./Nodes/AutoCompletionNode";

const nodeTypes = { corpus: CorpusNode, matrix: MatrixNode, autocompletion: AutoCompletionNode };

export default function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
}) {
  return (
    <div className="flex-1 relative bg-slate-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
      >
        <Controls 
          position="bottom-right"
          className="[&>button]:bg-slate-700 [&>button]:text-white [&>button]:hover:bg-slate-600"
        />

        <Background color="#fff" gap={22} variant="dots" />
      </ReactFlow>
    </div>
  );
}

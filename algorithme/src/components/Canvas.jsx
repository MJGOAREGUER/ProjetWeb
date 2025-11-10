// Canvas.jsx
import "../ressources/index.css";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import { useState } from "react";
import CorpusNode from "./Nodes/CorpusNode";
import MatrixNode from "./Nodes/MatrixNode";
import { useGraphEngine } from "../engine/useGraphEngine";

const nodeTypes = { corpus: CorpusNode, matrix: MatrixNode };

export default function Canvas() {
  const [nodes, setNodes] = useState([
    {
      id: "c1",
      type: "corpus",
      position: { x: 100, y: 120 },
      data: {
        label: "Corpus 1",
        text: "",
        onTextChange: (id, value) =>
          setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, text: value } } : n)),
      },
    },
    {
      id: "m1",
      type: "matrix",
      position: { x: 420, y: 120 },
      data: { loading: false, vocab: [], matrix: [], error: null, lastInfo: "", lastComputedText: "" },
    },
  ]);
  const [edges, setEdges] = useState([]);

  const { onNodesChange, onEdgesChange, onConnect, isValidConnection } =
    useGraphEngine(nodes, setNodes, edges, setEdges, /* debounceMs */ 5000);

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
        <Controls />
        <Background color="#fff" gap={22} variant="dots" />
      </ReactFlow>
    </div>
  );
}

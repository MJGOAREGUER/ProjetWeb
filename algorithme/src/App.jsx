import { useState } from "react";
import Canvas from "./components/Canvas";
import Menu from "./components/Menu";
import { useGraphEngine } from "./engine/useGraphEngine";
import { createCorpusNode, createMatrixNode, makeId, INITIAL_NODES } from "./engine/nodeCreation";
import { attachNodeHandlers } from "./engine/nodeHandler";

function App() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState([]);

  const { onNodesChange, onEdgesChange, onConnect, isValidConnection } =
    useGraphEngine(nodes, setNodes, edges, setEdges, 500);

  function addCorpusNode() {
    const id = makeId("c");
    const newNode = createCorpusNode(id, 200, 200, `Corpus ${id}`);
    setNodes(prev => [...prev, newNode]);
  }

  function addMatrixNode() {
    const id = makeId("m");
    const newNode = createMatrixNode(id, 400, 200);
    setNodes(prev => [...prev, newNode]);
  }

  const { nodesWithHandlers } = attachNodeHandlers(nodes, setNodes);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Menu
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(o => !o)}
        onAddCorpus={addCorpusNode}
        onAddMatrix={addMatrixNode}
      />

      <Canvas
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      />
    </div>
  );
}

export default App;

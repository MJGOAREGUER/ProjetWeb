import Canvas from "./components/Canvas";
import Menu from "./components/Menu";
import { useState } from "react";
import { useGraphEngine } from "./engine/useGraphEngine";

function App() {
  const [nodes, setNodes] = useState([
    {
      id: "c1",
      type: "corpus",
      position: { x: 100, y: 120 },
      data: {
        label: "Corpus 1",
        text: "",
      },
    },
    {
      id: "m1",
      type: "matrix",
      position: { x: 420, y: 120 },
      data: {
        loading: false,
        vocab: [],
        matrix: [],
        error: null,
        lastInfo: "",
        lastComputedText: "",
      },
    },
  ]);

  const [edges, setEdges] = useState([]);

  const { onNodesChange, onEdgesChange, onConnect, isValidConnection } =
    useGraphEngine(nodes, setNodes, edges, setEdges, 5000);

  // petite helper pour générer des ids
  function makeId(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 8);
  }

  // === fonctions appelées depuis le Menu ===
  function addCorpusNode() {
    const id = makeId("c");
    const newNode = {
      id,
      type: "corpus",
      position: { x: 200, y: 200 }, // tu peux faire mieux (ex: calculer en fonction existants)
      data: {
        label: `Corpus ${id}`,
        text: "",
      },
    };
    setNodes(prev => [...prev, newNode]);
  }

  function addMatrixNode() {
    const id = makeId("m");
    const newNode = {
      id,
      type: "matrix",
      position: { x: 400, y: 200 },
      data: {
        loading: false,
        vocab: [],
        matrix: [],
        error: null,
        lastInfo: "",
        lastComputedText: "",
      },
    };
    setNodes(prev => [...prev, newNode]);
  }

  function handleTextChange(id, value) {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? { ...n, data: { ...n.data, text: value } }
          : n
      )
    );
  }

  const handleDirtyChange =(id, dirty) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? { ...n, data: {...n.data, isDirty: dirty} }
          : n
      )
    );
  };

  const nodesWithHandlers = nodes.map(node =>
    node.type === "corpus"
      ? {
          ...node,
          data: {
            ...node.data,
            onTextChange: handleTextChange,
            onDirtyChange: handleDirtyChange
          },
        }
      : node
  );

  const [isMenuOpen, setIsMenuOpen] = useState(true);

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

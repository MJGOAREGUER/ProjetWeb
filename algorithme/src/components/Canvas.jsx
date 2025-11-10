import "../ressources/index.css";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls, applyNodeChanges } from '@xyflow/react';
import CorpusNode from "./Nodes/CorpusNode";
import { useCallback, useState } from "react";


const nodeTypes = {
    corpus: CorpusNode
};

function Canvas(){
 
    const [nodes, setNodes] = useState([
    {
        id: "1",
        type: "corpus",
        position: { x: 100, y: 120 },
        data: {
        label: "Corpus 1",
        text: "",
        onLabelChange: (id, value) => {
            setNodes((nds) =>
            nds.map((node) =>
                node.id === id
                ? { ...node, data: { ...node.data, label: value } }
                : node
            )
            );
        },
        onTextChange: (id, value) => {
            setNodes((nds) =>
            nds.map((node) =>
                node.id === id
                ? { ...node, data: { ...node.data, text: value } } // ← correct ici
                : node
            )
            );
        },
        },
    },
    ]);

    const [edges, setEdges] = useState([]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    return(
        <div className="flex-1 relative bg-slate-700">
            <ReactFlow 
                nodes={nodes} 
                edges={edges}
                nodeTypes={nodeTypes} 
                onNodesChange={onNodesChange}
                fitView
                snapToGrid
                snapGrid={[10, 10]}
            >
                <Controls />
                <Background 
                    color="#fff"
                    gap={22}
                    variant="dots"
                />
            </ReactFlow>
        </div>
    );
}

export default Canvas;
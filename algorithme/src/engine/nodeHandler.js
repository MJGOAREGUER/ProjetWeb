export function attachNodeHandlers(nodes, setNodes, deps = {}) {
  const {
    onTextChangeExtra,
    onDirtyChangeExtra,
  } = deps;

  const handleTextChange = (id, value) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? { ...n, data: { ...n.data, text: value } }
          : n
      )
    );
    onTextChangeExtra?.(id, value);
  };

  const handleDirtyChange = (id, dirty) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? { ...n, data: { ...n.data, isDirty: dirty } }
          : n
      )
    );
    onDirtyChangeExtra?.(id, dirty);
  };

  const handleMatrixTypeChange = (id, newType) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                params: {
                  ...n.data.params,
                  matrixType: newType,
                },
              },
            }
          : n
      )
    );
  };

  const handleWindowChange = (id, newWindow) => {
    setNodes(nds =>
      nds.map(n =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                params: {
                  ...n.data.params,
                  windowRange: newWindow,
                },
              },
            }
          : n
      )
    );
  };

  const nodesWithHandlers = nodes.map(node => {
    if (node.type === "matrix") {
      return {
        ...node,
        data: {
          ...node.data,
          onMatrixChange: handleMatrixTypeChange,
          onWindowChange: handleWindowChange,
        },
      };
    }
    if (node.type === "corpus") {
      return {
        ...node,
        data: {
          ...node.data,
          onTextChange: handleTextChange,
          onDirtyChange: handleDirtyChange,
        },
      };
    }
    return node;
  });

  return {
    nodesWithHandlers,
  };
}

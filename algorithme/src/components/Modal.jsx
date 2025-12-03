import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import CorpusSettingsPanel from "./Panels/CorpusSettingsPannel";

const NODE_PANELS = {
    corpus: CorpusSettingsPanel,
}

export const NodeModalAPI = {
    open: () => console.warn("NodeModalAPI.open avant initialisation"),
    close: () => console.warn("NodeModalAPI.close avant initialisation"),
};

const NodeModalContext = createContext(null);

export function NodeModalProvider({ children }) {
    const [modal, setModal] = useState({
        open: false,
        mode: null,
        nodeId: null,
        nodeType: null,
        data: null,
    });
    
    const openModal = useCallback((options = {}) => {
        setModal({
            open: true,
            mode: options.mode || "info",
            nodeId: options.nodeId ?? null,
            nodeType: options.nodeType ?? null,
            data: options.data ?? null,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal((prev) => ({ ...prev, open: false }));
    }, []);

    useEffect(() => {
        NodeModalAPI.open = openModal;
        NodeModalAPI.close = closeModal;
    }, [openModal, closeModal]);

    return (
        <NodeModalContext.Provider value={{ openModal, closeModal, modal }}>
            {children}
            <NodeModal
                open={modal.open}
                mode={modal.mode}
                nodeId={modal.nodeId}
                nodeType={modal.nodeType}
                data={modal.data}
                onClose={closeModal}
            />
        </NodeModalContext.Provider>
    );
}

export function useNodeModal(){
    return useContext(NodeModalContext);
}
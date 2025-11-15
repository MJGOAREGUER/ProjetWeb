// engine/useGraphEngine.js
import { useCallback, useEffect, useRef } from "react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { processors } from "./processors";

const keyFor = (srcType, tgtType) => `${srcType}>${tgtType}`;

export function useGraphEngine(nodes, setNodes, edges, setEdges, debounceMs = 5000) {
  // refs anti-stale
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  // --- 1) Validation de connexion: inchangé ---
  const isValidConnection = useCallback((conn) => {
    const ns = nodesRef.current;
    const src = ns.find(n => n.id === conn.source);
    const tgt = ns.find(n => n.id === conn.target);
    if (!src || !tgt) return false;
    return Boolean(processors[keyFor(src.type, tgt.type)] || processors[keyFor(tgt.type, src.type)]);
  }, []);

  // --- 2) onConnect: on se contente d'ajouter l'edge ---
  // le calcul sera déclenché par l'effet "debounce" plus bas
  const onConnect = useCallback((connection) => {
    const newId = `${connection.source}-${connection.target}`;
    setEdges(eds =>
      eds.some(e => e.id === newId)
        ? eds
        : addEdge({ ...connection, id: newId }, eds)
    );
  }, [setEdges]);

  // --- Handlers React Flow de base: inchangés ---
  const onNodesChange = useCallback((changes) => {
    setNodes(nds => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges(eds => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  // --- 3) Debounce par source, mais appel avec TOUTES les sources d'une cible ---
  const timersRef = useRef(new Map()); // nodeId -> timeoutId

  useEffect(() => {
    const ns = nodesRef.current;
    const es = edgesRef.current;

    // types considérés comme "sources" dans les processors
    const sourceTypes = new Set(
      Object.keys(processors).map(k => k.split(">")[0])
    );

    // types de cibles
    const targetTypes = new Set(
      Object.keys(processors).map(k => k.split(">")[1])
    );

    const sources = ns.filter(n => sourceTypes.has(n.type));

    for (const src of sources) {
      // reset du timer pour ce node source
      if (timersRef.current.has(src.id)) {
        clearTimeout(timersRef.current.get(src.id));
      }

      const t = setTimeout(async () => {
        const curNodes = nodesRef.current;
        const curEdges = edgesRef.current;

        // 1) trouver toutes les cibles connectées à CE src
        const targets = curEdges
          .filter(e => e.source === src.id || e.target === src.id)
          .map(e => (e.source === src.id ? e.target : e.source))
          .map(id => curNodes.find(n => n.id === id))
          .filter(n => n && targetTypes.has(n.type));

        for (const tgt of targets) {
          // 2) pour cette cible, trouver toutes les sources connectées
          const allSources = curEdges
            .filter(e => e.source === tgt.id || e.target === tgt.id)
            .map(e => (e.source === tgt.id ? e.target : e.source))
            .map(id => curNodes.find(n => n.id === id))
            .filter(n => n && sourceTypes.has(n.type));

          if (allSources.length === 0) continue;

          // 3) choisir le bon processor selon les types
          // ici on prend le type du PREMIER source (tous tes corpus ont le même type)
          const srcType = allSources[0].type;
          const key = keyFor(srcType, tgt.type);
          const swappedKey = keyFor(tgt.type, srcType);

          let proc = processors[key] || processors[swappedKey];
          if (!proc) continue;

          // 4) appel du processor multi-sources
          await proc({ sources: allSources, tgt, setNodes });
        }
      }, debounceMs);

      timersRef.current.set(src.id, t);
    }

    return () => {
      for (const [, timeoutId] of timersRef.current) {
        clearTimeout(timeoutId);
      }
      timersRef.current.clear();
    };
  }, [nodes, edges, setNodes, debounceMs]);

  return { onNodesChange, onEdgesChange, onConnect, isValidConnection };
}

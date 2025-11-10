// engine/useGraphEngine.js
import { useCallback, useEffect, useRef } from "react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { processors } from "./processors";

const keyFor = (srcType, tgtType) => `${srcType}>${tgtType}`;

export function useGraphEngine(nodes, setNodes, edges, setEdges, debounceMs=5000) {
  // refs pour éviter la stale closure
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(()=>{ nodesRef.current = nodes; }, [nodes]);
  useEffect(()=>{ edgesRef.current = edges; }, [edges]);

  // Valider les connexions selon le registre
  const isValidConnection = useCallback((conn) => {
    const ns = nodesRef.current;
    const src = ns.find(n => n.id === conn.source);
    const tgt = ns.find(n => n.id === conn.target);
    if (!src || !tgt) return false;
    return Boolean(processors[keyFor(src.type, tgt.type)]);
  }, []);

  // Créer un edge et déclencher le processor
  const onConnect = useCallback(async (connection) => {
    const newId = `${connection.source}-${connection.target}`;
    setEdges(eds => (eds.some(e => e.id === newId) ? eds : addEdge({ ...connection, id: newId }, eds)));

    const ns = nodesRef.current;
    const src = ns.find(n => n.id === connection.source);
    const tgt = ns.find(n => n.id === connection.target);
    if (!src || !tgt) return;

    // si sens inversé mais un processor existe dans l'autre sens, on swap
    let proc = processors[keyFor(src.type, tgt.type)];
    if (!proc) {
      const swapped = processors[keyFor(tgt.type, src.type)];
      if (!swapped) return;
      // on veut toujours logique "source -> cible"
      return swapped({ src: tgt, tgt: src, setNodes });
    }

    return proc({ src, tgt, setNodes });
  }, [setEdges, setNodes]);

  // Handlers React Flow de base
  const onNodesChange = useCallback((changes) => {
    setNodes(nds => applyNodeChanges(changes, nds));
  }, [setNodes]);

  const onEdgesChange = useCallback((changes) => {
    setEdges(eds => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  // --- Debounce automatique par source (ex: corpus) ---
  // Mécanisme: si un node source change (ex: text), on attend debounceMs.
  // Puis on regarde les edges sortants et on exécute les processors correspondants.
  const timersRef = useRef(new Map()); // nodeId -> timeoutId

  useEffect(() => {
    const ns = nodesRef.current;
    const es = edgesRef.current;

    // Pour chaque node "source potentiel" (= apparait comme source d’au moins un processor)
    const sourceTypes = new Set(Object.keys(processors).map(k => k.split(">")[0]));
    const sources = ns.filter(n => sourceTypes.has(n.type));

    for (const src of sources) {
      // Heuristique: on surveille src.data (ex: text). À chaque changement de nodes, on reset le timer.
      // (Dans un monde idéal, on comparerait un hash du payload utile.)
      if (timersRef.current.has(src.id)) clearTimeout(timersRef.current.get(src.id));
      const t = setTimeout(async () => {
        // Trouver les cibles reliées
        const targets = es
          .filter(e => e.source === src.id || e.target === src.id)
          .map(e => (e.source === src.id ? e.target : e.source))
          .map(id => ns.find(n => n.id === id))
          .filter(Boolean);

        for (const tgt of targets) {
          const proc = processors[keyFor(src.type, tgt.type)];
          const swapped = processors[keyFor(tgt.type, src.type)];
          if (proc) await proc({ src, tgt, setNodes });
          else if (swapped) await swapped({ src: tgt, tgt: src, setNodes });
        }
      }, debounceMs);
      timersRef.current.set(src.id, t);
    }

    return () => {
      // cleanup des timers à chaque re-render
      for (const [, timeoutId] of timersRef.current) clearTimeout(timeoutId);
      timersRef.current.clear();
    };
  }, [nodes, edges, setNodes, debounceMs]);

  return { onNodesChange, onEdgesChange, onConnect, isValidConnection };
}

// engine/processors.js
import { edgesToMatrix, fetchCooc } from "./utils";

export const processors = {
  // clé = "sourceType>targetType"
  "corpus>matrix": async ({ src, tgt, setNodes }) => {
    const text = src?.data?.text ?? "";
    if (!text.trim()) {
      setNodes(nds => nds.map(n => n.id === tgt.id
        ? { ...n, data: { ...n.data, loading: false, error: null, lastInfo: "Texte vide" } }
        : n));
      return;
    }

    // anti-boucle: ne relance pas si même texte déjà calculé
    if (tgt.data?.lastComputedText === text) return;

    setNodes(nds => nds.map(n => n.id === tgt.id
      ? { ...n, data: { ...n.data, loading: true, error: null, lastInfo: "Calcul…" } }
      : n));

    const result = await fetchCooc(text, { window: 2, top_k: 200 });
    const matrix = edgesToMatrix(result.vocab, result.edges ?? []);

    setNodes(nds => nds.map(n => n.id === tgt.id
      ? { ...n, data: { ...n.data, loading: false, error: null, lastInfo: "OK", vocab: result.vocab, matrix, lastComputedText: text } }
      : n));
  },

  // Exemple d’extension plus tard :
  // "corpus>summary": async ({ src, tgt, setNodes }) => { ... },
  // "matrix>graph": async ({ src, tgt, setNodes }) => { ... },
};

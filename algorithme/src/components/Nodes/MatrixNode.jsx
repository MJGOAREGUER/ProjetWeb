import { Handle, Position } from "@xyflow/react";
import { useState, useMemo } from "react";

export default function MatrixNode({ id, data = {}, selected }) {
  const {
    title = "Matrice",
    vocab = [],
    matrix = [],
    loading = false,
    error = null,
    lastInfo = "",
    contexts = null,
  } = data;

  const matrixType = data.params['matrixType'];
  const [query, setQuery] = useState("");

  const rowLabels = useMemo(() => {
    if (matrixType === "contexte") {
      if (Array.isArray(contexts) && contexts.length === matrix.length) {
        return contexts.map((ctxIdx, row) => {
          if (!Array.isArray(ctxIdx)) return `ctx_${row}`;
          const tokens = ctxIdx.map((i) =>
            vocab[i] !== undefined ? vocab[i] : `?${i}`
          );
          return tokens.join(" · "); // ex: "chien · mange"
        });
      }
      return Array.from({ length: matrix.length }, (_, i) => `ctx_${i}`);
    }

    return vocab;
  }, [matrixType, vocab, matrix.length, contexts]);

  const indexedRows = useMemo(
    () => rowLabels.map((label, i) => ({ label, i })),
    [rowLabels]
  );

  const filteredRows = useMemo(() => {
    if (!query.trim()) return indexedRows;
    const q = query.toLowerCase();
    return indexedRows.filter(({ label }) =>
      String(label).toLowerCase().includes(q)
    );
  }, [indexedRows, query]);

  const visibleRows = filteredRows.slice(0, 6);
  const totalRows = matrix.length;
  const totalCols = matrix[0]?.length ?? 0;

  return (
    <div
      className={[
        "min-w-[280px] min-h-[140px] rounded-xl border shadow-sm",
        "bg-slate-800/80 border-slate-700 text-slate-100",
        selected ? "ring-2 ring-indigo-500" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-sm font-semibold">{title}</span>

        <select
          value={matrixType}
          onChange={(e) => data.onMatrixChange?.(id, e.target.value)}
          className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
        >
          <option value="cooc">Co-occurence</option>
          <option value="count">Comptage</option>
          <option value="contexte">Contexte</option>
        </select>
        {loading && <span className="text-xs text-slate-300">Calcul…</span>}
      </div>

      <div className="p-3 text-xs space-y-2">
        {lastInfo && <div className="text-slate-400">{lastInfo}</div>}
        {error && <div className="text-rose-300">{String(error)}</div>}

        {vocab.length > 0 && matrix.length > 0 ? (
          <div className="space-y-2">
            {/* Champ de recherche */}
            <input
              type="text"
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] outline-none"
              placeholder={
                matrixType === "contexte"
                  ? "Rechercher un contexte (ligne)…"
                  : "Rechercher un mot (ligne)…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {(matrixType === "contexte" || matrixType === "cooc")
              ? <input
                  type="text"
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] outline-none"
                  placeholder="Entrez un nombre pour la fenêtre de sélection"
                  onChange={(e) => data.onWindowChange?.(id, e.target.value)}
                />
              : ""
            }

            {/* Tableau */}
            <div className="overflow-auto rounded border border-slate-700">
              <table className="text-[11px] min-w-max w-full">
                <thead className="sticky top-0 bg-slate-900">
                  <tr>
                    <th className="p-1 text-left">
                      {matrixType === "count"
                        ? "Mot"
                        : matrixType === "contexte"
                        ? "Contexte"
                        : "# / Mot"}
                    </th>
                    {matrixType === "cooc" || matrixType === "contexte" ? (
                      vocab.slice(0, 6).map((w, j) => (
                        <th key={j} className="p-1 text-left">
                          {w}
                        </th>
                      ))
                    ) : (
                      <th className="p-1 text-left">Compte</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(({ label, i }) => {
                    const row = matrix[i] || [];
                    return (
                      <tr key={i} className="odd:bg-slate-900/40">
                        <td className="p-1 text-slate-300">
                          {String(label)}
                        </td>
                        {matrixType === "count" ? (
                          <td className="p-1 tabular-nums">
                            {row[0] ?? 0}
                          </td>
                        ) : (
                          row.slice(0, 6).map((v, j) => (
                            <td key={j} className="p-1 tabular-nums">
                              {v}
                            </td>
                          ))
                        )}
                      </tr>
                    );
                  })}

                  {visibleRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={1 + Math.min(6, totalCols || vocab.length)}
                        className="p-2 text-center text-slate-400"
                      >
                        Aucune ligne ne correspond à « {query} ».
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-slate-500 flex justify-between">
              <span>
                Vocab: {vocab.length} | Mat: {totalRows}×{totalCols}
              </span>
            </div>
          </div>
        ) : !loading && !error ? (
          <div className="text-slate-300">
            Relie à un <b>CorpusNode</b> et assure-toi que le texte n’est pas vide.
          </div>
        ) : null}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-400"
      />
    </div>
  );
}

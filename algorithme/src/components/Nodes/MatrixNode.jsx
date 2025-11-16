import { Handle, Position } from "@xyflow/react";

export default function MatrixNode({ id, data = {}, selected }) {
  const { vocab = [], matrix = [], loading = false, error = null, lastInfo = "" } = data;

  return (
    <div className={[
      "min-w-[280px] min-h-[120px] rounded-xl border shadow-sm",
      "bg-slate-800/80 border-slate-700 text-slate-100",
      selected ? "ring-2 ring-indigo-500" : "",
    ].join(" ")}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-sm font-semibold">Co-occurrence</span>
        {loading && <span className="text-xs text-slate-300">Calcul…</span>}
      </div>

      <div className="p-3 text-xs space-y-2">
        {lastInfo && <div className="text-slate-400">{lastInfo}</div>}
        {error && <div className="text-rose-300">{String(error)}</div>}

        {vocab.length > 0 && matrix.length > 0 ? (
          <div className="space-y-2">
            <div className="max-w-[400px] overflow-auto rounded border border-slate-700">
              <table className="text-[11px] min-w-max">
                <thead className="sticky top-0 bg-slate-900">
                  <tr>
                    <th className="p-1 text-left">#</th>
                    {vocab.map((w,j)=><th key={j} className="p-1 text-left">{w}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.slice(0,6).map((row,i)=>(
                    <tr key={i} className="odd:bg-slate-900/40">
                      <td className="p-1 text-slate-300">{vocab[i]}</td>
                      {row.map((v,j)=><td key={j} className="p-1 tabular-nums">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-slate-500">Vocab: {vocab.length} | Mat: {matrix.length}×{matrix[0]?.length ?? 0}</div>
          </div>
        ) : !loading && !error && (
          <div className="text-slate-300">Relie à un <b>CorpusNode</b> et assure-toi que le texte n’est pas vide.</div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-indigo-400" />
    </div>
  );
}

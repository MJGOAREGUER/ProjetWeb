import { useRef, useCallback, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";

function CorpusNode({ id, data = {}, selected }) {
  const {
    label = "Corpus",
    text = "",
    description,
    onTextChange,          // (id, newText)
    onIdle,                // (id, text)  => appelé après 5s sans frappe
    onDirtyChange,         // (id, isDirty)
    isDirty = false,       // optionnel: piloté par le parent si tu veux
    debounceMs = 5000,     // optionnel: délai (par défaut 5s)
  } = data;

  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const setText = useCallback(
    (t) => {
      onTextChange?.(id, t);
      onDirtyChange?.(id, true); // on marque comme “modifié”
    },
    [id, onTextChange, onDirtyChange]
  );

  // Lance/relance le timer à chaque changement de texte
  useEffect(() => {
    // clean timer précédent
    if (timerRef.current) clearTimeout(timerRef.current);

    // si pas de texte ET qu'on veut ignorer, on peut ne rien déclencher
    // ici on déclenche quand même, le parent décidera quoi faire
    timerRef.current = setTimeout(() => {
      // plus de frappe depuis debounceMs → on notifie
      onIdle?.(id, text);
      onDirtyChange?.(id, false); // on considère synchronisé après déclenchement
    }, Math.max(0, debounceMs || 5000));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, text, onIdle, onDirtyChange, debounceMs]);

  const onFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      alert("Seuls les fichiers .txt sont acceptés.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(file, "utf-8");
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      alert("Glissez un fichier au format .txt");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(file, "utf-8");
  };

  const onDragOver = (e) => e.preventDefault();

  // Petit badge de statut (piloté par isDirty)
  const status = isDirty ? (
    <span className="text-[11px] text-amber-300">En attente…</span>
  ) : (
    <span className="text-[11px] text-emerald-300">À jour</span>
  );

  return (
    <div
      className={[
        "min-w-[260px] rounded-xl border shadow-sm",
        "bg-slate-800/80 border-slate-600 text-slate-100",
        selected ? "ring-2 ring-indigo-500" : "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-sm font-semibold">{label}</span>
        <div className="flex items-center gap-3">
          {status}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
            title="Importer un fichier .txt"
          >
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={onFilePick}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div
          className="rounded-md border border-slate-700 bg-slate-900"
          onDrop={onDrop}
          onDragOver={onDragOver}
          title="Glissez un fichier .txt ici"
        >
          <textarea
            className="w-full h-40 resize-y bg-transparent p-2 text-sm outline-none nodrag nowheel"
            placeholder="Écrivez ici ou importez un .txt…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {description && (
          <p className="text-xs text-slate-300/90">{description}</p>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-slate-400" />
    </div>
  );
}

export default CorpusNode;

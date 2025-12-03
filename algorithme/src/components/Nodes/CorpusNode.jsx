import { useRef, useCallback, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import InfoIcon from "../../ressources/images/info.png"
import SettingsIcon from "../../ressources/images/settings.png"

function CorpusNode({ id, data = {}, selected }) {
  const {
    label = "Corpus",
    text = "",
    description,
    onTextChange,          // (id, newText)
    onIdle,                // (id, text)  => appelé après 5s sans frappe
    onDirtyChange,         // (id, isDirty)
    isDirty = false,       // optionnel: piloté par le parent si tu veux
    debounceMs = 500,     // optionnel: délai (par défaut 5s)
    onKeyDown,
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
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={[
        "min-w-[260px] rounded-xl border shadow-sm",
        "bg-slate-800/80 border-slate-600 text-slate-100",
        selected ? "ring-2 ring-indigo-500" : "",
      ].join(" ")}
    >
      {/* Options */}
      {selected && (
        <div className="
          absolute -top-[30px] right-4 flex items-center gap-2 bg-slate-800
          ring-2 ring-indigo-500 rounded-t-xl px-3 py-1 test-xs text-slate-100 shadow-lg
          pointer-eventes-auto
          "
        >
          <button
            className="px-2 py-0.5 rounded bg-transparent brightness-[0.60] hover:brightness-150 transition-all duration-150"
          >
            <img src={InfoIcon}  alt="Info" className="w-4 h-4 shrink-0" />
          </button>
          <button
            className="px-2 py-0.5 rounded bg-transparent brightness-[0.60] hover:brightness-150 transition-all duration-150"
          >
            <img src={SettingsIcon} alt="Paramètres" className="w-4 h-4 shrink-0" />
          </button> 
        </div>
      )}

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
            className="w-full h-40 resize bg-transparent p-2 text-sm outline-none nodrag nowheel scrollbar-corpus"
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

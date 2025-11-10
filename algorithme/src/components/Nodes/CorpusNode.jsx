import { useRef, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

function CorpusNode({ id, data, selected}) {
    const fileInputRef = useRef(null);

    const setText = useCallback( (text) => {
        return data?.onTextChange?.(id, text)
    }, [data, id]);

    const onFilePick = (e) => {
        const file = e.target.files?.[0];
        if(!file) return;
        if(!file.name.toLowerCase().endsWith(".txt")) {
            alert("Seuls les fichiers .txt sont acceptés");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setText(String(reader.result ?? ""));
        reader.readAsText(file, "utf-8");
    };

    const onDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if(!file) return;
        if(!file.name.toLowerCase().endsWith(".txt")){
            alert("Glissez un fichier du format '.txt'");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setText(String(reader.result ?? ""));
        reader.readAsText(file, "utf-8");
    }

    const onDragOver = (e) => e.preventDefault();

    return(
        <div
         className={[
            "min-w-[260px] rounded-xl border shadow-sm",
            "bg-slate-800/80 border-slate-600 text-slate-100",
            selected ? "ring-2 ring-indigo-500" : "",
         ].join(" ")}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                <span className="text-sm font-semibold">
                    {data?.label ?? "Corpus"}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs px-2 py-1 rounded bg-slage-700 hover:bg-slate-600"
                        title="Importer un fichier texte"
                    >
                        Importer
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt, text/plain"
                        className="hidden"
                        onChange={onFilePick}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                <input 
                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm outline-none focus: border-indigo-500"
                    value={data?.label ?? ""}
                    onChange={(e) => data?.onLabelChange?.(id, e.target.value)}
                    placeholder="Nom du node"
                />

                <div
                    className="rounded-md border border-slate-700 bg-slate-900"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    title="Glissez un fichier texte ici"
                >
                    <textarea
                        className="w-full h-40 resize-y bg-transparent p-2 text-sm outline-none"
                        placeholder="Ecrivez ici ou importez un fichier .txt"
                        value={data?.text ?? ""}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {data?.description && (
                    <p className="text-xs text-slate-300/90">{data.description}</p>
                )}
            </div>

            <Handle type="target" position={Position.Bottom} className="!bg-slate-400" />
       </div>
    );
}

export default CorpusNode;
import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";

function AutoCompletionNode({ id, data = {}, selected }) {
    const {
        loading = false,
        title = "AutoCompletion",
        text = "",
        nextWord = "",
        lastData = ["ngrams", ""],
        params = { type: "ngrams"},
        onTextChange,          // (id, newText)
        onIdle,                // (id, text)  => appelé après 5s sans frappe
        onDirtyChange,         // (id, isDirty)
        isDirty = false,       // optionnel: piloté par le parent si tu veux
        debounceMs = 500, 
    } = data;

    const timerRef = useRef(null);

    const setText = useCallback(
        (t) => {
            onTextChange?.(id, t);
            onDirtyChange?.(id, true);
        },
        [id, onTextChange, onDirtyChange]
    );

    useEffect(() => {
        if(timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            onIdle?.(id, text);
            onDirtyChange?.(id, false);
        }, Math.max(0, debounceMs || 5000));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [id, text, onIdle, onDirtyChange, debounceMs]);

    return (
        <div
            className={[
                "min-w-[260px] rounded-xl border shadow-sm",
                "bg-slate-800/80 border-slate-600 text-slate-100",
                selected ? "ring-2 ring-indigo-500" : "",
            ].join(" ")}
        >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
                <span className="text-sm font-semibold">{title}</span>

                <select
                    className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded focus:outline-none"
                >
                    <option value="ngrams">N-gramme</option>
                </select>

                {loading && <span className="text-xs text-slate-300">Calcul...</span>}
            </div>

            <div className="p-3 space-y-2">
                <textarea
                    className="w-full h-40 resize bg-slate-900 rounded-md border border-slate-700 p-2 text-sm outline-none nodrag nowheel scrollbar-corpus"
                    placeholder="Écrivez ici"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <Handle type="target" position={Position.Left} className="!bg-slate-400"  />
        </div>
    );
}

export default AutoCompletionNode;
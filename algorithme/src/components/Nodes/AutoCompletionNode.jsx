import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";

function AutoCompletionNode({ id, data = {}, selected }) {
    const {
        loading = false,
        title = "AutoCompletion",
        text = "",
        nextWord = "",
        onTextChange,
        onIdle,
        onDirtyChange,
        debounceMs = 500,
    } = data;

    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    const overlayRef = useRef(null);
    const timerRef = useRef(null);

    const setText = useCallback(
        (t) => {
            onTextChange?.(id, t);
            onDirtyChange?.(id, true);
        },
        [id, onTextChange, onDirtyChange]
    );

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onIdle?.(id, text);
            onDirtyChange?.(id, false);
        }, debounceMs);

        return () => clearTimeout(timerRef.current);
    }, [text, debounceMs, id, onIdle, onDirtyChange]);

    return (
        <div
            className={[
                "min-w-[260px] rounded-xl border shadow-sm",
                "bg-slate-800/80 border-slate-600 text-slate-100 relative",
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

            <div className="relative p-3 space-y-2">

                {/* CONTAINER */}
                <div className="relative w-full h-40">
                    
                    {/* TEXTAREA REEL */}
                    <textarea
                        ref={textareaRef}
                        className="absolute inset-0 w-full h-full resize bg-slate-900 rounded-md border border-slate-700 p-2 text-sm
                                   outline-none nodrag nowheel scrollbar-corpus text-slate-100"
                        placeholder="Écrivez ici"
                        value={text}
                        onChange={ (e) => setText(e.target.value) }
                        onFocus={ () => setIsFocused(true) }
                        onBlur={ () => setIsFocused(false) }
                    />

                    {/* GHOST TEXT */}
                    {nextWord && isFocused && (
                        <div
                            ref={overlayRef}
                            className="absolute inset-0 pointer-events-none whitespace-pre-wrap select-none p-2 text-sm"
                            style={{ color: "rgba(200,200,200,0.3)" }} // gris léger
                        >
                            <span className="invisible">{text}</span>
                            <span className="mx-2">{nextWord}</span>
                        </div>
                    )}
                </div>
            </div>

            <Handle type="target" position={Position.Left} className="!bg-slate-400" />
        </div>
    );
}

export default AutoCompletionNode;

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";

function AutoCompletionNode({ id, data = {}, selected }) {
    const {
        label = "AutoCompletion",
        type = "ngrams",
    } = data;

    return (
        <div
            className={[
                "min-w-[260px] rounded-xl border shadow-sm",
                "bg-slate-800/80 border-slate-600 text-slate-100",
                selected ? "ring-2 ring-indigo-500" : "",
            ].join(" ")}
        >
            <h1>AutoCompletionNode</h1>

            <Handle type="target" position={Position.Left} className="!bg-slate-400"  />
        </div>
    );
}

export default AutoCompletionNode;
// engine/utils.js
export function edgesToMatrix(vocab, edges) {
  const n = vocab.length;
  const M = Array.from({ length: n }, () => Array(n).fill(0));
  for (const e of edges ?? []) {
    const i = e.i|0, j = e.j|0, c = e.count|0;
    if (i>=0 && j>=0 && i<n && j<n) { M[i][j] = c; M[j][i] = c; }
  }
  return M;
}

export async function fetchCooc(text, { window=2, top_k=1000 }={}) {
  const res = await fetch("http://localhost:8000/TLN/cooc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text ?? "", window, top_k, lowercase: true, remove_stopwords: true }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(()=>res.statusText)}`);
  return res.json();
}

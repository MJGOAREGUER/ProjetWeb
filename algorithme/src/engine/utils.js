export function edgesToMatrix(vocab, edges) {
  const n = vocab.length;
  const M = Array.from({ length: n }, () => Array(n).fill(0));

  for (const e of edges ?? []) {
    const i = e.i | 0;
    const j = e.j | 0;
    const c = e.count | 0;

    if (i >= 0 && j >= 0 && i < n && j < n) {
      M[i][j] += c;
    }
  }

  return M;
}

export function edgesToContextMatrix(vocab, edges) {
  if (!edges || edges.length === 0) {
    return { matrix: [], contexts: [] };
  }

  // 1. Construire les contextes uniques
  const contextKeyMap = new Map();   // "0,1" -> rowIndex
  const contexts = [];               // [[0,1], [2,3], ...]

  for (const e of edges) {
    const ctx = Array.isArray(e.i) ? e.i : [e.i];
    const key = ctx.join(",");

    if (!contextKeyMap.has(key)) {
      contextKeyMap.set(key, contexts.length);
      contexts.push(ctx);
    }
  }

  const m = contexts.length;
  const n = vocab.length;

  // 2. Matrice m × n
  const M = Array.from({ length: m }, () =>
    Array(n).fill(0)
  );

  // 3. Remplissage : chaque edge = (contexte -> target)
  for (const e of edges ?? []) {
    const ctx = Array.isArray(e.i) ? e.i : [e.i];
    const key = ctx.join(",");
    const rowIndex = contextKeyMap.get(key);
    const colIndex = e.j | 0;
    const count = e.count | 0;

    if (
      rowIndex >= 0 && rowIndex < m &&
      colIndex >= 0 && colIndex < n
    ) {
      M[rowIndex][colIndex] += count;
    }
  }

  return { matrix: M, contexts };
}

export function encapsulateCompletion({ sources, tgt }) {
  const matrixNode = sources?.[0];
  const matrixData = matrixNode?.data ?? {};
  const targetData = tgt?.data ?? [];

  return {
    model: targetData.type ?? "ngrams",
    text: targetData.text ?? "",
    params: {
      vocab: matrixData.vocab ?? [],
      contexts: matrixData.contexts ?? [],
      matrix: matrixData.matrix ?? [],
      matrixType: matrixData.params?.matrixType ?? "contexte",
      windowRange: Number(matrixData.params?.windowRange ?? 2),
    },
  };
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

export async function fetchCount(text, {top_k= 1000}={}){
  const res = await fetch("http://localhost:8000/TLN/count", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text ?? "", top_k, lowercase: true, remove_stopwords: true }),
  });

  if(!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

export async function fecthContexte(text, { window=3, top_k=1000, remove_stopwords=false, add_separator=true }={}) {
  const res = await fetch("http://localhost:8000/TLN/contexte", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text ?? "", window, top_k, lowercase: true, remove_stopwords, add_separator}),
  });

  if(!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

export async function fetchPredictionRegister(text, data) {
  const res = await fetch("http://localhost:8000/TLN/prediction/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text ?? "", data: data ?? {}}),
  });

  if(!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}

export async function fetchPredictionGet(text) {
  const res = await fetch("http://localhost:8000/TLN/prediction/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text ?? "" }),
  });

  if(!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  return res.json();
}
import {
  edgesToMatrix,
  edgesToContextMatrix,
  fecthContexte,
  fetchCooc,
  fetchCount,
} from "./utils";

export const processors = {
  "corpus>matrix": async ({ sources, tgt, setNodes }) => {
    const matrixType = tgt?.data?.params['matrixType'] ?? "cooc";
    const windowRange = tgt?.data?.params['windowRange'] ?? "";

    const texts = (sources ?? [])
      .map(s => s?.data?.text ?? "")
      .map(t => t.trim())
      .filter(Boolean);

    if (texts.length === 0) {
      setNodes(nds =>
        nds.map(n =>
          n.id === tgt.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  loading: false,
                  error: null,
                  lastInfo: "Aucun texte connecté",
                  vocab: [],
                  matrix: [],
                  lastData: ["", matrixType, windowRange],
                  contexts: undefined,
                  params: { matrixType: matrixType, windowRange: windowRange },
                },
              }
            : n
        )
      );
      return;
    }

    const combinedText = texts.join("\n\n---\n\n");

    if (
      tgt.data?.lastData &&
      tgt.data.lastData[0] === combinedText &&
      tgt.data.lastData[1] === matrixType &&
      tgt.data.lastData[2] === windowRange
    ) {
      return;
    }

    setNodes(nds =>
      nds.map(n =>
        n.id === tgt.id
          ? {
              ...n,
              data: {
                ...n.data,
                loading: true,
                error: null,
                lastInfo: "Calcul…",
              },
            }
          : n
      )
    );

    let result;
    let matrix;
    let contexts;

    switch (matrixType) {
      case "cooc":
        result = await fetchCooc(combinedText, { window: parseInt(windowRange), top_k: 100000 });
        matrix = edgesToMatrix(result.vocab, result.edges ?? []);
        break;

      case "count":
        result = await fetchCount(combinedText, { top_k: 10000 });
        matrix = result.counts.map(v => [v]);
        break;

      case "contexte":
        result = await fecthContexte(combinedText, { window: parseInt(windowRange), top_k: 10000 });
        ({ matrix, contexts } = edgesToContextMatrix(
          result.vocab,
          result.edges ?? []
        ));
        break;

      default:
        result = await fetchCooc(combinedText, { window: windowRange, top_k: 100000, remove_stopwords: false });
        matrix = edgesToMatrix(result.vocab, result.edges ?? []);
        break;
    }

    setNodes(nds =>
      nds.map(n =>
        n.id === tgt.id
          ? {
              ...n,
              data: {
                ...n.data,
                loading: false,
                error: null,
                lastInfo: "",
                vocab: result.vocab,
                matrix,
                lastData: [combinedText, matrixType, windowRange],
                contexts,
                params: { matrixType: matrixType, windowRange: windowRange },
              },
            }
          : n
      )
    );
  },
  "matrix>autocompletion": async ({ sources, tgt, setNodes }) => {
    console.log("OUEP");
  },
};

import {
  edgesToMatrix,
  edgesToContextMatrix,
  encapsulateCompletion,
  fecthContexte,
  fetchCooc,
  fetchCount,
  fetchPredictionRegister,
  fetchPredictionGet,
} from "./utils";

export const processors = {
  "corpus>matrix": async ({ sources, tgt, setNodes }) => {
    const matrixType = tgt?.data?.params['matrixType'] ?? "cooc";
    const windowRange = tgt?.data?.params['windowRange'] ?? "";
    const matrixUpdate = tgt?.data?.params['update'] ?? false;

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
                  params: { matrixType: matrixType, windowRange: windowRange, update: matrixUpdate },
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
                params: { matrixType: matrixType, windowRange: windowRange, update: true },
              },
            }
          : n
      )
    );
  },
  "matrix>autocompletion": async ({ sources, tgt, setNodes }) => {
    const completionType = tgt?.data?.params?.["type"] ?? "ngrams";
    const text = (tgt?.data?.text ?? "").trim();
    const needRegister = sources[0].data.params['update'] ?? false;

    if(needRegister){
      let data = encapsulateCompletion({sources, tgt});
      let isGood = await fetchPredictionRegister(text, data);
      sources[0].data.params['update'] = false;
    }

    if (text.length === 0) {
      setNodes(nds =>
        nds.map(n =>
          n.id === tgt.id
            ?{
              ...n,
              data: {
                ...n.data,
                loading: false,
                nextWord: "",
                lastData: [completionType, ""],
                params: { type: completionType },
              }
            }
            : n
        )
      );
    }

    if (
      tgt.data?.lastData &&
      tgt.data.lastData[0] === completionType &&
      tgt.data.lastData[1] === text
    ){
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
          }
        } 
        : n
      )
    );

    let prediction;

    switch (completionType){
      case "ngrams":
        prediction = await fetchPredictionGet(text);
        console.log(text);
        break;
    }
    console.log(prediction.word)
    setNodes(nds =>
      nds.map(n =>
       n.id === tgt.id
        ? {
          ...n,
          data: {
            ...n.data,
            loading: false,
            lastData: [completionType, text],
            nextWord: prediction.word,
            params: { type: completionType },
          }
        } 
        : n
      )
    );


  },
};

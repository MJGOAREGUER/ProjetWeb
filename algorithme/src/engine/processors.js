import { edgesToMatrix, fetchCooc } from "./utils";

export const processors = {
  // clé = "sourceType>targetType"
  "corpus>matrix": async ({ sources, tgt, setNodes }) => {
    // sources = tableau de nodes "corpus" connectés à cette matrix

    const texts = (sources ?? [])
      .map(s => s?.data?.text ?? "")
      .map(t => t.trim())
      .filter(Boolean); // garde seulement les non vides

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
                  lastComputedText: "",
                },
              }
            : n
        )
      );
      return;
    }

    // tu peux décider comment combiner les textes :
    const combinedText = texts.join("\n\n---\n\n");

    // anti-boucle: si déjà calculé avec ce combo
    if (tgt.data?.lastComputedText === combinedText) return;

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

    const result = await fetchCooc(combinedText, { window: 2, top_k: 100000 });
    const matrix = edgesToMatrix(result.vocab, result.edges ?? []);

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
                lastComputedText: combinedText,
              },
            }
          : n
      )
    );
  },
};


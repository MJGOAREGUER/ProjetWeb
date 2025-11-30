export const BASE_MATRIX_DATA = {
    loading: false,
    vocab: [],
    matrix: [],
    error: null,
    lastInfo: "",
    lastData: ["", "cooc", "2"],
    params: { matrixType: "cooc", windowRange: "2", update: false },
};

export function makeId(prefix){
    return prefix + "_" + Math.random().toString(30).slice(2,8);
}

export function createCorpusNode(id, x, y, label = `Corpus ${id}`) {
    return {
        id,
        type: "corpus",
        position: { x: x, y: y },
        data: {
            label,
            text: "",
        },
    };
}

export function createAutoCompletionNode(id, x, y, overrides = {}) {
    return {
        id,
        type:  "autocompletion",
        position: { x: x, y: y },
        data: {
            ...overrides,
        }
    };
}

export function createMatrixNode(id, x, y, overrides = {}) {
    return {
        id,
        type: "matrix",
        position: { x: x, y: y },
        data: {
            ...BASE_MATRIX_DATA,
            ...overrides,
        },
    };
}

export const INITIAL_NODES = [
  createCorpusNode("c1", 10, 50, "Corpus 1"),

  createMatrixNode("m1", 420, 150, {
    title: "Matrice de Co-occurence",
    lastData: ["", "cooc", "2"],
    params: { matrixType: "cooc", windowRange: "2", update: false },
  }),

  createMatrixNode("m2", 420, 400, {
    title: "Matrice de Comptage",
    lastData: ["", "count", ""],
    params: { matrixType: "count", windowRange: "", update: false },
  }),

  createMatrixNode("m3", 420, -120, {
    title: "Matrice de Contexte",
    lastData: ["", "contexte", "2"],
    params: { matrixType: "contexte", windowRange: "2", update: false },
  }),

  createAutoCompletionNode("a1", 900, -105, {
    title: "Autocompletion test",
    lastData: ["ngrams", ""],
    params: { type: "ngrams" },
  }),
];

export const INITIAL_EDGES = [
  {
    id: "c1-m1",
    source: "c1",
    target: "m1",
  },
  {
    id: "c1-m2",
    source: "c1",
    target: "m2",
  },
  {
    id: "c1-m3",
    source: "c1",
    target: "m3",
  },
  {
    id: "m3-a1",
    source: "m3",
    target: "a1",
  },
];

export const BASE_MATRIX_DATA = {
    loading: false,
    vocab: [],
    matrix: [],
    error: null,
    lastInfo: "",
    lastData: ["", "cooc", "2"],
    params: { matrixType: "cooc", windowRange: "2" },
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
  createCorpusNode("c1", 100, 35, "Corpus 1"),

  createMatrixNode("m1", 420, 80, {
    title: "Matrice de Co-occurence",
    lastData: ["", "cooc", "2"],
    params: { matrixType: "cooc", windowRange: "2" },
  }),

  createMatrixNode("m2", 420, 250, {
    title: "Matrice de Comptage",
    lastData: ["", "count", ""],
    params: { matrixType: "count", windowRange: "" },
  }),

  createMatrixNode("m3", 420, -80, {
    title: "Matrice de Contexte",
    lastData: ["", "contexte", "2"],
    params: { matrixType: "contexte", windowRange: "2" },
  }),

  createAutoCompletionNode("a1", 900, 130, {}),
];
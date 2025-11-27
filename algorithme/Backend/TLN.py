from ast import mod
from re import A
from pydantic import BaseModel
from collections import Counter
from dataclasses import dataclass
from typing import List, Dict, Optional
from TLN_utils import tokenize

# Masque pour les entrée API
class corpusToMatrixIn(BaseModel):
    text: str
    window: int = 2
    top_k: int = 200
    lowercase: bool = True
    remove_stopwords: bool = True

class corpusToMatrixOut(BaseModel):
    vocab: list[str]
    edges: list[dict]
    counts: list[int]

class matrixPredictionRegisterIn(BaseModel):
    text: str
    # Conteneur générique pour tout ce qui concerne le modèle
    # Exemple actuel :
    # {
    #   "model": "ngrams",
    #   "text": "",
    #   "params": {
    #       "vocab": [...],
    #       "contexts": [...],
    #       "matrix": [...],
    #       "matrixType": "contexte",
    #       "windowRange": 2
    #   }
    # }
    data: dict = {}


class matrixPredictionGetIn(BaseModel):
    text: str
    # Optionnel : permet de spécifier le modèle à utiliser ou d'autres infos
    # Ex: { "model": "ngrams" }
    data: dict = {}


class matrixPredictionGetOut(BaseModel):
    word: str

def cooc(payload: corpusToMatrixIn):
    tokens = tokenize(payload.text, payload.lowercase, payload.remove_stopwords)
    if not tokens:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    # Simple count des mots du textes
    freq = Counter(tokens).most_common(payload.top_k)
    # On retire le vocabulaire
    vocab = [w for w,_ in freq]
    # On récupère l'index de la première occurrence d'un mot dans le texte donné
    idx = {w: i for i,w in enumerate(vocab)}

    k = len(vocab)
    if k == 0:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    window = max(1, int(payload.window))

    # Compte co-occurrences (format sparse en dict de dicts)
    cooc = {}  # (i -> dict(j->count))
    for pos, w in enumerate(tokens):
        if w not in idx:
            continue
        i = idx[w]

        # Fenetre ou l'on regarde qui s'adaptes pour la fin et le début du texte TODO: mettre des marqueurs début fin
        start = max(0, pos - window)
        end   = min(len(tokens), pos + window + 1)

        for q in range(start, end):
            # Si on est sur le mot à évalué
            if q == pos:
                continue

            w2 = tokens[q]
            if w2 not in idx:
                continue

            j = idx[w2]

            cooc.setdefault(i, {}).setdefault(j, 0)
            cooc[i][j] += 1

    edges = [{"i": i, "j": j, "count": c} for i, d in cooc.items() for j, c in d.items()]
    return corpusToMatrixOut(vocab=vocab, edges=edges, counts=[])

def count(payload: corpusToMatrixIn):
    tokens = tokenize(payload.text, payload.lowercase, payload.remove_stopwords)
    if not tokens:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    freq = Counter(tokens).most_common(payload.top_k)
    vocab = [w for w, _ in freq]
    counts = [c for _, c in freq]

    k = len(vocab)
    if k == 0:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    return corpusToMatrixOut(vocab=vocab, edges=[], counts=counts)

def contexte(payload: corpusToMatrixIn):
    tokens = tokenize(payload.text, payload.lowercase, payload.remove_stopwords)
    if not tokens:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    freq = Counter(tokens).most_common(payload.top_k)
    vocab = [w for w, _ in freq]
    idx = {w: i for i, w in enumerate(vocab)}

    if not vocab:
        return corpusToMatrixOut(vocab=[], edges=[], counts=[])

    window = max(1, int(payload.window))

    mat_counts = {}

    for pos in range(window, len(tokens)):
        target = tokens[pos]
        if target not in idx:
            continue

        context_tokens = tokens[pos - window:pos]

        if any(w not in idx for w in context_tokens):
            continue

        ctx_idx = tuple(idx[w] for w in context_tokens)
        col = idx[target]  # index du target dans le vocab

        key = (ctx_idx, col)
        mat_counts[key] = mat_counts.get(key, 0) + 1

    edges = [
        {
            "i": list(ctx_idx),  # tuple -> list pour JSON
            "j": col,
            "count": c,
        }
        for (ctx_idx, col), c in mat_counts.items()
    ]

    return corpusToMatrixOut(vocab=vocab, edges=edges, counts=[])

# -------------------------------
#   Stockage en mémoire
# -------------------------------

@dataclass
class NGramModel:
    vocab: List[str]
    contexts: List[List[int]]
    matrix: List[List[float]]
    matrix_type: str
    window_range: int

NGRAM_MODELS: Dict[str, NGramModel] = {}


# -------------------------------
#   Logique n-grams
# -------------------------------

def _predict_with_ngrams(tokens: List[str], model: NGramModel) -> Optional[str]:
    """
    Prédit le prochain mot à partir d'une liste de tokens et d'un modèle n-gram.
    Retourne None si aucune prédiction possible.
    """
    if not tokens:
        return None

    n = model.window_range
    if n <= 0:
        return None

    # On prend les n derniers tokens comme contexte
    ctx_tokens = tokens[-n:]

    # On mappe les tokens en indices du vocabulaire
    try:
        ctx_idx = [model.vocab.index(t) for t in ctx_tokens]
    except ValueError:
        # Un des tokens n'est pas dans le vocabulaire
        return None

    # On cherche la ligne correspondante dans contexts
    row_index = -1
    for i, ctx in enumerate(model.contexts):
        if len(ctx) == len(ctx_idx) and all(ctx[j] == ctx_idx[j] for j in range(len(ctx))):
            row_index = i
            break

    if row_index == -1:
        return None

    if row_index < 0 or row_index >= len(model.matrix):
        return None

    row = model.matrix[row_index]
    if not row:
        return None

    # argmax sur la ligne
    best_col = max(range(len(row)), key=lambda i: row[i])

    if best_col < 0 or best_col >= len(model.vocab):
        return None

    return model.vocab[best_col]


# -------------------------------
#   Fonctions appelées par FastAPI
# -------------------------------

def predictionRegister(payload: matrixPredictionRegisterIn):
    """
    Enregistre un modèle à partir de payload.data.
    Actuellement gère le cas 'model': 'ngrams'.
    """
    data = payload.data or {}
    print('ici')
    model_name = data.get("model", "ngrams")  # par défaut "ngrams"
    params = data.get("params", {}) or {}

    if model_name == "ngrams":
        vocab = params.get("vocab", [])
        contexts = params.get("contexts", [])
        matrix = params.get("matrix", [])
        matrix_type = params.get("matrixType", "contexte")
        window_range = int(params.get("windowRange", 2))

        if not vocab or not matrix:
            raise ValueError("vocab et matrix ne doivent pas être vides pour le modèle n-grams")

        ngram_model = NGramModel(
            vocab=vocab,
            contexts=contexts,
            matrix=matrix,
            matrix_type=matrix_type,
            window_range=window_range,
        )

        # Pour l’instant on indexe simplement par le nom de modèle
        NGRAM_MODELS[model_name] = ngram_model
        return True

    # Plus tard : gérer d'autres modèles ici (transformer, etc.)
    raise ValueError(f"Modèle '{model_name}' non supporté pour l'enregistrement.")


def predictionWord(payload: matrixPredictionGetIn):
    """
    Utilise un modèle enregistré pour prédire le prochain mot.
    Actuellement : n-grams.
    """
    tokens = tokenize(payload.text, False, False)
    if not tokens:
        return matrixPredictionGetOut(word="")

    data = payload.data or {}
    model_name = data.get("model", "ngrams")

    model = NGRAM_MODELS.get(model_name)
    if model is None:
        # Aucun modèle enregistré pour ce nom
        print(model)
        return matrixPredictionGetOut(word="")

    next_word = _predict_with_ngrams(tokens, model)
    if next_word is None:
        next_word = ""

    return matrixPredictionGetOut(word=next_word)
from re import A
from pydantic import BaseModel
from collections import Counter
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

    print(edges)
    return corpusToMatrixOut(vocab=vocab, edges=edges, counts=[])


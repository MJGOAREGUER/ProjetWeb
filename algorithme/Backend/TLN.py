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

# Point d'entrée API
def cooc(payload: corpusToMatrixIn):
    tokens = tokenize(payload.text, payload.lowercase, payload.remove_stopwords)
    if not tokens:
        return corpusToMatrixOut(vocab=[], edges=[])

    # Simple count des mots du textes
    freq = Counter(tokens).most_common(payload.top_k)
    # On retire le vocabulaire
    vocab = [w for w,_ in freq]
    # On récupère l'index de la première occurrence d'un mot dans le texte donné
    idx = {w: i for i,w in enumerate(vocab)}

    k = len(vocab)
    if k == 0:
        return corpusToMatrixOut(vocab=[], edges=[])

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
    return corpusToMatrixOut(vocab=vocab, edges=edges)
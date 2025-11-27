from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import TLN as tln  # Ton module avec cooc, count, contexte, predictionRegister, predictionWord

app = FastAPI(title="TLN API")

# CORS pour ton front (React, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # à restreindre en prod si tu veux
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
#   Endpoints matrices
# ----------------------------

@app.post("/TLN/cooc", response_model=tln.corpusToMatrixOut)
def cooc_endpoint(payload: tln.corpusToMatrixIn):
    if payload.text is None:
        raise HTTPException(status_code=400, detail="Field 'text' is required")
    try:
        return tln.cooc(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/TLN/count", response_model=tln.corpusToMatrixOut)
def count_endpoint(payload: tln.corpusToMatrixIn):
    if payload.text is None:
        raise HTTPException(status_code=400, detail="Field 'text' is required")
    try:
        return tln.count(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/TLN/contexte", response_model=tln.corpusToMatrixOut)
def contexte_endpoint(payload: tln.corpusToMatrixIn):
    if payload.text is None:
        raise HTTPException(status_code=400, detail="Field 'text' is required")
    try:
        return tln.contexte(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------
#   Endpoints prédiction
# ----------------------------

# Enregistre un modèle (ngrams pour l’instant) à partir de data
@app.post("/TLN/prediction/register")
def prediction_register_endpoint(payload: tln.matrixPredictionRegisterIn):
    try:
        ok = tln.predictionRegister(payload)
        return {"success": ok}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Utilise le modèle enregistré pour prédire le prochain mot
@app.post("/TLN/prediction/get", response_model=tln.matrixPredictionGetOut)
def prediction_get_endpoint(payload: tln.matrixPredictionGetIn):
    if payload.text is None:
        raise HTTPException(status_code=400, detail="Field 'text' is required")
    try:
        return tln.predictionWord(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

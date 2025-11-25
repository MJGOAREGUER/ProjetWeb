from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import TLN as tln

app = FastAPI(title="TLN API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       
    allow_methods=["*"],
    allow_headers=["*"],
)

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

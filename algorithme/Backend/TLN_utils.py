import re
from tkinter import SEPARATOR
from typing import List, Literal
from pydantic import BaseModel


TOKEN_RE = re.compile(r"(?:<\w+>)|(?:\b\w+\b)", re.UNICODE)

STOP = {
    "le","la","les","un","une","des","de","du","au","aux","et","en","dans","pour","par",
    "avec","sur","sous","ce","ces","cet","cette","qui","que","quoi","dont","où","mais",
    "ou","donc","or","ni","car","à","au","aux","se","sa","son","ses","leurs","leur",
    "the","a","an","of","to","in","on","for","by","and","or","not","is","are","be","as",
}

SEPARATOR_TOKEN = "<n>"
START_TOKEN = "<s>"
END_TOKEN = "<e>"

def tokenize(text: str, lowercase=True, remove_stopwords=True):
    if lowercase:
        text = text.lower()
    text = text.replace("\n\n---\n\n", "<n>")
    tokens = TOKEN_RE.findall(text)
    if remove_stopwords:
        tokens = [token for token in tokens if token not in STOP and not token.isnumeric()]
    return tokens
#!/usr/bin/env python3
"""Split a MTEB-style dataset (corpus.jsonl, queries.jsonl) into translation batches.
Usage: make_batches.py <raw_dir> <work_dir> [max_words] [max_items] [--context] [--context-chars N] [--queries-only]
--context: attach to each query the English corpus texts it is relevant to (from qrels) as "context" (not for translation).
"""
import json, sys, os
raw, work = sys.argv[1], sys.argv[2]
args = [a for a in sys.argv[3:] if not a.startswith("--") and (sys.argv[sys.argv.index(a)-1] != "--context-chars")]
max_words = int(args[0]) if len(args) > 0 else 2200
max_items = int(args[1]) if len(args) > 1 else 10**9
with_context = "--context" in sys.argv
ctx_chars = int(sys.argv[sys.argv.index("--context-chars") + 1]) if "--context-chars" in sys.argv else None
queries_only = "--queries-only" in sys.argv
os.makedirs(f"{work}/batches", exist_ok=True)

def load(p):
    return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]

def batches(items, kind):
    out, cur, words = [], [], 0
    for it in items:
        w = len((it.get("text") or "").split()) + len((it.get("title") or "").split())
        if cur and (words + w > max_words or len(cur) >= max_items):
            out.append(cur); cur, words = [], 0
        cur.append(it); words += w
    if cur: out.append(cur)
    manifest = []
    for i, b in enumerate(out, 1):
        name = f"{kind}_{i:02d}"
        src = f"{work}/batches/{name}.src.json"
        recs = [{"_id": x["_id"], "title": x.get("title", ""), "text": x["text"]} for x in b]
        if kind == "queries" and with_context:
            for r in recs: r["context"] = [(corpus_by_id[c]["text"][:ctx_chars] if ctx_chars else corpus_by_id[c]["text"]) for c in rel.get(r["_id"], []) if c in corpus_by_id]
        json.dump(recs,
                  open(src, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        manifest.append({"name": name, "kind": kind, "src": src,
                         "out": f"{work}/batches/{name}.mne.json",
                         "review": f"{work}/batches/{name}.review.json",
                         "final": f"{work}/batches/{name}.final.json",
                         "ids": [x["_id"] for x in b],
                         "words": sum(len(x["text"].split()) for x in b)})
    return manifest

corpus = load(f"{raw}/corpus.jsonl"); corpus_by_id = {d["_id"]: d for d in corpus}
rel = {}
for r in load(f"{raw}/qrels/test.jsonl"):
    if r.get("score", 1) > 0: rel.setdefault(r["query-id"], []).append(r["corpus-id"])
m = ([] if queries_only else batches(corpus, "corpus")) + batches(load(f"{raw}/queries.jsonl"), "queries")
if queries_only and os.path.exists(f"{work}/manifest.json"):
    m = [x for x in json.load(open(f"{work}/manifest.json", encoding="utf-8")) if x["kind"] == "corpus"] + m
json.dump(m, open(f"{work}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(m)} batches:", [(x["name"], len(x["ids"]), x["words"]) for x in m])

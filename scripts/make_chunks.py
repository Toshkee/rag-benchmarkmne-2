#!/usr/bin/env python3
"""Split long corpus documents into translation chunks at paragraph boundaries and group them into batches.
Usage: make_chunks.py <raw_dir> <work_dir> [max_words_per_chunk] [head_words]
Chunk items get _id "<docid>#<k>" (unique), plus n_chunks and, for k>0, "head" (start of the document, context only).
Batches hold consecutive chunks (same document first) up to max_words. Writes manifest.json like make_batches.py."""
import json, sys, os
raw, work = sys.argv[1], sys.argv[2]
max_words = int(sys.argv[3]) if len(sys.argv) > 3 else 3000
head_words = int(sys.argv[4]) if len(sys.argv) > 4 else 120
os.makedirs(f"{work}/batches", exist_ok=True)
docs = [json.loads(l) for l in open(f"{raw}/corpus.jsonl", encoding="utf-8") if l.strip()]

import re
SENT = re.compile(r"(?<=[.!?;:])\s+(?=[A-ZÄÖÜ0-9„\"(§])")

def split_units(text):
    """Yield (unit_text, sep_before) so that ''.join(sep+unit) == text. Paragraph boundaries first;
    paragraphs longer than max_words are split at sentence boundaries (sep = the whitespace matched)."""
    units = []
    paras = text.split("\n")
    for i, p in enumerate(paras):
        sep = "\n" if i > 0 else ""
        if len(p.split()) <= max_words:
            units.append((p, sep)); continue
        pos = 0
        for m in SENT.finditer(p):
            units.append((p[pos:m.start()], sep)); sep = m.group(0); pos = m.end()
        units.append((p[pos:], sep))
    return units

def chunk_doc(d):
    units = split_units(d["text"])
    chunks, cur, words, cur_sep = [], [], 0, ""
    for (u, sep) in units:
        w = len(u.split())
        if cur and words + w > max_words:
            chunks.append(("".join(cur), cur_sep)); cur, words = [], 0; cur_sep = sep; sep = ""
        if cur: cur.append(sep)
        cur.append(u); words += w
    chunks.append(("".join(cur), cur_sep))
    head = " ".join(d["text"].split()[:head_words])
    out = []
    for k, (t, sep) in enumerate(chunks):
        it = {"_id": f"{d['_id']}#{k}", "title": "", "text": t, "n_chunks": len(chunks), "sep_before": sep}
        if k > 0: it["head"] = head
        out.append(it)
    assert "".join(c["sep_before"] + c["text"] for c in out) == d["text"], d["_id"]
    return out

items = [c for d in docs for c in chunk_doc(d)]
batches, cur, words = [], [], 0
for it in items:
    w = len(it["text"].split())
    if cur and words + w > max_words:
        batches.append(cur); cur, words = [], 0
    cur.append(it); words += w
if cur: batches.append(cur)
manifest = []
for i, b in enumerate(batches, 1):
    name = f"corpus_{i:03d}"
    src = f"{work}/batches/{name}.src.json"
    json.dump(b, open(src, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    manifest.append({"name": name, "kind": "corpus", "src": src, "out": f"{work}/batches/{name}.mne.json",
                     "review": f"{work}/batches/{name}.review.json", "final": f"{work}/batches/{name}.final.json",
                     "ids": [x["_id"] for x in b], "words": sum(len(x["text"].split()) for x in b)})
json.dump(manifest, open(f"{work}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(docs)} docs -> {len(items)} chunks -> {len(batches)} batches; words/batch min {min(m['words'] for m in manifest)} max {max(m['words'] for m in manifest)}")

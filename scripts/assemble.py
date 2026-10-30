#!/usr/bin/env python3
"""Assemble translated batches into an MTEB-style dataset folder.
Usage: assemble.py <raw_dir> <work_dir> <out_dir> [--naslov] [--queries-from <mne_queries.jsonl>]
Chunked corpora (ids "<docid>#<k>") are re-joined with "\n" in chunk order.   (--naslov: corpus items must have "Naslov:/Opis:" format, AILA only)
Uses <name>.v2.json, else .final.json, else .mne.json. Copies qrels unchanged.
Prints a verification report (ids, token preservation, word ratios, ekavica/croatisms, format)."""
import json, sys, os, re, shutil, statistics
raw, work, out = sys.argv[1], sys.argv[2], sys.argv[3]
check_naslov = "--naslov" in sys.argv
qfrom = sys.argv[sys.argv.index("--queries-from") + 1] if "--queries-from" in sys.argv else None
os.makedirs(f"{out}/qrels", exist_ok=True)
TOK = re.compile(r"\b(P\d+|A\d+|S\d+|W\d+|Section S|Rs\.)")
EKAV = re.compile(r"\b(delo|dela|vreme|mesto|rešenje|svedok|ovde|gde|dve|posle|sledeći|čovek|lekar)\b", re.I)
CRO = re.compile(r"\b(tužitelj\w*|odvjetni\w*|sudac|suca|pravomoćn\w*|tjedan)\b", re.I)
ENG = re.compile(r"\b(the|which|shall|whoever|appellant|respondent|section)\b")

def load(p): return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]
manifest = json.load(open(f"{work}/manifest.json", encoding="utf-8"))
problems = []; ratios = []
for kind, fname in (("corpus", "corpus.jsonl"), ("queries", "queries.jsonl")):
    src = {d["_id"]: d for d in load(f"{raw}/{fname}")}
    tr = {}
    for m in manifest:
        if m["kind"] != kind: continue
        v2 = m["final"].replace(".final.json", ".v2.json")
        p = v2 if os.path.exists(v2) else (m["final"] if os.path.exists(m["final"]) else m["out"])
        if not os.path.exists(p): problems.append(f"MISSING batch file {m['name']}"); continue
        for it in json.load(open(p, encoding="utf-8")):
            tr[it["_id"]] = it["text"]
    if kind == "queries" and qfrom:
        tr = {d["_id"]: d["text"] for d in load(qfrom)}
    seps = {}
    for m in manifest:
        if m["kind"] != kind or not os.path.exists(m["src"]): continue
        for it in json.load(open(m["src"], encoding="utf-8")):
            if "#" in it["_id"]: seps[it["_id"]] = it.get("sep_before", "\n" if not it["_id"].endswith("#0") else "")
    chunked = {}
    for k in list(tr):
        if "#" in k:
            base, n = k.rsplit("#", 1); chunked.setdefault(base, {})[int(n)] = tr.pop(k)
    for base, parts in chunked.items():
        ks = sorted(parts)
        if ks != list(range(len(ks))): problems.append(f"{kind} {base}: missing chunks {sorted(set(range(ks[-1]+1)) - set(ks))}")
        tr[base] = "".join(seps.get(f"{base}#{i}", "\n" if i > 0 else "") + parts[i] for i in ks)
    missing = [i for i in src if i not in tr]
    extra = [i for i in tr if i not in src]
    if missing: problems.append(f"{kind}: {len(missing)} missing ids: {missing[:5]}")
    if extra: problems.append(f"{kind}: {len(extra)} unknown ids: {extra[:5]}")
    with open(f"{out}/{fname}", "w", encoding="utf-8") as f:
        for i, d in src.items():
            if i not in tr: continue
            t = tr[i]
            if sorted(TOK.findall(d["text"])) != sorted(TOK.findall(t)):
                problems.append(f"{kind} {i}: token mismatch {sorted(set(TOK.findall(d['text'])))} vs {sorted(set(TOK.findall(t)))}")
            r = len(t.split()) / max(1, len(d["text"].split())); ratios.append(r)
            if not 0.7 <= r <= 1.4: problems.append(f"{kind} {i}: word ratio {r:.2f}")
            for rx, nm in ((EKAV, "ekavica"), (CRO, "croatism"), (ENG, "english")):
                hits = rx.findall(t)
                if hits: problems.append(f"{kind} {i}: {nm} {sorted(set(h if isinstance(h,str) else h[0] for h in hits))[:5]}")
            if d["text"].count("\n") != t.count("\n"):
                problems.append(f"{kind} {i}: newline count {d['text'].count(chr(10))} vs {t.count(chr(10))}")
            if check_naslov and kind == "corpus" and not (t.startswith("Naslov:") and "Opis:" in t):
                problems.append(f"{kind} {i}: format (expected 'Naslov: ...\\nOpis: ...')")
            rec = {"_id": i, "title": d.get("title", ""), "text": t} if kind == "corpus" else {"_id": i, "text": t}
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    print(f"{kind}: {len(src)} source, {len(tr)} translated")
shutil.copy(f"{raw}/qrels/test.jsonl", f"{out}/qrels/test.jsonl")
print(f"word ratio median {statistics.median(ratios):.2f}, min {min(ratios):.2f}, max {max(ratios):.2f}")
print(f"{len(problems)} problems"); [print("  -", p) for p in problems]

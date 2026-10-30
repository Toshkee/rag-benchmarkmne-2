#!/usr/bin/env python3
"""Make a side-by-side HTML review page (source vs translation) for a translated dataset.
Usage: side_by_side.py <raw_dir> <mne_dir> <out_html> [max_items_per_split]"""
import json, sys, html
raw, mne, out = sys.argv[1], sys.argv[2], sys.argv[3]
limit = int(sys.argv[4]) if len(sys.argv) > 4 else 10**9
def load(p): return {d["_id"]: d for d in (json.loads(l) for l in open(p, encoding="utf-8") if l.strip())}
rows = []
for kind in ("corpus", "queries"):
    s, t = load(f"{raw}/{kind}.jsonl"), load(f"{mne}/{kind}.jsonl")
    rows.append(f"<h2>{kind} ({len(t)}/{len(s)})</h2>")
    for n, (i, d) in enumerate(s.items()):
        if n >= limit: break
        tr = t.get(i, {}).get("text", "<i>(nije prevedeno)</i>")
        rows.append(f'<div class="item"><div class="id">{kind} · {html.escape(i)}</div><div class="cols">'
                    f'<pre>{html.escape(d["text"])}</pre><pre>{html.escape(tr)}</pre></div></div>')
css = ("body{font-family:system-ui;margin:16px;max-width:1500px}.cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}"
       "pre{white-space:pre-wrap;font:14px/1.45 Georgia,serif;background:#f6f6f6;padding:10px;border-radius:6px;margin:0}"
       ".id{font:12px monospace;color:#666;margin:18px 0 4px}h2{margin-top:32px}")
open(out, "w", encoding="utf-8").write(f'<!doctype html><meta charset="utf-8"><title>Pregled prevoda</title><style>{css}</style>'
                                       f'<h1>Uporedni pregled: izvor (lijevo) / prevod (desno)</h1>{"".join(rows)}')
print("written", out)

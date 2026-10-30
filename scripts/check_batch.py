"""Samoprovjera batcha (tačka 6 uputstva). Upotreba: python3 -I check_batch.py <batches_dir> <name> [<name>...]
Izlaz: po batchu 'OK' ili spisak problema. Exit 0 ako svi prolaze."""
import json, re, sys
from collections import Counter

EKAV = re.compile(r"\b(delo|dela|vreme|mesto|rešenje|svedok|ovde|gde|dve|posle|sledeći|čovek|lekar|sprečav\w*)\b", re.I)
HRV = re.compile(r"(tužitelj|odvjetnik|sudac|pravomoćn|tjedan|uvjet|\bosob(a|e|i|u|om|ama)\b)", re.I)
NISU = re.compile(r"\b(nisu|niste|nismo)\b", re.I)
GER = re.compile(r"\b(der|die|das|und|nicht|ist|wird|werden|ein|eine|einer|mit|von|zu|den|dem|des|auf|für|bei|nach|oder|wenn|sich|dass|auch|sind|wurde|hat|haben)\b")


def words(s):
    return len(s.split())


def check(d, name):
    probs = []
    try:
        src = json.load(open(f"{d}/{name}.src.json", encoding="utf-8"))
        out = json.load(open(f"{d}/{name}.mne.json", encoding="utf-8"))
    except Exception as e:
        return [f"ne mogu učitati: {e}"]
    if [x["_id"] for x in src] != [x.get("_id") for x in out]:
        return [f"ID-ovi/redoslijed različiti: src={len(src)} out={len(out)}"]
    is_q = name.startswith("queries")
    for s, o in zip(src, out):
        i = s["_id"]
        st, ot = s["text"], o.get("text", "")
        if not isinstance(ot, str) or not ot.strip():
            probs.append(f"{i}: prazan tekst"); continue
        if st.count("\n") != ot.count("\n"):
            probs.append(f"{i}: novi redovi {st.count(chr(10))} vs {ot.count(chr(10))}")
        if ot.count("\n") and not is_q:
            pass
        cs = Counter(str(int(x)) for x in re.findall(r"\d+", st))
        co = Counter(str(int(x)) for x in re.findall(r"\d+", ot))
        if cs != co:
            miss, extra = cs - co, co - cs
            # dozvoljeno: nedostaju samo brojevi mjeseca 1-12 (datum 1.7.2013 -> 1. jula 2013.)
            hard_miss = {k: v for k, v in miss.items() if int(k) > 12}
            if hard_miss or extra:
                probs.append(f"{i}: brojevi izvor-prevod={dict(miss)} prevod-izvor={dict(extra)}")
        r = words(ot) / max(1, words(st))
        if not (0.8 <= r <= 1.4):
            probs.append(f"{i}: odnos riječi {r:.2f} ({words(st)}->{words(ot)})")
        for rx, lbl in ((EKAV, "ekavica"), (HRV, "hrvatski"), (NISU, "nisu/niste/nismo")):
            m = rx.findall(ot)
            if m:
                probs.append(f"{i}: {lbl}: {sorted(set(x if isinstance(x,str) else x[0] for x in m))[:6]}")
        g = GER.findall(ot)
        if len(g) >= 3:
            print(f"    UPOZORENJE {i}: njemačke riječi ({len(g)}): {Counter(g).most_common(5)} "
                  "- u redu ako su citati literature/imena sudova na njemačkom, inače prevedi")
        if o.get("title", "") != "":
            probs.append(f"{i}: title nije prazan")
    return probs


if __name__ == "__main__":
    d, names = sys.argv[1], sys.argv[2:]
    bad = 0
    for n in names:
        p = check(d, n)
        print(f"{n}: " + ("OK" if not p else "PROBLEMI"))
        for x in p:
            print("   ", x)
        bad += bool(p)
    sys.exit(1 if bad else 0)

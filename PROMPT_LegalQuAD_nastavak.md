# Zadatak: dovršiti prevod dataseta LegalQuAD (njemački → crnogorski) i spakovati ga za testiranje

Ti nastavljaš posao koji je počet u drugoj sesiji. Radiš u folderu `rag-benchmark-mne/` (raspakovan iz ZIP-a). Cilj je
RAG benchmark (NDCG@10) na crnogorskom/srpskom (ijekavica), pa prevod mora biti potpun, vjeran i terminološki dosljedan,
u registru propisa i presuda Crne Gore.

## Šta već postoji
- `style/STYLE_GUIDE.md` — jezička norma i glosari. Za ovaj dataset su mjerodavni **dio 10** (njemačke sudske odluke),
  **dio 1** (norma) i **dio 6** (dopune, npr. „nijesu“, ne „nisu“). Pročitaj ih cijele prije rada.
- `data/raw/LegalQuAD/` — originalni MTEB fajlovi (`corpus.jsonl`, `queries.jsonl`, `qrels/test.jsonl`).
- `work/LegalQuAD/batches/` — 278 izvornih batcheva: `corpus_001.src.json` … `corpus_270.src.json` (dijelovi presuda) i
  `queries_01.src.json` … `queries_08.src.json` (pitanja). Svaki je JSON niz objekata `{_id, title, text, ...}`.
  - Korpus itemi su **dijelovi** dokumenata: `_id` je oblika `docid#k`, `n_chunks` je ukupan broj dijelova, `sep_before`
    je separator koji se **ne prevodi i ne upisuje u tekst**, a za k>0 polje `head` je početak presude **samo kao
    kontekst** (ko je tužilac, ko tuženi, koji sud) — ne prevodi se.
  - Upit itemi imaju polje `context` (početak presude na njemačkom) **samo kao kontekst** — ne prevodi se.
- `work/LegalQuAD/batches/corpus_001.mne.json` … `corpus_099.mne.json` — **već prevedeni batchevi (99 od 270). NE prevodi
  ih ponovo.** Nedostaju `corpus_100` … `corpus_270` i `queries_01` … `queries_08`.
- `work/LegalQuAD/manifest.json` — spisak batcheva sa putanjama.
- `scripts/assemble.py` — sklapa batcheve (spaja dijelove nazad u cijele dokumente preko `sep_before`) u
  `data/mne/LegalQuAD/` i provjerava ID-ove, brojeve, novi redove, ekavicu.
- `scripts/side_by_side.py` — HTML uporedni pregled izvor/prevod.
- `scripts/workflow_translate.js` — skripta za Claude Code Workflow alat (opciono, vidi dolje).

## Režim rada (odluka vlasnika projekta)
**Samo prevod, bez recenzije, ispravki i audita. Model: Sonnet (effort high).** Za svaki batch jedan agent/prolaz.
Ovo je jedini prolaz, pa prevod mora biti pažljiv i sa obaveznom samoprovjerom.

## Uputstvo za prevod jednog batcha (primijeni na svaki nedostajući batch)
Ti si stručni pravni prevodilac sa njemačkog na crnogorski (ijekavica, latinica) koji odlično poznaje jezik propisa i
presuda Crne Gore. Prevodiš sam, bez eksternih alata za mašinsko prevođenje.

1. Pročitaj `work/LegalQuAD/batches/<ime>.src.json`.
2. KORPUS: tekst presude u izvoru NEMA preloma reda — odjeljci „Tenor“, „Tatbestand“, „Entscheidungsgründe“ i
   numerisani pasusi (1, 2, 3…) stoje slijepljeni u jednom redu. Prevod ZADRŽAVA tu strukturu: oznake odjeljaka
   prevedene (Tenor → Izreka, Tatbestand → Činjenično stanje, Entscheidungsgründe → Obrazloženje, Gründe → Razlozi), isti
   brojevi pasusa na istim mjestima, BEZ dodavanja novih redova. Registar: obrazloženje presude.
   UPITI: kratko pitanje → prirodno pitanje na crnogorskom, isti registar, isti datumi („2. aprila 2013. godine“), brojevi
   predmeta i nazivi sudova po dijelu 10. Pitanje ostaje pitanje, iste dužine kao izvor.
3. Prevedi `text` SVAKOG itema u potpunosti. Ništa ne izostavljaj, ne sažimaj, ne dodaj. Strogo primijeni glosar iz
   dijela 10 (Kläger → tužilac, Beklagte → tuženi/tužena, Revision → revizija, Berufung → žalba, Urteil → presuda,
   Beschluss → rješenje, Landesarbeitsgericht → Zemaljski radni sud, Bundesarbeitsgericht → Savezni radni sud (BAG),
   Bundesgerichtshof → Savezni vrhovni sud (BGH) …). Dosljednost unutar presude je obavezna; za dijelove k>0 uskladi
   termine sa `head`.
4. Doslovno ostaju: brojevi predmeta („11 Sa 2346/12“, „9 AZR 529/10“), citati (BGHZ, NJW, Rn.), skraćenice zakona (BGB,
   ZPO, TVöD, BUrlG, SGB), svi brojevi i iznosi. „§ 3 Abs. 2 Satz 1 Nr. 4“ → „član 3 stav 2 rečenica 1 tačka 4“.
   Anonimizovana imena („Herr K.“, „die Klägerin“) ostaju. Datumi u crnogorskom obliku: „2. April 2013“ → „2. aprila
   2013. godine“. Navodnici „…“.
5. Upiši rezultat kao JSON niz `[{"_id": "<isti _id, sa #k>", "title": "", "text": "<prevod>"}]` u
   `work/LegalQuAD/batches/<ime>.mne.json` (UTF-8, dijakritici kao pravi znakovi, ne `\u` escape; `ensure_ascii=False`).
6. SAMOPROVJERA (python3 -I), obavezno: isti skup i redoslijed `_id`-ova; za svaki item broj novih redova isti kao izvor
   (za korpus 0); multiskup brojeva `\d+` isti kao u izvoru (dozvoljena razlika samo zbog formata datuma, npr.
   „2. April 2013“ → „2. aprila 2013.“); odnos broja riječi prevod/izvor između 0,8 i 1,4 (njemački je zbijen jezik, prevod
   je obično duži); nema ekavskih oblika (`\b(delo|dela|vreme|mesto|rešenje|svedok|ovde|gde|dve|posle|sledeći|čovek|lekar|
   sprečav\w*|lijek\w*)\b`) ni hrvatskih (tužitelj, odvjetnik, sudac, pravomoćn, tjedan, uvjet, osoba); nema „nisu/niste/
   nismo“ (treba „nijesu/nijeste/nijesmo“); nema ostataka njemačkih rečenica. Ako nešto ne prolazi, ispravi i ponovi.
7. Ako `<ime>.mne.json` VEĆ POSTOJI i prolazi samoprovjeru iz tačke 6, ne prevodi ponovo — preskoči batch.

## Redoslijed i obim
- Nedostaju: `corpus_100` … `corpus_270` (171 batch, ~2.500 riječi svaki) i `queries_01` … `queries_08`.
- Možeš ih raditi paralelno kroz subagente (Sonnet, effort high), po jedan batch po agentu. Ako imaš Claude Code Workflow
  alat, možeš koristiti `scripts/workflow_translate.js` sa argumentima:
  `{"work": "<apsolutna putanja>/rag-benchmark-mne/work/LegalQuAD", "style": "<apsolutna putanja>/rag-benchmark-mne/style",
   "corpus": 270, "corpus_from": 100, "pad": 3, "queries": 8, "translate_only": true, "skip_audit": true,
   "translate_model": "sonnet", "translate_effort": "high", "src_lang": "njemačkog", "src_lang_nom": "njemački",
   "naslov_format": false, "corpus_desc": "<tekst tačke 2 za korpus>", "queries_desc": "<tekst tačke 2 za upite>",
   "extra_rules": "<tačke 3, 4 i 7>", "review_glossary_hint": "", "audit_terms": ""}`.
  Taj alat sam ponavlja pale agente kad se nastavi sa `resumeFromRunId`.

## Kad su svi batchevi prevedeni
```bash
python3 -I scripts/assemble.py data/raw/LegalQuAD work/LegalQuAD data/mne/LegalQuAD
python3 -I scripts/side_by_side.py data/raw/LegalQuAD data/mne/LegalQuAD data/mne/LegalQuAD/pregled.html
```
`assemble.py` mora ispisati `corpus: 200 source, 200 translated` i `queries: 200 source, 200 translated`; prijavljeni
„problemi“ tipa odnosa dužine kratkih upita pregledaj ručno, a bilo koju razliku u broju novih redova ili ID-ova ispravi.
Rezultat za testiranje je folder `data/mne/LegalQuAD/` (`corpus.jsonl`, `queries.jsonl`, `qrels/test.jsonl` kopiran bez
izmjena, `pregled.html`). Na kraju javi: koliko batcheva je prevedeno, rezultat provjere i šta je ostalo nejasno.

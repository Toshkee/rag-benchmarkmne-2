# RAG benchmark za crnogorski/srpski — prevod pravnih MTEB datasetova

Cilj: izmjeriti kvalitet open-source embedding modela (NDCG@10) na našem jeziku, na pravnim datasetovima
koje koristi Voyage AI u članku o `voyage-law-2` (2024). Svi datasetovi su MTEB retrieval datasetovi:
`corpus.jsonl` (`_id`, `title`, `text`), `queries.jsonl` (`_id`, `text`), `qrels/test.jsonl` (`query-id`, `corpus-id`, `score`).

## Datasetovi iz članka (HuggingFace `mteb/*`)

| dataset | korpus | upiti | jezik izvora | riječi (korpus / upiti) | status |
|---|---|---|---|---|---|
| AILA_statutes | 82 | 50 | en | 27.7k / 25.9k | **preveden** (29. 10. 2026) — čeka provjeru kvaliteta |
| AILA_casedocs | 186 | 50 (isti kao statutes) | en | 862k / 25.9k | **preveden** (30. 10. 2026), recenzije samo za 1. polovinu, ispravke i audit nijesu rađeni |
| legal_summarization | 438 | 284 | en | 44.9k / 5.1k | **preveden** (29. 10. 2026) — čeka provjeru kvaliteta |
| legalbench_consumer_contracts_qa | 154 | 396 | en | 68.4k / 6.2k | **preveden** (29. 10. 2026) — čeka provjeru kvaliteta |
| legalbench_corporate_lobbying | 319 | 340 | en | 53.6k / 9.2k | **preveden** (29. 10. 2026) — čeka provjeru kvaliteta |
| LegalQuAD | 200 | 200 | de | 523k / 1.9k | **preveden** (30. 10. 2026) — Sonnet 5.5, samo prevod, bez recenzije, ispravki i audita; automatska samoprovjera prošla (`scripts/check_batch.py`) |
| LeCaRDv2 | 3795 | 159 | zh | 27,4M znakova / 0,5M znakova | ne radi se |
| GerDaLIR | 131.445 | 12.298 | de | ~970 MB parquet / 12,6M znakova | ne radi se |

## Struktura
- `data/raw/<dataset>/` — originalni fajlovi sa HuggingFace (nepromijenjeni).
- `data/mne/<dataset>/` — prevedeni `corpus.jsonl` i `queries.jsonl`; `qrels/test.jsonl` je kopiran bez izmjena
  (ID-ovi su isti, pa se NDCG@10 računa identično kao na originalu).
- `style/STYLE_GUIDE.md` — jezička norma, glosar i pravila (ijekavica, registar propisa CG).
- `style/primjeri_*.txt` — izvodi iz Krivičnog zakonika CG (PDF sa gov.me) i Ustava CG kao uzor registra.
- `work/<dataset>/batches/` — radni fajlovi po batchu: `.src.json` (izvor), `.mne.json` (prevod Opus 5.5),
  `.review.json` (recenzija Sonnet 5.5), `.final.json` (ispravljena verzija Opus 5.5).
- `scripts/make_batches.py` — dijeli dataset na batcheve (~2200 riječi).
- `scripts/assemble.py` — sklapa batcheve u `data/mne/<dataset>/` i provjerava ID-ove, tokene, odnos dužine, ekavicu.
- `scripts/side_by_side.py` — HTML stranica za uporedni pregled izvor/prevod.

## Proces prevoda (workflow)
1. **Prevod** — Opus 5.5 (effort high), batch po batch, uz stilski vodič i glosar.
2. **Revizija** — Sonnet 5.5 (effort medium): automatske provjere (tokeni P1/A1/Section S/Rs., brojevi, ID-ovi,
   odnos dužine) + ručna provjera rečenicu po rečenicu; nalazi su `blocking` ili `minor`.
3. **Ispravke** — Opus 5.5 (high) primjenjuje opravdane nalaze i piše `.final.json`.
4. **Audit** — Sonnet 5.5 (medium) provjerava terminološku dosljednost preko svih batcheva.

## Napomene o konvencijama
- Anonimizacijski tokeni iz AILA (P1, A1, Section S, Rs. iznosi) ostaju doslovno isti.
- `Title:`/`Desc:` u AILA korpusu → `Naslov:`/`Opis:`.
- Indijske institucije: Supreme Court → Vrhovni sud, High Court → Visoki sud, Section → član, sub-section → stav.

## Napomene po datasetu
### legal_summarization
- Izvor je normalizovan (mala slova, bez apostrofa i dijela interpunkcije). Prevod je u **normalnoj ortografiji**;
  ako se želi stroga paralela sa izvorom, može se naknadno spustiti u mala slova skriptom.
- Korpus (odredbe uslova korišćenja) je u ugovornom registru, upiti (laički sažeci) ostaju razgovorni — oba sa „vi“.
- Pri prevodu upita prevodilac je kao kontekst dobijao odredbu iz qrels-a (nije prevođena, samo za značenje).
- Nije rađen završni pass ujednačavanja (odluka korisnika, radi brzine); glosar iz dijelova 6 i 7 primijenjen od početka.

### legalbench_consumer_contracts_qa
- Korpus: odjeljci uslova korišćenja (Google, YouTube, ...) sa naslovima i pasusima; novi redovi i naslovi su očuvani.
  Izvor je u normalnoj ortografiji, ali su apostrofi izbačeni („Ive“, „users“, „partys“) — prevod ih ne imitira.
- Upiti: pitanja korisnika u prvom licu, često u paru laičko/formalno. Registar svakog pitanja se čuva (laičko ostaje
  laičko, formalno ostaje formalno). Svaki upit je prevodiocu stigao sa odjeljkom na koji se odnosi kao kontekst.

### legalbench_corporate_lobbying
- Korpus: sažeci američkih predloga zakona (prvi red kratki naziv, zatim pasusi); upiti: zvanični dugi naslovi
  („A bill to...“). Registar: obrazloženje predloga zakona (dio 8 vodiča), „Predlog zakona kojim se...“.
- Kratki nazivi zakona se prevode; skraćenice/bekronimi (ANTIQUITIES Act) ostaju u zagradi. Skraćenice agencija
  (EPA, FDA, BLM...) ostaju uz prevedeni naziv.
- Svaki upit je prevodiocu stigao sa sažetkom na koji se odnosi kao kontekst.

### AILA_casedocs
- Korpus: 186 punih presuda Vrhovnog suda Indije (do 40k riječi). Dokumenti su podijeljeni na dijelove do ~3.000 riječi
  po granicama pasusa (`scripts/make_chunks.py`, `_id` oblika „docid#k“); dijelovi dobijaju početak presude kao kontekst.
  `assemble.py` spaja dijelove nazad u cijele dokumente.
- Upiti su identični upitima AILA_statutes, pa je prevod preuzet odatle (`--queries-from`).
- Zbog limita od 1.000 agenata po workflow-u, korpus je prevođen u dva paralelna workflow-a (prva i druga polovina batcheva).

### LegalQuAD (njemački)
- Korpus: 200 presuda njemačkih sudova bez ijednog preloma reda (odjeljci Tenor/Tatbestand/Entscheidungsgründe slijepljeni).
  Dijeljenje na dijelove ide po granicama rečenica (`make_chunks.py`, polje `sep_before` čuva tačan separator), pa
  `assemble.py` rekonstruiše dokument znak po znak. Registar i glosar: dio 10 vodiča.
- Upiti: 200 kratkih pitanja; kontekst prevodiocu je prvih 1.500 znakova presude na koju se pitanje odnosi.
- Preveden u režimu „samo prevod“ (Sonnet 5.5, effort high, jedan agent po batchu), bez recenzije, ispravki i audita;
  svaki batch je prošao `scripts/check_batch.py` (ID-ovi, novi redovi, brojevi, odnos dužine, ekavica/hrvatizmi, „nijesu“).
  Poznata odstupanja od provjere brojeva su greške u izvoru: godina slijepljena s brojem pasusa/fusnote
  (`corpus_058`: „20155“, `corpus_176`: „199644“, „199954“); prevod ih vjerno razdvaja. Engleski citati patenata u presudama
  i naslovi njemačke literature u fusnotama ostaju doslovno. „Rs. C-…“ (Rechtssache) → „predmet C-…“.
- `manifest.json` ima apsolutne putanje sa originalnog računara; pri ponovnom sklapanju (`assemble.py`) ispravite putanje u
  privremenoj kopiji manifesta (korijen `.../rag-benchmark-mne/` zamijeniti stvarnim).

### Obim preostalih datasetova (izmjereno 30. 10. 2026)
| dataset | korpus | upiti | procjena posla u odnosu na AILA_casedocs (354 batcheva, ~1.060 agenata) |
|---|---|---|---|
| LegalQuAD | 200 presuda, ~520k riječi | 200 pitanja | ~0,8× (278 batcheva, ~840 agenata) |
| LeCaRDv2 | 3.795 presuda, 27,4M kineskih znakova | 159 dugih opisa (0,5M znakova) | ~15–20× (≈6.000–7.000 batcheva, ~20.000 agenata) |
| GerDaLIR | 131.445 dokumenata (qrels referencira 10.025) | 12.298 upita (12,6M znakova) | >100× (stotine miliona znakova); u cjelini nije izvodljivo |
Moguće opcije za GerDaLIR: prevesti samo 10.025 dokumenata iz qrels-a + nasumični negativni pool, ili uzorak upita sa
njihovim relevantnim dokumentima + pool. Za LeCaRDv2: cijeli korpus je već pool kandidata (gotovo svaki dokument je
relevantan nekom upitu), pa uzorkovanje znači smanjenje broja upita.

export const meta = {
  name: 'translate-legal-dataset-mne',
  description: 'Prevod MTEB pravnog dataseta na crnogorski: Opus prevodi, Sonnet recenzira, Opus ispravlja, Sonnet audit',
  phases: [
    { title: 'Prevod', detail: 'Opus 5.5 (high) prevodi batch po batch', model: 'opus' },
    { title: 'Revizija', detail: 'Sonnet 5.5 (medium) provjerava potpunost, tokene, terminologiju', model: 'sonnet' },
    { title: 'Ispravke', detail: 'Opus 5.5 (high) primjenjuje opravdane ispravke', model: 'opus' },
    { title: 'Audit', detail: 'Sonnet 5.5 (medium) terminološka dosljednost preko svih batcheva', model: 'sonnet' },
  ],
}

const W = args.work
const STYLE = args.style
const names = []
const pad = args.pad || 2
for (let i = (args.corpus_from || 1); i <= args.corpus; i++) names.push(`corpus_${String(i).padStart(pad, '0')}`)
for (let i = 1; i <= args.queries; i++) names.push(`queries_${String(i).padStart(2, '0')}`)
const batches = names.map(n => ({
  name: n,
  kind: n.startsWith('corpus') ? 'corpus' : 'queries',
  src: `${W}/batches/${n}.src.json`,
  out: `${W}/batches/${n}.mne.json`,
  review: `${W}/batches/${n}.review.json`,
  final: `${W}/batches/${n}.final.json`,
}))

const GUIDE = `Stilski vodič (OBAVEZNO pročitati cijeli prije rada): "${STYLE}/STYLE_GUIDE.md"
Primjeri jezika propisa Crne Gore (pročitati): "${STYLE}/primjeri_krivicni_zakonik.txt" i "${STYLE}/primjeri_ustav.txt"
Putanje sadrže razmake — uvijek ih stavi pod navodnike u shell komandama. Fajlove čitaj alatom Read, piši alatom Write.`

const TRANSLATE_SCHEMA = {
  type: 'object',
  properties: {
    out_path: { type: 'string' },
    n_items: { type: 'number' },
    ids_done: { type: 'array', items: { type: 'string' } },
    self_check_passed: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['out_path', 'n_items', 'ids_done', 'self_check_passed'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    n_blocking: { type: 'number' },
    n_minor: { type: 'number' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          severity: { type: 'string', enum: ['blocking', 'minor'] },
          type: { type: 'string' },
          description: { type: 'string' },
          suggestion: { type: 'string' },
        },
        required: ['id', 'severity', 'type', 'description'],
      },
    },
    overall_quality: { type: 'string' },
  },
  required: ['n_blocking', 'n_minor', 'issues', 'overall_quality'],
}

const FIX_SCHEMA = {
  type: 'object',
  properties: {
    final_path: { type: 'string' },
    n_applied: { type: 'number' },
    n_rejected: { type: 'number' },
    notes: { type: 'string' },
  },
  required: ['final_path', 'n_applied', 'n_rejected'],
}

function translatePrompt(b) {
  const kindDesc = b.kind === 'corpus' ? args.corpus_desc : args.queries_desc
  return `Ti si stručni pravni prevodilac sa ${args.src_lang || 'engleskog'} na crnogorski (ijekavica, latinica) koji odlično poznaje jezik propisa Crne Gore. Prevodiš dataset za benchmark pretrage (RAG), pa prevod mora biti POTPUN, DOSLOVAN po značenju i terminološki DOSLJEDAN. Prevodiš sam, bez eksternih alata za mašinsko prevođenje.

${GUIDE}

ZADATAK — batch ${b.name}:
1. Pročitaj izvorni fajl: "${b.src}" (JSON niz objekata {_id, title, text}).
2. ${kindDesc}
3. Prevedi "text" SVAKOG objekta u potpunosti. Ništa ne izostavljaj, ne sažimaj, ne dodaj. Zadrži redoslijed rečenica, novi red, numeraciju i interpunkciju. Strogo primijeni glosar iz vodiča.
4. ${args.extra_rules || ''} Anonimizacijski tokeni (P1, P2, A1, A2, Section S, S1, W1, Rs., iznosi, brojevi članova, godine, brojevi predmeta) ostaju doslovno isti i pojavljuju se isti broj puta. Datume piši u obliku "9. februara 1961. godine". Lična imena ostaju u izvornom obliku.
5. Upiši rezultat kao JSON niz [{"_id": ..., "title": "", "text": "<prevod>"}] u fajl: "${b.out}" (UTF-8, ensure_ascii=false ekvivalent — dijakritici kao pravi znakovi, ne \\u escape).
6. SAMOPROVJERA (obavezno izvrši, python3 -I): za svaki _id uporedi broj pojavljivanja tokena po regexu \\b(P\\d+|A\\d+|S\\d+|W\\d+|Section S|Rs\\.)\\b i svih brojeva (\\d+) u izvoru i prevodu; provjeri da prevod ima sve _id-ove i da je odnos broja riječi prevod/izvor između 0.75 i 1.35 za svaki item; provjeri da nema ekavskih oblika (regex: \\b(delo|dela|vreme|mesto|rešenje|svedok|uslov|ovde|gde|dve|pre|posle|sledeći|čovek|lekar|ceo|cela)\\b — "pre" i "uslov" su u redu, zanemari ih) ni hrvatskih (tužitelj, odvjetnik, sudac, pravomoćn). Ako nešto ne prolazi, ispravi prevod i ponovi provjeru. Ako su razlike u brojevima opravdane (npr. datum "1-1-1956" → "1. 1. 1956."), objasni u notes.
7. Vrati strukturirani rezultat: out_path, n_items, ids_done, self_check_passed, notes (kratko: nedoumice, odluke o terminima koje nisu u glosaru).`
}

function reviewPrompt(b) {
  return `Ti si recenzent pravnih prevoda (${args.src_lang_nom || 'engleski'} → crnogorski, ijekavica). Procjenjuješ prevod jednog batcha za RAG benchmark. Ne prepisuj prevod — samo nađi probleme i predloži tačne ispravke.

${GUIDE}

Fajlovi batcha ${b.name}:
- izvor: "${b.src}"
- prevod: "${b.out}"

Uradi:
1. Automatska provjera (python3 -I): isti skup _id-ova; za svaki item broj pojavljivanja tokena \\b(P\\d+|A\\d+|S\\d+|W\\d+|Section S|Rs\\.)\\b i brojeva (\\d+) u izvoru vs prevodu; odnos riječi (0.75–1.35); ekavski oblici (\\b(delo|dela|vreme|mesto|rešenje|svedok|ovde|gde|dve|posle|sledeći|čovek|lekar)\\b) i hrvatski oblici (tužitelj, odvjetnik, sudac, pravomoćn, tjedan); ${args.naslov_format ? 'za korpus — da svaki prevod počinje sa "Naslov:" i sadrži "Opis:".' : ''}
2. Ručno, rečenicu po rečenicu, uporedi izvor i prevod SVAKOG itema: izostavljanja, dodavanja, pogrešno značenje (npr. pogrešna strana u postupku, negacija, pogrešan rok ili kazna), odstupanja od glosara (${args.review_glossary_hint}), neprirodan ili nepravnički registar, nedosljednost termina unutar batcha, nepravilni datumi.
3. Klasifikuj: "blocking" = izostavljen/dodat sadržaj, promijenjeno značenje, izmijenjen token/broj, pogrešan _id ili format; "minor" = stil, registar, manja terminološka odstupanja.
4. Upiši kompletan nalaz u JSON fajl "${b.review}" (isti sadržaj kao strukturirani rezultat).
5. Vrati strukturirani rezultat: n_blocking, n_minor, issues[{id, severity, type, description, suggestion}], overall_quality (2–3 rečenice o kvalitetu i registru). Budi konkretan: citiraj problematičnu frazu iz prevoda i izvora.`
}

function fixPrompt(b, review) {
  return `Ti si glavni pravni prevodilac (${args.src_lang_nom || 'engleski'} → crnogorski, ijekavica). Recenzent je pregledao tvoj prevod batcha ${b.name} i našao probleme. Primijeni opravdane ispravke i napravi finalnu verziju.

${GUIDE}

Fajlovi:
- izvor: "${b.src}"
- prevod: "${b.out}"
- recenzija: "${b.review}"
Sažetak recenzije (n_blocking=${review.n_blocking}, n_minor=${review.n_minor}):
${JSON.stringify(review.issues, null, 1)}

Uradi:
1. Pročitaj izvor, prevod i recenziju. Za svaki nalaz odluči: primijeniti (ako je opravdan prema izvoru i stilskom vodiču) ili odbiti (ako je recenzent pogriješio — vodič i izvor su mjerodavni, ne recenzent). SVE "blocking" nalaze koji su tačni moraš ispraviti.
2. Dok ispravljaš, još jednom pročitaj cijeli prevod svakog itema i ispravi i ono što recenzent nije uočio.
3. Upiši finalnu verziju (isti format, JSON niz [{_id, title, text}], pravi dijakritici) u "${b.final}".
4. Ponovi automatsku samoprovjeru tokena/brojeva/_id-ova (python3 -I) na finalnom fajlu.
5. Vrati: final_path, n_applied, n_rejected, notes (koje nalaze si odbio i zašto, kratko).`
}


function reviewFixPrompt(b) {
  return `Ti si glavni recenzent i pravni prevodilac (${args.src_lang_nom || 'engleski'} → crnogorski, ijekavica). Prevod batcha ${b.name} je već urađen; tvoj zadatak je da ga PROVJERIŠ rečenicu po rečenicu i ODMAH ISPRAVIŠ sve što treba, i da napišeš finalnu verziju. Kvalitet je prioritet: ništa ne smije ostati izostavljeno, dodato, pogrešno prevedeno ni terminološki nedosljedno.

${GUIDE}

Fajlovi batcha ${b.name}:
- izvor: "${b.src}"
- prevod: "${b.out}"
- finalna verzija (upiši): "${b.final}"

Uradi:
1. Automatska provjera (python3 -I): isti skup i redoslijed _id-ova; za svaki item broj pojavljivanja tokena \\b(P\\d+|A\\d+|S\\d+|W\\d+|Section S|Rs\\.)\\b i brojeva (\\d+) u izvoru vs prevodu; broj znakova novog reda isti kao izvor; odnos riječi (0.75–1.35); ekavski oblici (\\b(delo|dela|vreme|mesto|rešenje|svedok|ovde|gde|dve|posle|sledeći|čovek|lekar|sprečav\\w*|lijek\\w*)\\b) i hrvatski oblici (tužitelj, odvjetnik, sudac, pravomoćn, tjedan, uvjet, osoba); ostaci engleskih rečenica.
2. Ručno, rečenicu po rečenicu, uporedi izvor i prevod SVAKOG itema: izostavljanja, dodavanja, pogrešno značenje (pogrešna strana u postupku, negacija, rok, kazna, iznos), odstupanja od glosara (${args.review_glossary_hint}), neprirodan ili pogrešan registar, nedosljednost termina unutar batcha i unutar istog dokumenta, datumi, citati sudske prakse i brojevi članova.
3. Sve što nađeš ISPRAVI direktno (ne samo prijavi). Upiši finalnu verziju u "${b.final}" (isti format kao prevod: JSON niz [{_id, title, text}], _id nepromijenjen, pravi dijakritici). Ako nema nijedne izmjene, ipak upiši identičnu kopiju.
4. Ponovi automatsku provjeru iz tačke 1 na finalnom fajlu; ako nešto ne prolazi, ispravi i ponovi. Razlike u brojevima koje potiču samo od formata datuma (npr. 7.1.2001 → 7. januara 2001.) su dozvoljene i treba ih navesti u notes.
5. Vrati: final_path, n_applied (broj ispravki koje si uradio), n_rejected (0 ako nema), notes (kratko: vrste ispravki, nedoumice, odluke o terminima van glosara).`
}

phase('Prevod')
log(`Prevod ${batches.length} batcheva (${args.corpus} korpus + ${args.queries} upiti)`)

const results = await pipeline(
  batches,
  b => agent(translatePrompt(b), { label: `prevod:${b.name}`, phase: 'Prevod', model: args.translate_model || 'opus', effort: args.translate_effort || 'high', schema: TRANSLATE_SCHEMA })
        .then(t => ({ b, t })),
  r => {
    if (!r || !r.t) return null
    if (args.translate_only) return { ...r, review: null, fix: null, final: r.b.out, done: true }
    if (args.review_fix) {
      return agent(reviewFixPrompt(r.b), { label: `revizija+ispravke:${r.b.name}`, phase: 'Revizija', model: 'opus', effort: 'high', schema: FIX_SCHEMA })
        .then(fix => ({ ...r, review: null, fix, final: (fix && fix.final_path) || r.b.out, done: true }))
    }
    return agent(reviewPrompt(r.b), { label: `revizija:${r.b.name}`, phase: 'Revizija', model: 'sonnet', effort: 'medium', schema: REVIEW_SCHEMA })
      .then(review => ({ ...r, review }))
  },
  r => {
    if (!r) return null
    if (r.done) return r
    if (args.skip_fix) return { ...r, fix: null, final: r.b.out }
    const needsFix = r.review && (r.review.n_blocking > 0 || r.review.n_minor > 0)
    if (!needsFix) return { ...r, fix: null, final: r.b.out }
    return agent(fixPrompt(r.b, r.review), { label: `ispravke:${r.b.name}`, phase: 'Ispravke', model: 'opus', effort: 'high', schema: FIX_SCHEMA })
      .then(fix => ({ ...r, fix, final: (fix && fix.final_path) || r.b.out }))
  }
)

const done = results.filter(Boolean)
const failed = batches.filter(b => !done.find(d => d.b.name === b.name)).map(b => b.name)
if (failed.length) log(`NEUSPJELI batchevi: ${failed.join(', ')}`)

phase('Audit')
const finalPaths = done.map(d => d.final)
const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    inconsistencies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          term_en: { type: 'string' },
          variants_found: { type: 'array', items: { type: 'string' } },
          recommended: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } },
        },
        required: ['term_en', 'variants_found', 'recommended'],
      },
    },
    other_findings: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['inconsistencies', 'other_findings', 'summary'],
}
const audit = args.skip_audit ? null : await agent(`Ti si terminološki revizor. Provjeri DOSLJEDNOST prevoda preko svih batcheva jednog pravnog dataseta (${args.src_lang_nom || 'engleski'} → crnogorski).

${GUIDE}

Finalni prevedeni fajlovi (JSON nizovi [{_id, title, text}]):
${finalPaths.map(p => `- "${p}"`).join('\n')}
Izvorni fajlovi su pored njih sa sufiksom .src.json (isto ime batcha).

Uradi (python3 -I za pretragu, pa ručno procijeni):
1. Za ključne termine iz glosara (${args.audit_terms}) nađi koji su prevodi upotrijebljeni u svim fajlovima (pretraži izvor za ${args.src_lang_nom || 'engleski'} termin, pa pogledaj odgovarajući item u prevodu). Prijavi svaki termin koji je preveden na više različitih načina, sa fajlovima u kojima se javlja.
2. Pretraži sve prevode za ekavske oblike, hrvatske oblike (tužitelj, odvjetnik, sudac, pravomoćn), ostatke engleskog teksta (regex za duže engleske fraze, npr. \\b(the|which|shall|whoever|appellant|respondent)\\b) ${args.naslov_format ? 'i neprevedene "Title:"/"Desc:" oznake u korpusu.' : 'i da li su upiti ostali u razgovornom registru, a korpus u ugovornom.'}
3. PRIJE strukturiranog rezultata upiši kompletan nalaz kao čitljiv Markdown u fajl "${W}/audit.md" (python3 -I ili Write) — to je primarni zapis. Zatim vrati strukturirani rezultat: inconsistencies[{term_en, variants_found, recommended, files}], other_findings (konkretno, sa _id-ovima), summary (3–4 rečenice). Strukturirani izlaz drži KRATAK (stringovi bez navodnika unutar teksta, bez novih redova), da JSON sigurno prođe validaciju; ako validacija ne prođe, ponovi pokušaj sa kraćim stringovima, nikad ne šalji prazan rezultat. NE mijenjaj prevedene fajlove.`,
  { label: 'audit:terminologija', phase: 'Audit', model: 'sonnet', effort: 'medium', schema: AUDIT_SCHEMA })

return {
  batches: done.map(d => ({
    name: d.b.name,
    final: d.final,
    self_check: d.t.self_check_passed,
    translator_notes: d.t.notes || '',
    review_blocking: d.review ? d.review.n_blocking : null,
    review_minor: d.review ? d.review.n_minor : null,
    review_quality: d.review ? d.review.overall_quality : '',
    fix_applied: d.fix ? d.fix.n_applied : 0,
    fix_rejected: d.fix ? d.fix.n_rejected : 0,
    fix_notes: d.fix ? (d.fix.notes || '') : '',
  })),
  failed,
  audit,
}
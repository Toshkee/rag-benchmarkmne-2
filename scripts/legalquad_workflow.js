export const meta = {
  name: 'legalquad-de-mne',
  description: 'LegalQuAD njemački→crnogorski: Sonnet 5.5 (high) prevodi nedostajuće batcheve, samo prevod uz samoprovjeru',
  phases: [{ title: 'Prevod', detail: 'Sonnet 5.5 (high), jedan agent po batchu', model: 'sonnet' }],
}

const REPO = args.repo
const W = `${REPO}/work/LegalQuAD/batches`
const STYLE = `${REPO}/style`
const CHECK = `${REPO}/scripts/check_batch.py`

const skip = new Set(args.skip || [])
const names = []
for (let i = 1; i <= 270; i++) {
  const n = `corpus_${String(i).padStart(3, '0')}`
  if (!skip.has(n)) names.push(n)
}
for (let i = 1; i <= 8; i++) {
  const n = `queries_${String(i).padStart(2, '0')}`
  if (!skip.has(n)) names.push(n)
}
const batches = (args.only ? names.filter(n => args.only.includes(n)) : names).map(n => ({
  name: n,
  kind: n.startsWith('corpus') ? 'corpus' : 'queries',
  src: `${W}/${n}.src.json`,
  out: `${W}/${n}.mne.json`,
}))

const SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    n_items: { type: 'number' },
    self_check_passed: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['name', 'n_items', 'self_check_passed'],
}

const KORPUS = `KORPUS: tekst presude u izvoru NEMA preloma reda — odjeljci „Tenor“, „Tatbestand“, „Entscheidungsgründe“ i numerisani pasusi (1, 2, 3…) stoje slijepljeni u jednom redu. Prevod ZADRŽAVA tu strukturu: oznake odjeljaka prevedene (Tenor → Izreka, Tatbestand → Činjenično stanje, Entscheidungsgründe → Obrazloženje, Gründe → Razlozi), isti brojevi pasusa na istim mjestima, BEZ dodavanja novih redova. Registar: obrazloženje presude. Korpus itemi su DIJELOVI dokumenata (_id oblika docid#k): polje "sep_before" je separator koji se NE prevodi i NE upisuje u tekst; za k>0 polje "head" je početak presude SAMO KAO KONTEKST (ko je tužilac, ko tuženi, koji sud) — ne prevodi se; uskladi termine sa njim (isti sud, iste strane, isti nazivi).`
const UPITI = `UPITI: kratko pitanje → prirodno pitanje na crnogorskom, isti registar, isti datumi („2. aprila 2013. godine“), brojevi predmeta i nazivi sudova po dijelu 10 vodiča. Pitanje ostaje pitanje, iste dužine kao izvor. Polje "context" (početak presude na njemačkom) je SAMO KONTEKST — ne prevodi se; koristi ga da termini (sud, strane, vrsta postupka) budu isti kao što će biti u prevodu presude. Prevedi ono što pitanje kaže (vjerno), pa ako se naziv suda u pitanju razlikuje od onoga u contextu, zabilježi to u notes.`

function prompt(b) {
  return `Ti si stručni pravni prevodilac sa njemačkog na crnogorski (ijekavica, latinica) koji odlično poznaje jezik propisa i presuda Crne Gore. Prevodiš sam, bez eksternih alata za mašinsko prevođenje. Dataset služi za RAG benchmark (NDCG@10), pa prevod mora biti POTPUN, vjeran i terminološki dosljedan, u registru propisa i presuda Crne Gore. Ovo je jedini prolaz (nema naknadne recenzije), pa budi pažljiv.

Prije rada pročitaj alatom Read CIJELI stilski vodič "${STYLE}/STYLE_GUIDE.md" (mjerodavni su dio 10 — njemačke sudske odluke, dio 1 — norma, i dio 6 — dopune, npr. „nijesu“, ne „nisu“; glosar u dijelu 3 je također obavezan) i primjere registra "${STYLE}/primjeri_krivicni_zakonik.txt" i "${STYLE}/primjeri_ustav.txt".

ZADATAK — batch ${b.name}:
1. Pročitaj izvor "${b.src}" (JSON niz objekata {_id, title, text, ...}). Veliki fajl čitaj u dijelovima (offset/limit) ako treba.
2. ${b.kind === 'corpus' ? KORPUS : UPITI}
3. Prevedi "text" SVAKOG itema u potpunosti. Ništa ne izostavljaj, ne sažimaj, ne dodaj. Strogo primijeni glosar (Kläger → tužilac, Beklagte → tuženi/tužena, Revision → revizija, Berufung → žalba, Urteil → presuda, Beschluss → rješenje, Landesarbeitsgericht → Zemaljski radni sud, Bundesarbeitsgericht → Savezni radni sud (BAG), Bundesgerichtshof → Savezni vrhovni sud (BGH) …; „lice“, ne „osoba“; „pravosnažna“; „advokat“; „sudija“). Dosljednost unutar presude je obavezna.
4. Doslovno ostaju: brojevi predmeta („11 Sa 2346/12“, „9 AZR 529/10“), citati (BGHZ, NJW, Rn.), skraćenice zakona (BGB, ZPO, TVöD, BUrlG, SGB), svi brojevi i iznosi, naslovi njemačke literature i imena stranih sudova/lica u citatima. „§ 3 Abs. 2 Satz 1 Nr. 4“ → „član 3 stav 2 rečenica 1 tačka 4“. Anonimizovana imena („Herr K.“, „die Klägerin“) ostaju. Datumi u crnogorskom obliku: „2. April 2013“ → „2. aprila 2013. godine“. Navodnici „…“. Pazi na brojeve: broj pasusa slijepljen uz prethodnu rečenicu ili godinu u izvoru mora ostati na istom mjestu.
5. Upiši rezultat alatom Write kao JSON niz [{"_id": "<isti _id, sa #k>", "title": "", "text": "<prevod>"}] u "${b.out}" (UTF-8, dijakritici kao pravi znakovi, NE \\u escape — ensure_ascii=False). Ne prenosi polja head, context, sep_before, n_chunks i sl. Ako pišeš JSON preko python skripte, koristi python3 -I i json.dump(..., ensure_ascii=False). Pazi na ispravno escapovanje navodnika unutar JSON stringova.
6. SAMOPROVJERA (obavezno): pokreni
   python3 -I "${CHECK}" "${W}" ${b.name}
   Skripta provjerava: isti skup i redoslijed _id-ova; broj novih redova isti kao izvor; multiskup brojeva isti (dozvoljeno samo da u datumu nestane broj mjeseca 1–12 jer je mjesec napisan riječju); odnos broja riječi prevod/izvor između 0,8 i 1,4; nema ekavskih ni hrvatskih oblika; nema „nisu/niste/nismo“ (treba „nijesu/nijeste/nijesmo“). Ako ispiše PROBLEMI, ispravi prevod i ponovi dok ne prođe. Odnos riječi izvan 0,8–1,4 kod kratkih upita pregledaj ručno i ispravi ako je stvarno izostavljeno ili dodano nešto. UPOZORENJE o njemačkim riječima nije greška ako su u pitanju citati njemačke literature/imena; inače prevedi. Ako je razlika u brojevima posljedica greške u samom izvoru (npr. godina slijepljena s brojem pasusa), prevod ostaje vjeran izvoru i to navedi u notes. Dodatno ručno provjeri da nema ostataka neprevedenih njemačkih rečenica.
7. Vrati strukturirani rezultat: name, n_items, self_check_passed (true samo ako skripta ispisuje OK), notes (kratko: nedoumice i odluke o terminima koje nisu u glosaru).`
}

phase('Prevod')
log(`Prevod ${batches.length} batcheva (Sonnet 5.5, high)`)
const results = await pipeline(
  batches,
  b => agent(prompt(b), { label: `prevod:${b.name}`, phase: 'Prevod', model: 'sonnet', effort: 'high', schema: SCHEMA }).then(t => ({ name: b.name, t }))
)
const done = results.filter(Boolean)
const failed = batches.filter(b => !done.find(d => d.name === b.name)).map(b => b.name)
if (failed.length) log(`NEUSPJELI batchevi: ${failed.join(', ')}`)
return {
  n_requested: batches.length,
  n_done: done.length,
  failed,
  self_check_false: done.filter(d => !d.t.self_check_passed).map(d => d.name),
  notes: done.filter(d => d.t.notes).map(d => `${d.name}: ${d.t.notes}`),
}

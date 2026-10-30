# Stilski vodič za prevod pravnih datasetova na crnogorski/srpski (ijekavica)

Cilj: prevodi služe kao benchmark za RAG retrieval (NDCG@10). Zato prevod mora biti
**vjeran, potpun i terminološki dosljedan** — ništa se ne izostavlja, ne sažima i ne dodaje.
Jezik treba da bude onakav kakav se koristi u propisima Crne Gore (Službeni list CG, gov.me):
vidjeti `primjeri_krivicni_zakonik.txt` i `primjeri_ustav.txt` u ovom folderu.

## 1. Jezička norma
- **Ijekavica**, latinica, crnogorska/srpska pravna norma: djelo, vrijeme, mjesto, rješenje,
  svjedok, odgovornost, vijeće, cijena, sljedeći, vještak, mjera, obavještenje, uvjerenje, ovlašćenje,
  saopštenje, opšti, uopšte, takođe, gdje, ovdje, dvije, obje, prije, poslije, naprijed.
- Ne koristiti hrvatske varijante (tužitelj, odvjetnik, sudac, tjedan, kolovoz, uvjet, odvjetnik, ustavni sudac,
  presuda je pravomoćna → **pravosnažna**) ni ekavicu (delo, vreme, mesto, rešenje, svedok).
- **lice**, ne „osoba“; **tužilac / tuženi**; **advokat / branilac**; **sudija**; **uslov**; **saglasnost**;
  **shodno / u skladu sa**; **odnosno**; **u smislu**; **po osnovu**; **na teret**; **u korist**.
- Mjeseci: januar, februar, mart, april, maj, jun, jul, avgust, septembar, oktobar, novembar, decembar.
  Datumi: „9. februara 1961. godine“, „1. aprila 1968. godine“.
- Brojevi i iznosi ostaju kao u izvoru (vidjeti dio 4).
- Rečenice mogu biti duge i nominalne, kao u propisima („Službeno lice koje protivpravnim iskorišćavanjem
  svog službenog položaja ... pribavi sebi ili drugom korist, ... kazniće se zatvorom od šest mjeseci do pet godina.“).
- Struktura zakonske odredbe: „Ko ..., kazniće se ...“; „(1) ... (2) Ako je djelom iz stava 1 ovog člana ...,
  učinilac će se kazniti ...“; „Za pokušaj djela iz stava 1 ovog člana kazniće se.“
- Ustavna odredba: „Svako ima pravo na ...“; „Niko ne može biti ...“; „Jemči se ...“; „Zabranjeno je ...“.
- Sudska naracija (opisi predmeta): obrazloženje presude — „Žalilac je 9. februara 1961. godine postavljen
  za službenika III razreda u tuženoj Banci (u daljem tekstu: Banka).“; „Prvostepeni sud je utvrdio da ...“;
  „Visoki sud je odbio žalbu kao neosnovanu.“; „Protiv te presude žalilac je izjavio žalbu ovom sudu.“

## 2. Šta se NE prevodi / čuva doslovno
- **Anonimizacijski tokeni**: `P1`, `P2`, ..., `A1`, `A2`, ..., `Section S`, `S1`, `W1`, `Rs.`, imena u
  obliku jednog slova ili skraćenice (npr. „MCH Society“ → „Društvo MCH“ je dozvoljeno, ali token mora ostati).
  Ovi tokeni se u prevodu pojavljuju **isti broj puta** kao u izvoru.
- **Iznosi** ostaju tačno kao u izvoru, uključujući indijsku notaciju: `Rs. 3,59,000/-`, `Rs. 10 lakhs`.
- **Brojevi članova, stavova, tačaka, godina zakona, brojevi predmeta** ostaju isti (Section 420 → član 420).
- Imena lica, mjesta, kompanija i institucija: transkribovati/zadržati (New Delhi → Nju Delhi; Bombay → Bombaj;
  Calcutta → Kalkuta; Madras → Madras; Punjab → Pandžab; Uttar Pradesh → Utar Pradeš; ostala manje poznata
  mjesta zadržati u izvornom obliku). Lična imena ostaju u izvornom (latiničnom) obliku.
- Latinski izrazi ostaju latinski (habeas corpus, mens rea, prima facie, suo motu, mala fide, bona fide, res judicata).
- Oznake „Title:“ / „Desc:“ u korpusu prevode se kao „Naslov:“ / „Opis:“ (vidjeti format u dijelu 5).

## 3. Glosar (obavezno dosljedno, isti termin uvijek isti prevod)
### Izvori prava i struktura
| engleski | prevod |
|---|---|
| Act | zakon (npr. „Act A1“ → „Zakon A1“; „Indian Penal Code“ → „Krivični zakonik Indije“) |
| Code of Criminal Procedure | Zakonik o krivičnom postupku |
| Code of Civil Procedure | Zakon o parničnom postupku |
| Indian Evidence Act | Zakon o dokazima |
| Constitution of India / the Constitution | Ustav Indije / Ustav |
| Section (zakona) | član |
| sub-section | stav |
| clause | tačka (u Ustavu: stav/tačka prema kontekstu) |
| proviso | izuzetak / odredba o izuzetku |
| Article (Ustava) | član |
| Schedule | prilog |
| Rule / Rules | pravilo / pravilnik |
| Ordinance | uredba |
| notification | obavještenje (službeno) |
| by-law | opšti akt / statut |
| the State (u Ustavu) | Država |
| Union of India | Indijska Unija |
| Parliament | Parlament |
| Legislature | zakonodavni organ |
| Government | Vlada |

### Sudovi i postupak
| engleski | prevod |
|---|---|
| Supreme Court | Vrhovni sud |
| High Court | Visoki sud |
| Sessions Court / Sessions Judge | Sesijski sud / sudija Sesijskog suda |
| Magistrate / Judicial Magistrate | magistrat / sudski magistrat |
| Trial Court | prvostepeni sud |
| Tribunal | tribunal |
| Labour Court | Sud za radne sporove |
| appellant | žalilac |
| respondent | protivna strana (u žalbenom postupku) / tuženi (ako je tuženi u parnici) |
| petitioner | podnosilac zahtjeva |
| plaintiff / defendant | tužilac / tuženi |
| accused | okrivljeni (prije optuženja) / optuženi (nakon optužnice) |
| complainant | podnosilac prijave / oštećeni (prema kontekstu) |
| prosecution | tužilaštvo (kao strana: optužba) |
| Public Prosecutor | javni tužilac |
| appeal / to appeal | žalba / izjaviti žalbu |
| revision (petition) | zahtjev za preispitivanje (revizija) |
| writ petition | ustavna tužba (writ petition) |
| Special Leave Petition | zahtjev za posebnu dozvolu za žalbu |
| leave (to appeal) | dozvola (za žalbu) |
| FIR (First Information Report) | krivična prijava (FIR) |
| charge / charge sheet | optužba / optužni akt |
| cognizance | uzimanje predmeta u postupak |
| bail / anticipatory bail | jemstvo / prethodno jemstvo |
| remand (custody) | pritvor / zadržavanje |
| judgment / decree / order | presuda / presuda u parnici (dekret) / rješenje |
| conviction / acquittal | osuđujuća presuda / oslobađajuća presuda |
| sentence | kazna (izrečena) |
| quash / set aside | ukinuti / staviti van snage |
| remand the matter | vratiti predmet na ponovni postupak |
| dismiss | odbiti (žalbu) / odbaciti (kao nedozvoljenu) |
| allow the appeal | usvojiti žalbu |
| evidence / witness / testimony | dokaz / svjedok / iskaz |
| dying declaration | izjava na samrti |
| burden of proof | teret dokazivanja |
| beyond reasonable doubt | van razumne sumnje |
| cause of action | osnov tužbenog zahtjeva |
| limitation (period) | rok zastarjelosti |
| costs | troškovi postupka |
| injunction | privremena mjera / zabrana |
| inquiry / investigation | istraga (upravna) / istraga (krivična) |
| counsel / learned counsel | zastupnik / uvaženi zastupnik |
| affidavit | izjava data pod zakletvom |

### Krivičnopravni pojmovi
| engleski | prevod |
|---|---|
| Whoever ... shall be punished with | Ko ... kazniće se |
| offence | krivično djelo |
| criminal breach of trust | zloupotreba povjerenja |
| cheating | prevara |
| misappropriation / criminal misappropriation | pronevjera / protivpravno prisvajanje |
| dishonestly / fraudulently | nepošteno / prevarno |
| public servant | službeno lice |
| imprisonment for life | kazna doživotnog zatvora |
| imprisonment of either description | zatvor (strogi ili obični) |
| rigorous imprisonment / simple imprisonment | strogi zatvor / obični zatvor |
| for a term which may extend to | u trajanju do |
| shall also be liable to fine | i novčanom kaznom |
| fine | novčana kazna |
| culpable homicide / murder | ubistvo iz nehata ili bez predumišljaja (culpable homicide) / ubistvo |
| grievous hurt / hurt | teška tjelesna povreda / tjelesna povreda |
| abetment / to abet | podstrekavanje i pomaganje / podstreknuti |
| criminal conspiracy | zločinačko udruživanje (dogovor) |
| common intention | zajednička namjera |
| attempt | pokušaj |
| forgery / forged document | falsifikovanje isprave / falsifikovana isprava |
| wrongful gain / wrongful loss | protivpravna imovinska korist / protivpravna šteta |
| property / movable property | imovina / pokretna stvar |
| entrusted with property | kome je povjerena imovina |
| dowry | miraz |
| cruelty | zlostavljanje |
| kidnapping / abduction | otmica / odvođenje |
| rioting / unlawful assembly | nered / nedozvoljeno okupljanje |
| extortion | iznuda |
| robbery / dacoity | razbojništvo / razbojništvo u grupi (dacoity) |
| theft | krađa |
| defamation | kleveta |
| bribe / gratification | mito / nedozvoljena korist |

### Radno i upravno pravo
| engleski | prevod |
|---|---|
| employment / appointment | zapošljavanje / postavljenje (imenovanje) |
| dismissal / removal / termination | otpuštanje / razrješenje / prestanak radnog odnosa |
| disciplinary proceedings / inquiry | disciplinski postupak / disciplinska istraga |
| Industrial Disputes Act | Zakon o industrijskim sporovima |
| workman | radnik |
| retrenchment | otpuštanje zbog prestanka potrebe za radom |
| reinstatement / back wages | vraćanje na rad / zaostale zarade |
| Registrar | registrator |
| Society (cooperative) | društvo (zadruga) |
| Bank / Head Office | Banka / sjedište (centrala) |
| Department | odjeljenje / uprava |
| Officer / Grade | službenik / razred (npr. „Officer in Grade III“ → „službenik III razreda“) |
| equality before law / equal protection of the laws | jednakost pred zakonom / jednaka zaštita zakona |
| reservation (u Ustavu) | rezervacija (posebne kvote) |
| backward class | zaostala klasa (backward class) |
| Scheduled Castes / Scheduled Tribes | registrovane kaste / registrovana plemena |

## 4. Format i očuvanje strukture
- Jedan izvorni dokument → jedan prevod, isti `_id`.
- Zadržati novi redovi, numeraciju (1), (2), 1), a), i interpunkciju gdje god ima smisla.
- Zadržati napomene tipa „Substituted by Act 26 of 1955, section 117 and Schedule, for "transportation for life"
  (w.e.f. 1-1-1956).“ → „Zamijenjeno Zakonom 26 iz 1955. godine, član 117 i Prilog, umjesto „deportacije na doživotno
  vrijeme“ (stupilo na snagu 1. 1. 1956. godine).“
- Navodnici: „ovako“ (ili "ovako" ako je u izvoru, ali dosljedno unutar dokumenta).
- Korpus: izvorni tekst `Title: X\nDesc: Y\n` → `Naslov: X\nOpis: Y\n`.
- Upiti: čist tekst, isti broj pasusa kao izvor.

## 5. Zabranjeno
- Sažimanje, preskakanje rečenica, „poboljšavanje“ sadržaja, dodavanje objašnjenja ili prevodilačkih napomena u tekst.
- Mijenjanje tokena P1/A1/Section S/Rs./brojeva/datuma (osim formata datuma na crnogorski).
- Miješanje ekavice i ijekavice unutar istog teksta.

## 6. Dopune glosara nakon audita AILA_statutes (obavezno i za naredne datasetove)
| engleski | prevod |
|---|---|
| a State / the State Government (savezna jedinica Indije) | država / Vlada države (NE „savezna država“); „the State“ u Ustavu kao nosilac vlasti → Država |
| Union territory | teritorija Unije (NE „savezna teritorija“) |
| Constitution (Forty-fourth Amendment) Act, 1978 | Zakon o izmjeni Ustava (Četrdeset četvrti amandman) iz 1978. godine (uvijek „Zakon o izmjeni Ustava“) |
| Indian Evidence Act / Indian Registration Act / Indian Stamp Act | Zakon o dokazima / Zakon o registraciji / Zakon o taksama (bez „Indije“); izuzetak: Indian Penal Code → Krivični zakonik Indije (prvi put), dalje Krivični zakonik |
| lakh / lakhs, crore / crores | lakh (sklonjivo: 12 lakha, Rs. 5 lakha), kror (10 krora); nikad „lakhs“/„crores“ |
| writ | nalog (writ) — uvijek sa glosom pri prvom pomenu u itemu; writ of mandamus/certiorari/habeas corpus → nalog mandamus / certiorari / habeas corpus |
| order (odluka suda/organa) | rješenje |
| warrant | nalog za hapšenje / nalog za pretres (prema kontekstu), nikad samo „nalog“ bez odrednice |
| Order (naziv akta, npr. Fertiliser Control Order) | Naredba (samo u nazivu akta) |
| decree | presuda u parnici (dekret) pri prvom pomenu u itemu, dalje „presuda u parnici“; nikad „odluka“ |
| revision / Civil Revision | zahtjev za preispitivanje (revizija) pri prvom pomenu, dalje „revizija“; revisional court → revizioni sud |
| party / parties (u postupku) | strana / strane (NE „stranka“) |
| Tribunal | tribunal (malo slovo, osim kao dio punog naziva) |
| accused | okrivljeni dok nema optužnice, optuženi nakon podizanja optužnice; unutar istog opisa predmeta uvijek isti termin za isto lice |
| Public Prosecutor / prosecutor | javni tužilac (uvijek sa „javni“); plaintiff → tužilac |
| Division Bench | vijeće (Division Bench) pri prvom pomenu, dalje „vijeće“ |
| show cause notice | poziv za izjašnjenje (show cause notice) |
| letters patent appeal | žalba po osnovu letters patent |
| permissible / permitted | dozvoljen (NE „dopušten“) |
| investigating officer | službenik koji vodi istragu |
| penal consequences (disciplinski kontekst) | kaznene posljedice; (krivični kontekst) krivičnopravne posljedice |
| to empower / authorise | ovlastiti (dozvoljeno) ili dati ovlašćenje |
| Provided that ... (proviso) | „Izuzetno, ...“ kad uvodi blaže/drugačije pravilo; „pod uslovom da ...“ kad postavlja uslov |
| Exception 1, 2 ... (u IPC) | Izuzetak 1, 2 ... |
| representation (podnesak organu) | predstavka; petition/application → zahtjev |
| are not (negacija) | nijesu (NE „nisu“), nije |
| District Magistrate / Judicial Commissioner / Collector | okružni magistrat / sudski komesar / kolektor (Collector) |

## 7. Ugovorni tekstovi i laički sažeci (legal_summarization, consumer_contracts_qa)
Izvorni tekst u ovim datasetovima je **normalizovan**: sva mala slova, izbačeni apostrofi i dio interpunkcije
(„don t“, „if you re“, „children s“). To su artefakti obrade, ne stil. Prevod se piše **normalnom ortografijom**:
veliko slovo na početku rečenice i u imenima (Google, Facebook, Pokémon GO), standardna interpunkcija, bez pokušaja
da se imitira nedostatak zareza i apostrofa. Jedino se ne dodaje sadržaj koji u izvoru ne postoji.

### Dva registra, strogo odvojena
- **Korpus = odredbe uslova korišćenja / politike privatnosti / ugovora.** Registar: opšti uslovi poslovanja i
  Zakon o obligacionim odnosima / Zakon o zaštiti potrošača CG. Formalno, bezlično gdje izvor to dozvoljava, ali ne
  „zakonodavno“ (nema „kazniće se“). Obraćanje korisniku: **vi / vaš, malim slovom**; pružalac: **mi / naš**, ili
  naziv kompanije kad ga izvor koristi.
- **Upiti = laički sažeci** (TOS;DR stil: „don t die or hurt others and if you do it s not our fault“). Registar:
  **razgovorni, sažet, ponekad šaljiv**, kao kad korisnik svojim riječima prepriča odredbu. NE pretvarati ih u
  pravni jezik. Zadržati obraćanje **vi** (zbog podudaranja sa korpusom), ali ton ostaje neformalan:
  „Nemojte umrijeti ni povrijediti druge, a ako se to desi, nijesmo mi krivi.“; „Trgovina će biti moguća. Ne
  pokušavajte da u nju uvedete pravi novac.“ Ijekavica važi i u upitima.

### Glosar za ugovorne tekstove
| engleski | prevod |
|---|---|
| terms (of service/use), these terms | uslovi korišćenja, ovi uslovi |
| privacy policy | politika privatnosti |
| guidelines (trainer/community guidelines) | smjernice (smjernice za trenere / smjernice zajednice) |
| services / the app / the game | usluge / aplikacija / igra |
| account | nalog |
| user / you | korisnik / vi |
| parent or legal guardian | roditelj ili zakonski staratelj |
| user content / your content | korisnički sadržaj / vaš sadržaj |
| license (grant a license) | licenca (dati licencu) |
| intellectual property (rights) | (prava) intelektualne svojine |
| copyright / trademark | autorsko pravo / žig |
| third party / third parties | treće lice / treća lica |
| personal data / personal information | lični podaci / lični podaci |
| cookies | kolačići |
| subscription / fee / refund | pretplata / naknada / povraćaj sredstava |
| virtual items / in-app purchases | virtuelni predmeti / kupovine unutar aplikacije |
| warranty / as is / disclaimer | garancija / „u viđenom stanju“ / odricanje od odgovornosti |
| liability / limitation of liability | odgovornost / ograničenje odgovornosti |
| indemnify, hold harmless | obeštetiti i zaštititi od odgovornosti |
| damages (consequential, incidental) | šteta (posredna, slučajna) |
| terminate / termination / suspend | raskinuti, ukinuti (nalog) / prestanak, raskid / privremeno ukinuti |
| ban (an account) | blokirati (nalog) |
| governing law / jurisdiction / venue | mjerodavno pravo / nadležnost / mjesto suđenja |
| arbitration / class action waiver | arbitraža / odricanje od kolektivne tužbe |
| dispute | spor |
| notice / notify | obavještenje / obavijestiti |
| consent / you agree that | saglasnost / saglasni ste da |
| at your own risk | na sopstveni rizik |
| applicable law, rule or regulation | važeći zakon, pravilo ili propis |
| reverse engineer / modify / distribute / resell | vršiti reverzni inženjering / mijenjati / distribuirati / preprodavati |
| sole discretion | isključiva (sopstvena) procjena |
| from time to time | povremeno |
| without notice | bez prethodnog obavještenja |
| effective date / entire agreement / severability | datum stupanja na snagu / cjelovitost ugovora / djelimična ništavost (salvatorna klauzula) |
| opt out | odustati / isključiti se |
| affiliates / partners / vendors | povezana lica / partneri / dobavljači |
| advertising / targeted ads | oglašavanje / ciljani oglasi |
| data retention / delete your data | čuvanje podataka / obrisati vaše podatke |
| GDPR, CCPA i slični nazivi | ostaju kao skraćenice |
| 13 years of age / under 13 | 13 godina / mlađi od 13 godina |

### Dopune glosara nakon audita consumer_contracts_qa
| engleski | prevod |
|---|---|
| website / site | sajt (NE „veb-sajt“, NE „internet stranica“); web page → veb-stranica samo kad izvor izričito kaže „page“ |
| e-mail / email address | e-pošta / adresa e-pošte (NE „elektronska pošta“); e-mail (poruka) → e-poruka |
| merchantability / fitness for a particular purpose | podobnost za prodaju / podobnost za određenu namjenu |
| implied warranties | prećutne garancije (NE „prešutne“) |
| indirect / consequential / incidental / special / punitive / exemplary damages | posredna / posljedična / slučajna / posebna / kaznena / primjerna (egzemplarna) šteta — uvijek ovo preslikavanje, redoslijed kao u izvoru |
| represent and warrant | izjavljujete i garantujete |
| trade dress | trgovinski izgled (trade dress) pri prvom pomenu, dalje trgovinski izgled |
| Miscellaneous (naslov) | Ostale odredbe |
| applicable | primjenjiv (NE „primjenljiv“) |
| sole discretion | po isključivoj procjeni (bez „sopstvenoj/svojoj“) |
| terminate (account) / terminate (agreement, subscription) / cancel / suspend | ukinuti (nalog) / raskinuti (ugovor, pretplatu) / otkazati / privremeno ukinuti; naslov „Termination“ → Prestanak |
| imena brendova u deklinaciji | sa crticom kad se izgovor razlikuje od pisanja (Google-a, YouTube-a, eBay-a), bez crtice inače (Facebooka, Amazona, Appleov); uvijek izvorno pisanje (YouTube, ne Youtube) |
| Terms / Services / Content / Account kao definisani pojmovi | veliko slovo prati izvor (Uslovi, Usluge, Sadržaj, Nalog) |

## 8. Predlozi zakona i njihovi sažeci (legalbench_corporate_lobbying)
Korpus: sažetak američkog predloga zakona (prvi red = kratki naziv zakona, zatim pasusi sažetka). Upiti: zvanični
dugi naslov predloga („A bill to ...“ / „To provide for ...“). Registar: obrazloženje predloga zakona kakvo se
podnosi Skupštini Crne Gore („Ovim zakonom uređuje se...“, „Predlogom zakona se propisuje...“).

### Obrasci
- „A bill to X, and for other purposes.“ → „Predlog zakona kojim se X i uređuju druga pitanja.“
- Dugi naslov bez „A bill“ („To provide for the administration of...“) → „Kojim se uređuje upravljanje...“
  (ostaje fragment kao u izvoru, ne dodaje se „Predlog zakona“).
- „This bill provides for / establishes / amends / requires X to...“ → „Ovim predlogom zakona uređuje se / osniva se /
  mijenja se i dopunjuje / nalaže se X da...“. „The bill directs X to“ → „Predlogom zakona nalaže se X da“.
- „shall“ u sažecima → normativni prezent („Ministarstvo objedinjuje...“), ne „će“.
- Kratki naziv: „Space Frontier Act of 2019“ → „Zakon o svemirskoj granici iz 2019. godine“. Ako je naziv
  skraćenica/bekronim (npr. „ANTIQUITIES Act“, „USA PATRIOT Act“), prevesti puni naziv, a skraćenicu zadržati:
  „Zakon ... (ANTIQUITIES Act)“. Nazive postojećih zakona koji se mijenjaju prevesti i zadržati godinu:
  „Social Security Act“ → „Zakon o socijalnom osiguranju“.
- Prvi red (naziv) ostaje sam u prvom redu; broj pasusa isti kao izvor.

### Glosar (SAD institucije i zakonodavni pojmovi)
| engleski | prevod |
|---|---|
| bill | predlog zakona |
| Act | zakon |
| Congress / House of Representatives / Senate | Kongres / Predstavnički dom / Senat |
| Secretary of X / the Secretary | ministar X (Secretary of Defense → ministar odbrane; Secretary of the Interior → ministar unutrašnjih resursa; Secretary of State → državni sekretar) |
| Department of X | Ministarstvo X (Department of Transportation → Ministarstvo saobraćaja; Department of Veterans Affairs → Ministarstvo za pitanja veterana; Department of Health and Human Services (HHS) → Ministarstvo zdravlja i socijalnih usluga (HHS); Department of Homeland Security (DHS) → Ministarstvo domovinske bezbjednosti (DHS); Department of Agriculture (USDA) → Ministarstvo poljoprivrede (USDA)) |
| federal agency / federal government | savezna agencija / savezna vlada |
| state (savezna jedinica) / State of New Mexico | država / država Novi Meksiko |
| local government | lokalna samouprava |
| Indian tribe / tribal | indijansko pleme / plemenski |
| appropriations / to authorize appropriations | budžetska sredstva / odobriti budžetska sredstva |
| fiscal year (FY) 2019 | fiskalna 2019. godina |
| grant / grant program | grant (bespovratna sredstva) / program grantova |
| Government Accountability Office (GAO) | Vladina kancelarija za reviziju (GAO) |
| Environmental Protection Agency (EPA) | Agencija za zaštitu životne sredine (EPA) |
| Food and Drug Administration (FDA) | Uprava za hranu i ljekove (FDA) |
| Internal Revenue Service (IRS) / Internal Revenue Code | Poreska uprava (IRS) / Zakonik o unutrašnjim prihodima |
| Centers for Medicare & Medicaid Services (CMS) | Centri za Medicare i Medicaid (CMS); Medicare, Medicaid ostaju |
| United States Code (U.S.C.), title 18 | Zakonik Sjedinjenih Država, glava 18 |
| National Park Service / Bureau of Land Management (BLM) / Forest Service | Služba nacionalnih parkova / Biro za upravljanje zemljištem (BLM) / Šumarska služba |
| wilderness area / national monument | područje divljine / nacionalni spomenik |
| veteran | veteran |
| small business | malo preduzeće |
| regulatory burden | regulatorno opterećenje |
| rulemaking / regulation | donošenje propisa / propis |
| report to Congress | izvještaj Kongresu |
| sunset / expire | prestati da važi |
| eligible / eligibility | koji ispunjava uslove / ispunjavanje uslova |
| waiver | izuzeće |
| penalty | kazna |
| tax credit / deduction | poreski kredit / poreski odbitak |
| funding / funds | finansiranje / sredstva |
| and for other purposes | i uređuju druga pitanja |
| skraćenice agencija (BLM, FDA, EPA, DHS, HHS, GAO, VA...) | ostaju u zagradi poslije prevedenog naziva pri prvom pomenu, dalje samo skraćenica |

### Dopune nakon audita corporate_lobbying
| engleski | prevod |
|---|---|
| „<Dugi naziv> or the <SKR> Act of 2019“ (prvi red sažetka) | „<prevod dugog naziva>, odnosno Zakon <opis> (<SKR Act of 2019>)“ — uvijek „odnosno“, skraćenica u zagradi tačno kao u izvoru, bez prevođenja ili dupliranja skraćenice |
| Making appropriations for X | Kojim se odobravaju budžetska sredstva za X |
| Public Health Service Act | Zakon o javnoj zdravstvenoj službi |
| U.S. Fish and Wildlife Service | Služba za ribe i divlji svijet SAD-a |
| Department of Education | Ministarstvo obrazovanja (NE „prosvjete“) |
| Department of the Treasury / Treasury | Ministarstvo finansija (NE „Trezor“) |
| Army Corps of Engineers | Inženjerijski korpus Kopnene vojske SAD-a |
| National Science Foundation | Nacionalna fondacija za nauku |
| Native American / American Indian / Alaska Native | Indijanci / Indijanci / starosjedioci Aljaske |
| whistleblower | uzbunjivač (NE „zviždač“) |
| carbon sequestration | sekvestracija ugljenika |
| apprenticeship | šegrtovanje (NE „naukovanje“) |
| drug (lijek) | ljek, ljekovi (ijekavski oblik u CG propisima: „Uprava za hranu i ljekove“) |
| prevention | sprječavanje (NE „sprečavanje“) |
| imena država SAD | transliterisati ustaljene: Vašington, Ajdaho, Vajoming, Juta, Kalifornija, Njujork, Pensilvanija, Teksas, Aljaska, Havaji, Novi Meksiko, Sjeverna/Južna Dakota, Kolorado; ostale (Montana, Oregon, Nevada, Ohio...) ostaju; nazivi projekata/programa ostaju (Projekat Central Utah) |
| Department of the Interior / Secretary of the Interior / Interior | Ministarstvo unutrašnjih resursa / ministar unutrašnjih resursa (odluka korisnika 29. 10. 2026; NE „unutrašnjih poslova“, jer je u SAD to resor prirodnih resursa i javnog zemljišta) |

## 9. Sudske presude (AILA_casedocs)
Korpus: pune presude Vrhovnog suda Indije (zaglavlje: stranke, sud, datum, broj predmeta, sudija; zatim obrazloženje
sa numerisanim pasusima). Dugi dokumenti su podijeljeni na DIJELOVE (`_id` oblika „docid#k“, polje `n_chunks`, a za
k>0 polje `head` = početak presude, samo kao kontekst za imena stranaka i predmet spora — ne prevodi se i ne dodaje).
Registar: obrazloženje presude (dio 1, dio 3 glosar sudova i postupka, dio 6 dopune).

### Pravila
- Zaglavlje: „X v Y“ → „X protiv Y“; „Supreme Court of India“ → „Vrhovni sud Indije“; datum „6 April 1986“ →
  „6. april 1986. godine“ (u zaglavlju nominativ), u tekstu „6. aprila 1986. godine“; „C.A. No. 4412 of 1985“ →
  „C.A. br. 4412 iz 1985. godine“; „The Judgment was delivered by: D. P. Madon, J.“ → „Presudu je izrekao: sudija
  D. P. Madon“. Imena sudija i stranaka ostaju u izvornom obliku (bez deklinacije ako su strana imena sa inicijalima;
  prezimena se mogu deklinirati: „Ganguly-ja“ nije potrebno — koristiti „g. Ganguly“ konstrukcije ili ostaviti).
- Citati sudske prakse ostaju doslovno: „AIR 1962 SC 123“, „(1980) 2 SCC 684“, „[1975] 1 SCR 1“ — ne prevoditi ni mijenjati.
- Skraćenice odredbi: „s. 617“ → „član 617“; „Art. 12“ → „član 12“; „u/s. 23“ → „prema članu 23“; „sub-s. (2)“ → „stav (2)“;
  „cl. (b)“ → „tačka (b)“; „Sch.“ → „Prilog“. Nazivi zakona po dijelu 3 (Companies Act, 1956 → Zakon o privrednim
  društvima iz 1956. godine; Indian Contract Act, 1872 → Zakon o ugovorima iz 1872. godine; Constitution → Ustav).
- Procesne uloge po glosaru (appellant → žalilac; respondent → protivna strana; petitioner → podnosilac zahtjeva;
  Union of India → Indijska Unija; State of X → država X; learned counsel → uvaženi zastupnik; High Court → Visoki sud;
  Division Bench → vijeće; Special Leave → posebna dozvola za žalbu; writ → nalog (writ); impugned order → osporeno rješenje;
  impugned judgment → osporena presuda; dismissed → odbijena; allowed → usvojena; set aside → ukinuta; remanded → vraćeno na ponovni postupak).
- Numeracija pasusa „1.“, „(4)“, „(i)“ i brojevi strana u tekstu (npr. „305“) ostaju doslovno; broj novih redova isti kao izvor.
- Navodnici u izvoru ("the State") → „the State“ se prevodi („Država“) i zadržava u navodnicima „...“.
- Latinski izrazi ostaju (prima facie, ultra vires, mutatis mutandis, obiter dicta, ratio decidendi, locus standi).
- Dosljednost unutar presude: isti termin za istu stranku i isti zakon od početka do kraja; kod dijelova k>0
  koristiti `head` da se vidi ko je žalilac, a ko protivna strana.

## 10. Njemačke sudske odluke (LegalQuAD, GerDaLIR) — prevod sa njemačkog
Korpus LegalQuAD: 200 presuda njemačkih sudova (BAG, BGH, LAG, LG, OLG, VG...), tekst BEZ preloma reda — odjeljci
„Tenor“, „Tatbestand“, „Entscheidungsgründe“ i numerisani pasusi (1, 2, 3...) stoje slijepljeni („Tenor1. Die Revision...
Tatbestand1Die Parteien...“). Prevod ZADRŽAVA tu strukturu: iste oznake odjeljaka prevedene („Izreka“, „Činjenično
stanje“, „Obrazloženje“), isti brojevi pasusa na istim mjestima, bez dodavanja novih redova. Dijelovi dokumenata
(`_id` „docid#k“) sijeku se po granicama rečenica, `sep_before` je separator i ne prevodi se.
Upiti: kratka pitanja o presudi („Wie wurde über die Revision ... entschieden?“) → prirodno pitanje na crnogorskom,
isti registar (laički/formalni kao izvor), isti datumi i brojevi predmeta.

### Pravila
- Brojevi predmeta i citati ostaju doslovno: „11 Sa 2346/12“, „BAG 20. März 2012 - 9 AZR 529/10 -“, „BGHZ 123, 45“,
  „NJW 2010, 1234“, „Rn. 12“ (→ „tačka 12“ može, ali broj ostaje). Skraćenice sudova ostaju (BAG, BGH, LAG, BVerfG),
  uz prevedeni naziv pri prvom pomenu: Bundesarbeitsgericht → Savezni radni sud (BAG); Landesarbeitsgericht
  Berlin-Brandenburg → Zemaljski radni sud Berlin-Brandenburg; Bundesgerichtshof → Savezni vrhovni sud (BGH);
  Oberlandesgericht → Viši zemaljski sud (OLG); Landgericht → Zemaljski sud (LG); Amtsgericht → Opštinski sud (AG);
  Verwaltungsgericht → Upravni sud (VG); Bundesverfassungsgericht → Savezni ustavni sud (BVerfG); Sozialgericht → Socijalni sud.
- Odredbe: „§ 3 Abs. 2 Satz 1 Nr. 4 BUrlG“ → „član 3 stav 2 rečenica 1 tačka 4 BUrlG“ (skraćenica zakona ostaje; puni
  naziv pri prvom pomenu: BGB → Građanski zakonik (BGB); ZPO → Zakon o parničnom postupku (ZPO); ArbGG → Zakon o radnim
  sudovima (ArbGG); TVöD → Kolektivni ugovor za javnu službu (TVöD); BUrlG → Savezni zakon o odmoru (BUrlG); SGB → Socijalni
  zakonik (SGB); StGB → Krivični zakonik (StGB); StPO → Zakonik o krivičnom postupku (StPO); GG → Osnovni zakon (GG)).
- Procesni pojmovi: Kläger/Klägerin → tužilac/tužilja; Beklagte(r) → tuženi/tužena; Revision → revizija; Berufung → žalba;
  Beschwerde → pritužba (Rechtsbeschwerde → pravna pritužba); Urteil → presuda; Beschluss → rješenje; Tenor → izreka;
  Tatbestand → činjenično stanje; Entscheidungsgründe → obrazloženje; zurückgewiesen → odbijena; aufgehoben → ukinuta;
  zurückverwiesen → vraćeno na ponovno odlučivanje; Kosten des Rechtsstreits → troškovi postupka; Streitwert → vrijednost
  predmeta spora; Vorinstanz → nižestepeni sud; Senat → vijeće (Senat); Kammer → vijeće; Richter → sudija; Rechtsanwalt →
  advokat; Staatsanwaltschaft → tužilaštvo; Angeklagte(r) → optuženi; Arbeitgeber/Arbeitnehmer → poslodavac/zaposleni;
  Betriebsrat → savjet zaposlenih; Kündigung → otkaz; Tarifvertrag → kolektivni ugovor; Wechselschichtarbeit → rad u
  smjenama koje se mijenjaju; Zusatzurlaub → dodatni odmor; Schadensersatz → naknada štete; Verjährung → zastarjelost;
  Widerspruch → prigovor; Bescheid → rješenje (upravno); Klage → tužba; Anspruch → zahtjev/pravo na.
- Njemački pravopisni znaci: „..." navodnici → „...“; datumi „2. April 2013“ → „2. aprila 2013. godine“.
- Imena lica (često anonimizovana: „Herr K.“, „die Klägerin“) ostaju; „K.“ ostaje „K.“.

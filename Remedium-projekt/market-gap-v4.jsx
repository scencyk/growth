import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area
} from "recharts";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DATA: AGE-BASED SEGMENTS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const AGE_SEGMENTS = [
  {
    id: "students", name: "Studenci medycyny (rok 5â€“6)", shortName: "Studenci",
    ageLabel: "22â€“25 lat", current: 22693, market: 24000, color: "#818cf8",
    monetization: "Freemium, LEK prep", arpu: 30, priority: 3,
    annualInflow: 7000, inflowNote: "nowych studentÃ³w rocznie na lata 5-6",
    optIn: null, optInNote: "Studenci poza bazÄ… marketingowÄ… lekarzy",
    genderF: 62, avgAge: 23,
    topCompetitors: ["WiÄ™cej niÅ¼ LEK (~70%)", "ZdamLEK (AI)", "mp.pl (darmowa Interna)"],
    growingSpecs: null, shrinkingSpecs: null,
    retention: 78, retentionNote: "PrzejÅ›cie studentâ†’staÅ¼ysta (szac.)",
    description: "Studenci medycyny rok 5â€“6 przygotowujÄ…cy siÄ™ do LEK. Rynek ~24 000 (dwa roczniki: nabory 2020/21 ~9 300 + 2021/22 ~10 000 minus dropout). Remedium ma 22,7k â€” penetracja 95%. Baza moÅ¼e zawieraÄ‡ teÅ¼ studenci lat wczeÅ›niejszych i powtarzajÄ…cych LEK.",
    recommendations: [
      { type: "product", text: "Bank pytaÅ„ LEK z AI-powered wyjaÅ›nieniami â€” konkurencja z WiÄ™cej niÅ¼ LEK" },
      { type: "product", text: "Kalkulator szans na specjalizacjÄ™ (wynik LEK Ã— progi Ã— dostÄ™pnoÅ›Ä‡ miejsc)" },
      { type: "growth", text: "SEO na frazy 'przygotowanie do LEK', 'ranking specjalizacji'" },
      { type: "retention", text: "Automatyczny onboarding studentâ†’staÅ¼ysta po LEK â€” krytyczny moment utraty" },
    ],
    insight: "Penetracja 95% â€” segment niemal nasycony. Priorytet: RETENCJA przy przejÅ›ciu na staÅ¼. KaÅ¼dy utracony student = stracony lekarz na 30+ lat.",
    risk: "WiÄ™cej niÅ¼ LEK dominuje LEK-prep (70% studentÃ³w). Medico PZWL atakuje z SuperMemo + AI. WejÅ›cie w LEK-prep wymaga duÅ¼ej inwestycji contentowej.",
    source: "Nabory uczelniane 2024/2025: rynek 5+6 rok ~24 000 (2 roczniki). Remedium: 22 693."
  },
  {
    id: "young_docs", name: "StaÅ¼yÅ›ci i mÅ‚odzi rezydenci", shortName: "Lek. 25â€“29",
    ageLabel: "25â€“29 lat (staÅ¼ + rezydentura 1-2 rok)", current: 14000, market: 19000,
    color: "#a78bfa", monetization: "Darmowy + pharma ads", arpu: 25, priority: 4,
    annualInflow: 6000, inflowNote: "absolwentÃ³w/rok wchodzÄ…cych do zawodu",
    optIn: 1040, optInNote: "~40% z 2 597 lek. bez specj. z opt-in",
    genderF: 63, avgAge: 27,
    topCompetitors: ["mp.pl (darmowa Interna)", "DrWidget (baza lekÃ³w)", "Grupy FB 'MÅ‚odzi Lekarze'"],
    growingSpecs: null, shrinkingSpecs: null,
    retention: 85, retentionNote: "PrzejÅ›cie staÅ¼ystaâ†’rezydent (szac.)",
    description: "StaÅ¼yÅ›ci podyplomowi (6 798 zÅ‚ brutto) + rezydenci na poczÄ…tku szkolenia. Kluczowy dla lojalnoÅ›ci â€” pierwszy kontakt z zawodem i szok kliniczny. MZ pracuje nad zniesieniem staÅ¼u (moÅ¼liwe 2027).",
    recommendations: [
      { type: "product", text: "\"SOS DyÅ¼urowy\" â€” algorytmy na stany nagÅ‚e, mobile-first, offline" },
      { type: "product", text: "Vademecum StaÅ¼ysty z checklistami na kaÅ¼dÄ… rotacjÄ™" },
      { type: "growth", text: "Partnerstwo z uczelniami â€” prezentacja remedium na ostatnim roku" },
      { type: "monetization", text: "Pharma sponsoring sekcji klinicznych (np. algorytm bÃ³lu â†’ firma analgetyczna)" },
    ],
    insight: "Penetracja 74% â€” dobra, ale 5 000 lekarzy do pozyskania. Krytyczny moment: przejÅ›cie ze studiÃ³w na staÅ¼. Reforma staÅ¼u (2027?) moÅ¼e zmieniÄ‡ ten segment.",
    risk: "Reforma staÅ¼u MZ â€” jeÅ›li zniesiony, segment siÄ™ skurczy. Niskie zarobki (4 100 zÅ‚ netto) = zerowa gotowoÅ›Ä‡ do pÅ‚acenia. Monetyzacja wyÅ‚Ä…cznie pharma.",
    source: "GUS 2024: 12,2% praktykujÄ…cych â‰¤29. Dashboard kadrowy: ~19 000 w przedziale 25-29."
  },
  {
    id: "residents_youngspec", name: "Rezydenci i mÅ‚odzi specjaliÅ›ci", shortName: "Lek. 30â€“39",
    ageLabel: "30â€“39 lat", current: 19500, market: 33600, color: "#ec4899",
    monetization: "Freemium + premium sub", arpu: 89, priority: 5,
    annualInflow: 3500, inflowNote: "netto wchodzÄ…cych do kohorty 30-39/rok",
    optIn: 2200, optInNote: "Interna, rodzinna, pediatria â€” najwiÄ™ksze grupy",
    genderF: 61, avgAge: 34,
    topCompetitors: ["Medico PZWL (DARMOWY dla rezydentÃ³w!)", "EgzaminLEK.pl (PES prep)", "Konsylium24 (43k lekarzy)"],
    growingSpecs: ["Psychiatria (+1 228)", "Radiologia (+1 076)", "Med. rodzinna (+1 064)", "Ortopedia (+796)"],
    shrinkingSpecs: null,
    retention: 70, retentionNote: "PrzejÅ›cie rezydentâ†’specjalista (30% utraty przy PES!)",
    description: "Najcenniejszy segment: 37 000 rezydentÃ³w + mÅ‚odzi specjaliÅ›ci po PES. Zarobki 9-15k brutto z dyÅ¼urami. Etap Å¼ycia: zakÅ‚adanie rodzin, kredyty. NajwyÅ¼sze nasilenie frustracji systemowych.",
    recommendations: [
      { type: "product", text: "\"Rezydent Dashboard\" â€” tracker procedur + harmonogram staÅ¼y + countdown do PES" },
      { type: "product", text: "Kursy PES per specjalizacja z pytaniami CEM i wyjaÅ›nieniami" },
      { type: "growth", text: "Partnerstwo z Porozumieniem RezydentÃ³w OZZL â€” zniÅ¼ki grupowe" },
      { type: "monetization", text: "\"Rezydent Pro\" subskrypcja 69-99 zÅ‚/mies. â€” PES prep + tracker + wytyczne" },
      { type: "competitive", text: "Counter Medico PZWL: spoÅ‚ecznoÅ›Ä‡ + narzÄ™dzia kariery (nie encyklopedia)" },
    ],
    insight: "âš¡ POLE BITWY â€” penetracja 58%, luka 14 100 osÃ³b. Medico PZWL oferuje darmowy dostÄ™p dla rezydentÃ³w + AI MediChat. Remedium musi wygraÄ‡ czym innym: spoÅ‚ecznoÅ›ciÄ…, MapÄ… WynagrodzeÅ„, EncyklopediÄ… Rezydentur.",
    risk: "Medico PZWL bezpoÅ›redni atak na core segment (free + AI + 150k dokumentÃ³w). 30% utraty uÅ¼ytkownikÃ³w przy przejÅ›ciu PES. EgzaminLEK.pl dominuje PES-prep.",
    source: "GUS 2024: 23,1% praktykujÄ…cych w 30-39. Dashboard MZ: 33 600. Baza remedium: ~19 500."
  },
  {
    id: "experienced", name: "DoÅ›wiadczeni specjaliÅ›ci", shortName: "Lek. 40â€“49",
    ageLabel: "40â€“49 lat", current: 9500, market: 22800, color: "#f59e0b",
    monetization: "Sub + B2B pharma", arpu: 199, priority: 4,
    annualInflow: 2800, inflowNote: "wchodzÄ…cych z kohorty 30-39/rok",
    optIn: 1800, optInNote: "Kardiologia, anestezjologia, onkologia",
    genderF: 54, avgAge: 44,
    topCompetitors: ["mp.pl Premium (90% lekarzy)", "Termedia (400k + e-Akademie)", "UpToDate"],
    growingSpecs: ["Kardiologia (+614)", "Anestezjologia (+382)", "Onkologia (+357)"],
    shrinkingSpecs: ["Ch. wewnÄ™trzne (âˆ’1 790!)", "Chirurgia og. (âˆ’439)", "Med. pracy (âˆ’212)"],
    retention: 80, retentionNote: "PrzejÅ›cie 40-49â†’50-55",
    description: "Pharma sweet spot â€” decydenci recepcyjni, KOL pipeline. Dochody 20-50k+ brutto. Pozycje: subspecjalizacje, zastÄ™pca ordynatora, kierownik poradni. 200 punktÃ³w CME w cyklu 4 lat.",
    recommendations: [
      { type: "product", text: "Wytyczne w \"executive summary\" â€” co siÄ™ zmieniÅ‚o i co oznacza dla praktyki, w 5 min" },
      { type: "product", text: "CME Dashboard â€” planowanie i Å›ledzenie 200 punktÃ³w/4 lata + kalendarz konferencji" },
      { type: "monetization", text: "Subskrypcja \"Expert\" 149-249 zÅ‚/mies. + pharma sponsoring 5-20k/mies. per sekcja" },
      { type: "growth", text: "Akredytacja NRL kursÃ³w CME â€” WARUNEK KONIECZNY monetyzacji tego segmentu" },
      { type: "competitive", text: "Nie wygraj z mp.pl na encyklopedii â€” wygraj na narzÄ™dziach kariery i B2B" },
    ],
    insight: "âš  NAJWYÅ»SZY ARPU (199 zÅ‚) ale NAJNIÅ»SZA penetracja w aktywnych segmentach (42%). 13 300 luki. Bez akredytacji NRL kursÃ³w CME segment pozostanie niedostÄ™pny. Dolina demograficzna 42-48 (1 700/rocznik).",
    risk: "mp.pl Premium i Termedia dominujÄ…. Bez akredytacji NRL remedium jest \"nice to have\". Segment wymaga inwestycji w content specjalistyczny (KOL-written). Dolina 42-48 lat = segment mniejszy niÅ¼ wyglÄ…da.",
    source: "GUS 2024: 14,2% w 40-49 (22 800). Dashboard MZ: ~22 800. Baza remedium: ~9 500."
  },
  {
    id: "senior", name: "Starsi specjaliÅ›ci i KOL", shortName: "Lek. 50â€“55",
    ageLabel: "50â€“55 lat", current: 5100, market: 16000, color: "#0ea5e9",
    monetization: "Creator incentives + pharma", arpu: 0, priority: 3,
    annualInflow: 2800, inflowNote: "wchodzÄ…cych z 49â†’50 (szczyt piramidy!)",
    optIn: 570, optInNote: "NajniÅ¼szy opt-in â€” wielu uwaÅ¼a wiedzÄ™ za darmowÄ…",
    genderF: 48, avgAge: 52,
    topCompetitors: ["mp.pl Premium (2/3 lekarzy)", "Podyplomie.pl (lojalny segment)", "Via Medica (40+ czasopism)"],
    growingSpecs: null,
    shrinkingSpecs: ["Rehabilitacja (âˆ’200)", "Nefrologia (âˆ’167)", "Pulmonologia (âˆ’140)"],
    retention: null, retentionNote: "Opuszcza bracket â‰¤55 â†’ poza TAM",
    description: "OdwrÃ³cony model: wartoÅ›ciowi jako TWÃ“RCY treÅ›ci, nie konsumenci. Ordynatorzy, kierownicy klinik, profesorowie, konsultanci krajowi. Dochody 30-80k+. 1 pozyskany KOL = 10-50 mÅ‚odszych uÅ¼ytkownikÃ³w.",
    recommendations: [
      { type: "product", text: "Panel autora z metrykami (czytelnictwo, cytowania) + kreator kursÃ³w CME z akredytacjÄ… NRL" },
      { type: "product", text: "\"Mentor Hub\" â€” strukturyzowany mentoring rezydentÃ³w z narzÄ™dziami" },
      { type: "monetization", text: "OdwrÃ³cony model: darmowy premium za min. 2 artykuÅ‚y/kwartaÅ‚. Pharma masterclass 10-50k zÅ‚/seria" },
      { type: "growth", text: "Indywidualne pozyskiwanie KOL â€” nie kampanie masowe. 1 KOL = content flywheel" },
    ],
    insight: "NajniÅ¼sza penetracja (32%) ale najwyÅ¼szy efekt mnoÅ¼nikowy. Szczyt piramidy wiekowej: 2 800-3 100/rocznik vs dolina 1 700 przy 42-48. KurczÄ…ce siÄ™ specjalizacje (rehabilitacja, nefrologia) wymagajÄ… pilnej sukcesji.",
    risk: "Wolna adopcja nowych platform. Silna lojalnoÅ›Ä‡ do mp.pl i Podyplomie.pl. Wielu uwaÅ¼a, Å¼e \"wiedza powinna byÄ‡ darmowa\". Pozyskanie wymaga podejÅ›cia indywidualnego.",
    source: "GUS 2024: 16 000 lekarzy 50-55 (dashboard MZ). Baza remedium: ~5 100."
  },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DATA: ROLE-BASED SEGMENTS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ROLE_SEGMENTS = [
  {
    id: "student", name: "Student medycyny (rok 5â€“6)", shortName: "Student",
    ageLabel: "22â€“25 lat", current: 22693, market: 24000, color: "#818cf8",
    monetization: "Freemium, LEK prep", arpu: 30, priority: 3,
    annualInflow: 10000, inflowNote: "nowy nabÃ³r/rok na kierunek lekarski",
    optIn: null, optInNote: "Poza bazÄ… lekarzy",
    genderF: 62, avgAge: 23,
    topCompetitors: ["WiÄ™cej niÅ¼ LEK (~70%)", "ZdamLEK (AI)", "mp.pl (darmowa Interna)"],
    growingSpecs: null, shrinkingSpecs: null,
    retention: 78, retentionNote: "PrzejÅ›cie studentâ†’staÅ¼ysta",
    description: "Studenci medycyny lat 5-6 przygotowujÄ…cy siÄ™ do LEK. Rynek 24 000 (dwa roczniki). Remedium 22,7k â€” penetracja 95%. Roczny nabÃ³r roÅ›nie: 7k (2018) â†’ 10k+ (2024). Limit MZ 2024/25: 9 882 miejsca.",
    recommendations: [
      { type: "product", text: "Bank pytaÅ„ LEK z AI wyjaÅ›nieniami" },
      { type: "retention", text: "Auto-onboarding studentâ†’staÅ¼ysta po LEK â€” krytyczne 78% retencji" },
      { type: "growth", text: "SEO: 'przygotowanie do LEK', 'ranking specjalizacji'" },
    ],
    insight: "Penetracja ~95% â€” segment nasycony. Priorytet: RETENCJA. PrzejÅ›cie studentâ†’staÅ¼ysta to wÄ…skie gardÅ‚o: 22% odpada.",
    risk: "WiÄ™cej niÅ¼ LEK (70% studentÃ³w), Medico PZWL (SuperMemo + AI). LEK-prep to red ocean.",
    source: "Nabory MZ 2024/25: 9 882 miejsc. 2 roczniki Ã— ~12k = ~24k. Remedium: 22 693."
  },
  {
    id: "stazysta", name: "Lekarz staÅ¼ysta", shortName: "StaÅ¼ysta",
    ageLabel: "25â€“26 lat Â· 13 miesiÄ™cy", current: 2887, market: 8000, color: "#f472b6",
    monetization: "Darmowy, pharma ads", arpu: 19, priority: 4,
    annualInflow: 7000, inflowNote: "absolwentÃ³w/rok wchodzÄ…cych na staÅ¼",
    optIn: null, optInNote: "CzÄ™Å›Ä‡ z 2 597 lek. bez specj.",
    genderF: 63, avgAge: 26,
    topCompetitors: ["mp.pl (Interna)", "DrWidget", "Grupy FB 'MÅ‚odzi Lekarze'"],
    growingSpecs: null, shrinkingSpecs: null,
    retention: 85, retentionNote: "PrzejÅ›cie staÅ¼ystaâ†’rezydent",
    description: "StaÅ¼ podyplomowy 13 mies.: rotacje z interny (11 tyg.), pediatrii (8 tyg.), chirurgii (8 tyg.) + 10 tyg. personalizowanych. Wynagrodzenie: 6 798 zÅ‚ brutto (lip. 2024). 2 nabory/rok: 1 marca i 1 paÅºdziernika. MZ pracuje nad skrÃ³ceniem/zniesieniem staÅ¼u (moÅ¼liwe 2027). Sam. woj. mazowieckie = ~1 800 staÅ¼ystÃ³w.",
    recommendations: [
      { type: "product", text: "\"Vademecum StaÅ¼ysty\" â€” checklisty na kaÅ¼dÄ… rotacjÄ™ + SOS DyÅ¼urowy" },
      { type: "product", text: "Szybka baza lekÃ³w z interakcjami (mobile-first)" },
      { type: "growth", text: "Partnerstwo z uczelniami â€” prezentacja na 6. roku" },
      { type: "retention", text: "Push do wyboru specjalizacji â†’ Encyklopedia Rezydentur" },
    ],
    insight: "ðŸ”´ KRYTYCZNA LUKA â€” penetracja 36%, najniÅ¼sza ze wszystkich segmentÃ³w! 5 100 staÅ¼ystÃ³w poza portalem. 13-miesiÄ™czne okno do zbudowania lojalnoÅ›ci przed rezydenturÄ….",
    risk: "Reforma staÅ¼u MZ (zniesienie 2027?). Niskie zarobki = zerowa gotowoÅ›Ä‡ do pÅ‚acenia. Okno trwa tylko 13 mies.",
    source: "Baza remedium: 2 887 staÅ¼ystÃ³w. ~8 000 w systemie (2 nabory Ã— ~4k, 13 mies. cykl). Mazowieckie: ~1 800/rok."
  },
  {
    id: "rezydent", name: "Lekarz rezydent", shortName: "Rezydent",
    ageLabel: "26â€“33 lat Â· 4â€“6 lat szkolenia", current: 9842, market: 38000, color: "#ec4899",
    monetization: "Freemium + premium sub", arpu: 79, priority: 5,
    annualInflow: 10900, inflowNote: "miejsc rezydenckich/rok (jesieÅ„ + wiosna)",
    optIn: null, optInNote: "CzÄ™Å›Ä‡ z ogÃ³lnego opt-in lekarzy",
    genderF: 61, avgAge: 30,
    topCompetitors: ["Medico PZWL (DARMOWY!)", "EgzaminLEK.pl (PES)", "Konsylium24 (43k)"],
    growingSpecs: ["Psychiatria (345 miejsc)", "Neurologia (346)", "Med. rodzinna (598)", "Pediatria (444)"],
    shrinkingSpecs: ["2 800 miejsc nieobsadzonych (2024)"],
    retention: 70, retentionNote: "30% utraty przy przejÅ›ciu PES â†’ specjalista",
    description: "~38 000 rezydentÃ³w w szkoleniu specjalizacyjnym. Szkolenie 4-6 lat. JesieÅ„ 2024: 6 651 miejsc, wiosna 2025: 4 263. Zarobki: priorytetowe 9 368-10 220 zÅ‚ brutto + bon 700 zÅ‚. 17% zmuszanych do dyÅ¼urÃ³w na wielu oddziaÅ‚ach. 23% nie moÅ¼e skonsultowaÄ‡ podczas dyÅ¼uru. Kierownik specjalizacji: zaledwie 1 000 zÅ‚ brutto/mies. za 3 rezydentÃ³w.",
    recommendations: [
      { type: "product", text: "\"Rezydent Dashboard\" â€” tracker procedur + harmonogram + countdown PES" },
      { type: "product", text: "Kursy PES per specjalizacja (55 specjalizacji)" },
      { type: "monetization", text: "\"Rezydent Pro\" 69-99 zÅ‚/mies." },
      { type: "competitive", text: "Counter Medico PZWL: spoÅ‚ecznoÅ›Ä‡ + Mapa WynagrodzeÅ„ + Encyklopedia Rezydentur" },
      { type: "growth", text: "Partnerstwo z Porozumieniem RezydentÃ³w OZZL" },
    ],
    insight: "âš¡ NAJWIÄ˜KSZA SZANSA â€” penetracja 26%, luka 28 158 osÃ³b! Core segment remedium (dziedzictwo BML) a penetracja dramatycznie niska. Medico PZWL oferuje darmowy dostÄ™p + AI â€” ale nie ma spoÅ‚ecznoÅ›ci ani narzÄ™dzi kariery.",
    risk: "Medico PZWL: free + AI + 150k dokumentÃ³w. EgzaminLEK.pl dominuje PES-prep. 2 800 miejsc nieobsadzonych = mniejszy inflow niÅ¼ capacity. Frustracja systemowa â†’ emigracja.",
    source: "MZ 2024/25: ~38k rezydentÃ³w. JesieÅ„ 2024: 6 651 miejsc. Baza remedium: 9 842."
  },
  {
    id: "specjalista", name: "Lekarz specjalista", shortName: "Specjalista",
    ageLabel: "30â€“65+ lat Â· po PES", current: 16433, market: 91100, color: "#f59e0b",
    monetization: "Sub premium + B2B pharma", arpu: 169, priority: 4,
    annualInflow: 5000, inflowNote: "nowych specjalistÃ³w/rok (zdajÄ…cy PES)",
    optIn: 4568, optInNote: "Interna 863, rodzinna 703, pediatria 579",
    genderF: 52, avgAge: 48,
    topCompetitors: ["mp.pl Premium (90%)", "Termedia (400k)", "UpToDate", "Via Medica"],
    growingSpecs: ["Psychiatria (+1 228)", "Radiologia (+1 076)", "Med. rodzinna (+1 064)"],
    shrinkingSpecs: ["Ch. wewnÄ™trzne (âˆ’1 790!)", "Chirurgia og. (âˆ’439)", "Rehabilitacja (âˆ’200)"],
    retention: null, retentionNote: "Segment docelowy â€” emerytury jedyny outflow",
    description: "91 100 specjalistÃ³w pracujÄ…cych z pacjentem (GUS 2024, 64,5% ogÃ³Å‚u lekarzy). NajwiÄ™ksze: interna (18,2k), med. rodzinna (10,8k), pediatria (7,4k). Dochody: 15k-80k+ brutto. Od mÅ‚odych spec. po PES (30+) do KOL i ordynatorÃ³w (65+). Pharma sweet spot: decydenci recepcyjni, advisory boards, KOL. 200 pkt CME/4 lata obligatoryjne.",
    recommendations: [
      { type: "product", text: "CME Dashboard â€” Å›ledzenie 200 pkt/4 lata + kalendarz konferencji" },
      { type: "product", text: "Wytyczne \"executive summary\" per specjalizacja" },
      { type: "monetization", text: "\"Expert\" 149-249 zÅ‚/mies. + pharma sponsoring 5-20k/mies. per sekcja" },
      { type: "growth", text: "Akredytacja NRL kursÃ³w CME â€” WARUNEK KONIECZNY" },
      { type: "growth", text: "Panel autora dla KOL + Mentor Hub" },
    ],
    insight: "âš  OGROMNA LUKA â€” penetracja 18%, brakuje 74 667 specjalistÃ³w! NajwyÅ¼szy potencjaÅ‚ ARPU (169 zÅ‚) i pharma. Ale segment zdominowany przez mp.pl i Termedia. Bez akredytacji NRL kursÃ³w CME â€” niedostÄ™pny.",
    risk: "mp.pl Premium = standard branÅ¼y (90% lekarzy). Termedia dominuje konferencje i pharma. Bez CME accreditation remedium to \"nice to have\". Segment wymaga KOL-written content.",
    source: "GUS 2024: 91 100 specjalistÃ³w bezpoÅ›rednio z pacjentem. Remedium: 16 433."
  },
  {
    id: "bez_spec", name: "Lekarz bez specjalizacji", shortName: "Bez specjalizacji",
    ageLabel: "RÃ³Å¼ne Â· po staÅ¼u, bez rezydentur", current: 27692, market: 20000, color: "#6ee7b7",
    monetization: "Freemium â†’ konwersja na rezydenta", arpu: 25, priority: 3,
    annualInflow: null, inflowNote: "Segment przejÅ›ciowy â€” lekarze w trakcie decyzji",
    optIn: 2597, optInNote: "NajwiÄ™ksza grupa opt-in (2 597 z 7 165)",
    genderF: 58, avgAge: 29,
    topCompetitors: ["mp.pl", "Konsylium24", "Grupy FB"],
    growingSpecs: null, shrinkingSpecs: null,
    retention: null, retentionNote: "Wielu przechodzi na rezydenta (nie aktualizuje profilu)",
    description: "~20 000 lekarzy po staÅ¼u, ktÃ³rzy nie rozpoczÄ™li/ukoÅ„czyli rezydentur lub pracujÄ… bez specjalizacji (POZ, NFZ, przemysÅ‚). Remedium ma 27 692 â€” PRZESYCENIE 139%. Oznacza to masowÄ… miskategoryzacjÄ™: wielu to de facto rezydenci lub specjaliÅ›ci, ktÃ³rzy nie zaktualizowali statusu w portalu.",
    recommendations: [
      { type: "product", text: "Automatyczna weryfikacja statusu â€” API do CRL/CMKP â†’ auto-aktualizacja roli" },
      { type: "retention", text: "Kampania re-onboardingowa: \"Zaktualizuj swÃ³j status â†’ odblokuj treÅ›ci\"" },
      { type: "growth", text: "Onboarding flow wymuszajÄ…cy wybÃ³r: staÅ¼ysta/rezydent/specjalista" },
      { type: "product", text: "Integracja WÄ™zeÅ‚ Krajowy â†’ PESEL â†’ CRL = pewna weryfikacja" },
    ],
    insight: "âš  PRZESYCENIE 139% â€” baza remedium (27,7k) przewyÅ¼sza rynek (~20k). To sygnaÅ‚ miskategoryzacji: wielu \"bez specjalizacji\" to rezydenci lub specjaliÅ›ci z nieaktualnym profilem. Priorytet: re-onboarding i czyszczenie bazy.",
    risk: "ZawyÅ¼ona baza = faÅ‚szywy obraz penetracji. Bez czyszczenia nie moÅ¼na liczyÄ‡ prawdziwego conversion rate. Segment 'bez specj.' nie jest monetyzowalny â€” to bufor tranzytowy.",
    source: "Baza remedium: 27 692. Szac. rynek: ~20k (141,2k GUS âˆ’ 91,1k spec. âˆ’ 38k rezyd. âˆ’ 8k staÅ¼yst. + korekty)."
  },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SHARED DATA
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PROJECTIONS = [
  { year: 2024, women: 56174, men: 35371 },
  { year: 2025, women: 58100, men: 36200 },
  { year: 2026, women: 60100, men: 37100 },
  { year: 2027, women: 62200, men: 38000 },
  { year: 2028, women: 64400, men: 38900 },
  { year: 2029, women: 66700, men: 39900 },
  { year: 2030, women: 69100, men: 40900 },
  { year: 2031, women: 71600, men: 41900 },
  { year: 2032, women: 74200, men: 43000 },
  { year: 2033, women: 76500, men: 44000 },
  { year: 2034, women: 78900, men: 45100 },
];

const SPEC_DYNAMICS = [
  { name: "Psychiatria", delta: 1228, color: "#10b981" },
  { name: "Radiologia", delta: 1076, color: "#10b981" },
  { name: "Med. rodzinna", delta: 1064, color: "#10b981" },
  { name: "Ortopedia", delta: 796, color: "#10b981" },
  { name: "Kardiologia", delta: 614, color: "#10b981" },
  { name: "Onkologia", delta: 357, color: "#10b981" },
  { name: "Nefrologia", delta: -167, color: "#ef4444" },
  { name: "Pulmonologia", delta: -140, color: "#ef4444" },
  { name: "Med. pracy", delta: -212, color: "#ef4444" },
  { name: "Chirurgia og.", delta: -439, color: "#ef4444" },
  { name: "Ch. wewnÄ™trzne", delta: -1790, color: "#ef4444" },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HELPERS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const fmt = (n) => n.toLocaleString("pl-PL");
const fmtK = (n) => n >= 1000 ? (n/1000).toFixed(1) + "k" : String(n);
const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

const Stars = ({ count }) => (
  <span style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize: 10, color: i <= count ? "#f59e0b" : "#1f2937" }}>â˜…</span>
    ))}
  </span>
);

const BADGE_STYLES = {
  product: { bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.25)" },
  growth: { bg: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "rgba(16,185,129,0.25)" },
  monetization: { bg: "rgba(245,158,11,0.12)", color: "#fcd34d", border: "rgba(245,158,11,0.25)" },
  retention: { bg: "rgba(6,182,212,0.12)", color: "#67e8f9", border: "rgba(6,182,212,0.25)" },
  competitive: { bg: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "rgba(239,68,68,0.25)" },
};
const BADGE_LABELS = { product: "Produkt", growth: "Wzrost", monetization: "Monetyzacja", retention: "Retencja", competitive: "Konkurencja" };

const Badge = ({ type }) => {
  const s = BADGE_STYLES[type];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
      padding: "2px 6px", borderRadius: 4,
      backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{BADGE_LABELS[type]}</span>
  );
};

const Card = ({ children, style, accent, ...props }) => (
  <div style={{
    backgroundColor: accent ? "rgba(236,72,153,0.06)" : "rgba(255,255,255,0.025)",
    border: accent ? "1px solid rgba(236,72,153,0.18)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12, padding: 12, ...style,
  }} {...props}>{children}</div>
);

const KPI = ({ label, value, sub, accent, small }) => (
  <div style={{
    borderRadius: 8, padding: 10,
    background: accent ? "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(168,85,247,0.1))" : "rgba(255,255,255,0.025)",
    border: accent ? "1px solid rgba(236,72,153,0.2)" : "1px solid rgba(255,255,255,0.06)",
  }}>
    <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.3 }}>{label}</div>
    <div style={{ fontWeight: 700, marginTop: 2, fontSize: small ? 14 : 18, color: accent ? "#f472b6" : "#f3f4f6" }}>{value}</div>
    {sub && <div style={{ fontSize: 9, color: "#4b5563", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>}
  </div>
);

const ChartTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: 8, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", fontSize: 12 }}>
      <div style={{ fontWeight: 600, color: "#f9fafb", marginBottom: 4 }}>{d.name || d.year}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "#9ca3af" }}>{p.name || p.dataKey}:</span>
          <span style={{ fontWeight: 500, color: p.color || "#fff" }}>{typeof p.value === "number" ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   VIEW TOGGLE (Wiek / Rola)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ViewToggle = ({ view, setView }) => {
  const opts = [
    { key: "age", label: "ðŸ“Š wg Wieku", sub: "5 segmentÃ³w wiekowych" },
    { key: "role", label: "ðŸŽ¯ wg Roli", sub: "5 statusÃ³w zawodowych" },
  ];
  return (
    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
      {opts.map(o => (
        <button key={o.key} onClick={() => setView(o.key)} style={{
          padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
          border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          backgroundColor: view === o.key ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.02)",
          color: view === o.key ? "#f9fafb" : "#6b7280",
          borderRight: o.key === "age" ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}>
          <span>{o.label}</span>
          <span style={{ fontSize: 8, opacity: 0.6 }}>{o.sub}</span>
        </button>
      ))}
    </div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN COMPONENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function MarketGapV4() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [view, setView] = useState("age");

  const SEGMENTS = view === "age" ? AGE_SEGMENTS : ROLE_SEGMENTS;

  const totals = useMemo(() => {
    const current = SEGMENTS.reduce((s, seg) => s + seg.current, 0);
    const market = SEGMENTS.reduce((s, seg) => s + seg.market, 0);
    return { current, market, gap: market - current, pen: pct(current, market), optIn: 7165 };
  }, [SEGMENTS]);

  const chartData = SEGMENTS.map(seg => {
    const gap = Math.max(0, seg.market - seg.current);
    const pen = pct(seg.current, seg.market);
    const opp = gap * seg.arpu * 12 * 0.06;
    return { name: seg.shortName, current: seg.current, gap, market: seg.market, penetration: pen, opportunity: opp };
  });

  const sel = selected !== null && selected < SEGMENTS.length ? SEGMENTS[selected] : null;

  const tabs = [
    { key: "overview", label: "ðŸ“Š PrzeglÄ…d" },
    { key: "segments", label: "ðŸ‘¥ Segmenty" },
    { key: "dynamics", label: "ðŸ“ˆ Dynamika" },
  ];

  const S = {
    page: { minHeight: "100vh", backgroundColor: "#0a0b0f", color: "#e5e7eb", fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif" },
    header: { background: "linear-gradient(90deg, #0f1118, #12131c)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px" },
    container: { maxWidth: 1400, margin: "0 auto" },
    tabActive: { padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" },
    tabInactive: { padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: "transparent", color: "#6b7280", border: "1px solid transparent", cursor: "pointer" },
    sectionBg: { backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16 },
    label: { fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },
    h2: { fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 12 },
    h3: { fontSize: 12, fontWeight: 700, color: "#f9fafb", marginBottom: 12 },
  };

  const handleViewSwitch = (v) => {
    setView(v);
    setSelected(null);
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ ...S.container, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #ec4899, #9333ea)", fontSize: 14, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 12px rgba(236,72,153,0.2)",
            }}>R</div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>remedium.md â€” Analiza rynku v4</h1>
              <p style={{ fontSize: 10, color: "#4b5563", margin: 0 }}>Lekarze â‰¤55 r.Å¼. Â· GUS 2024 Â· Dashboard MZ Â· baza remedium 7.02.2026</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ViewToggle view={view} setView={handleViewSwitch} />
            <div style={{ width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => { setTab(t.key); setSelected(null); }}
                  style={tab === t.key ? S.tabActive : S.tabInactive}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...S.container, padding: 16 }}>

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* View label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Widok:</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                backgroundColor: view === "age" ? "rgba(129,140,248,0.15)" : "rgba(236,72,153,0.15)",
                color: view === "age" ? "#a5b4fc" : "#f472b6",
                border: `1px solid ${view === "age" ? "rgba(129,140,248,0.3)" : "rgba(236,72,153,0.3)"}`,
              }}>
                {view === "age" ? "ðŸ“Š Segmenty wiekowe (studenci + lekarze â‰¤55)" : "ðŸŽ¯ Role zawodowe (student â†’ specjalista)"}
              </span>
              {view === "role" && (
                <span style={{ fontSize: 10, color: "#4b5563", fontStyle: "italic" }}>
                  âš  Suma â‰  100% rynku â€” role siÄ™ nakÅ‚adajÄ… z wiekiem
                </span>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
              <KPI label={view === "age" ? "Rynek docelowy â‰¤55" : "Suma segmentÃ³w (role)"} value={fmt(totals.market)} sub={view === "role" ? "role siÄ™ nakÅ‚adajÄ… â€” nie sumowaÄ‡!" : "lekarzy + studentÃ³w 5-6"} />
              <KPI label="Baza remedium" value={fmt(totals.current)} sub="zweryfikowani uÅ¼ytkownicy" />
              <KPI label="Penetracja wg" value={totals.pen + "%"} sub={view === "age" ? "segmentÃ³w wiekowych" : "rÃ³l zawodowych"} accent />
              <KPI label="Luka" value={fmt(Math.max(0, totals.gap))} sub={totals.gap > 0 ? pct(totals.gap, totals.market) + "% rynku" : "przesycenie w niektÃ³rych"} />
              <KPI label="Opt-in marketing" value={fmt(totals.optIn)} sub={pct(totals.optIn, 56854) + "% lekarzy"} />
              <KPI label="Nowi lekarze/rok" value="~6 000" sub="absolwentÃ³w (rosnÄ…c do 8k)" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div style={S.sectionBg}>
                <h2 style={S.h2}>
                  {view === "age" ? "Obecni vs luka â€” segmenty wiekowe" : "Obecni vs luka â€” role zawodowe"}
                  <span style={{ fontSize: 10, color: "#4b5563", fontWeight: 400, marginLeft: 8 }}>ÅºrÃ³dÅ‚o: GUS 2024 + MZ + baza remedium</span>
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} onClick={(e) => { if (e?.activeTooltipIndex !== undefined) { setSelected(e.activeTooltipIndex); setTab("segments"); } }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1b25" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickFormatter={fmtK} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="current" stackId="a" name="Obecni" cursor="pointer">
                      {chartData.map((_, i) => <Cell key={i} fill={SEGMENTS[i].color} />)}
                    </Bar>
                    <Bar dataKey="gap" stackId="a" name="Luka" radius={[4,4,0,0]} cursor="pointer">
                      {chartData.map((_, i) => <Cell key={i} fill={SEGMENTS[i].color} fillOpacity={0.12} stroke={SEGMENTS[i].color} strokeWidth={1} strokeDasharray="4 2" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4, fontSize: 10, color: "#6b7280" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#ec4899", display: "inline-block" }} /> Obecni</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, border: "1px dashed #ec4899", background: "rgba(236,72,153,0.1)", display: "inline-block" }} /> Luka</span>
                  <span>Â· Kliknij â†’ szczegÃ³Å‚y</span>
                </div>
              </div>

              <div style={S.sectionBg}>
                <h2 style={S.h2}>Penetracja {view === "age" ? "wg wieku" : "wg roli"}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SEGMENTS.map((seg, i) => {
                    const pen = pct(seg.current, seg.market);
                    const penCap = Math.min(pen, 100);
                    const isOver = pen > 100;
                    const penColor = isOver ? "#22d3ee" : pen > 80 ? "#34d399" : pen > 50 ? "#fbbf24" : "#f87171";
                    return (
                      <button key={seg.id} onClick={() => { setSelected(i); setTab("segments"); }}
                        style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                          <span style={{ fontSize: 12, color: "#d1d5db" }}>{seg.shortName}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: penColor }}>
                            {pen + "%"}{isOver && " âš "}
                          </span>
                        </div>
                        <div style={{ height: 8, backgroundColor: "rgba(31,41,55,0.6)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, width: penCap + "%", backgroundColor: seg.color, transition: "width 0.5s" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#4b5563", marginTop: 2 }}>
                          <span>{fmtK(seg.current)}</span>
                          <span>rynek: {fmtK(seg.market)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
              {SEGMENTS.map((seg) => {
                const gap = Math.max(0, seg.market - seg.current);
                const rev = gap * seg.arpu * 12 * 0.06;
                const pen = pct(seg.current, seg.market);
                const isOver = pen > 100;
                return (
                  <div key={seg.id} style={S.sectionBg}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: seg.color, display: "inline-block" }} />
                      <span style={{ fontSize: 10, fontWeight: 500, color: "#9ca3af" }}>{seg.shortName}</span>
                      {isOver && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 99, backgroundColor: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" }}>przesycony</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, textAlign: "center" }}>
                      <div><div style={{ fontSize: 8, color: "#4b5563" }}>Luka</div><div style={{ fontSize: 12, fontWeight: 700, color: isOver ? "#22d3ee" : "#f472b6" }}>{isOver ? "âˆ’" + fmtK(seg.current - seg.market) : gap > 0 ? fmtK(gap) : "â€”"}</div></div>
                      <div><div style={{ fontSize: 8, color: "#4b5563" }}>ARPU</div><div style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>{seg.arpu > 0 ? seg.arpu + "zÅ‚" : "â€”"}</div></div>
                      <div><div style={{ fontSize: 8, color: "#4b5563" }}>PotencjaÅ‚/rok</div><div style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>{rev > 0 ? fmtK(Math.round(rev)) : isOver ? "retencja" : "pharma"}</div></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic insights â€” context-sensitive */}
            <Card style={{ background: "linear-gradient(135deg, #0f1220, #121525)", border: "1px solid rgba(255,255,255,0.06)", padding: 16 }}>
              <h3 style={S.h3}>ðŸ”‘ Kluczowe wnioski â€” {view === "age" ? "perspektywa wiekowa" : "perspektywa rÃ³l zawodowych"}</h3>
              {view === "age" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                    <p style={{ margin: 0 }}><span style={{ color: "#34d399", fontWeight: 600 }}>âœ“ Silna pozycja â‰¤29 lat</span> â€” penetracja 74-95%. Dziedzictwo BML. Priorytet: retencja, nie akwizycja.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#fbbf24", fontWeight: 600 }}>âš¡ Pole bitwy: 30-39</span> â€” 14 100 luki. Medico PZWL darmowy dla rezydentÃ³w. Wygrywaj spoÅ‚ecznoÅ›ciÄ… i narzÄ™dziami kariery.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#f87171", fontWeight: 600 }}>âš  SÅ‚aby punkt: 40+</span> â€” 24k brakujÄ…cych, najwyÅ¼szy ARPU. Bez akredytacji NRL kursÃ³w CME segment niedostÄ™pny.</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                    <p style={{ margin: 0 }}><span style={{ color: "#22d3ee", fontWeight: 600 }}>ðŸ“Š Dolina 42-48 lat</span> â€” 1 700/rocznik vs 3 100 przy 55 lat. Segment 40-49 mniejszy niÅ¼ wyglÄ…da.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#f472b6", fontWeight: 600 }}>ðŸ“ˆ Rynek +3%/rok</span> â€” 6 000 absolwentÃ³w/rok (â†’8k). Do utrzymania 63% pen.: +1 500 uÅ¼ytkownikÃ³w/rok.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#a78bfa", fontWeight: 600 }}>ðŸŽ¯ Opt-in 13%</span> â€” 7 165 lekarzy z zgodÄ… mktg. Bariera monetyzacji pharma.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                    <p style={{ margin: 0 }}><span style={{ color: "#f87171", fontWeight: 600 }}>ðŸ”´ StaÅ¼yÅ›ci: 36% penetracji</span> â€” najsÅ‚abszy segment! 5 100 staÅ¼ystÃ³w poza portalem. 13-mies. okno do zbudowania lojalnoÅ›ci.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#ec4899", fontWeight: 600 }}>âš¡ Rezydenci: 26% penetracji</span> â€” 28k luki w core segmencie! Medico PZWL darmowy. Remedium musi wygraÄ‡ narzÄ™dziami kariery.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#f59e0b", fontWeight: 600 }}>âš  SpecjaliÅ›ci: 18% penetracji</span> â€” 74,7k brakujÄ…cych. NajwyÅ¼sze ARPU. mp.pl dominuje. Wymaga akredytacji NRL.</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#9ca3af" }}>
                    <p style={{ margin: 0 }}><span style={{ color: "#22d3ee", fontWeight: 600 }}>âš  Bez specj.: 139% przesycenie</span> â€” 27,7k vs 20k rynek. Miskategoryzacja profili â†’ re-onboarding i czyszczenie bazy.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#34d399", fontWeight: 600 }}>âœ“ Studenci: 95% penetracji</span> â€” segment nasycony. Priorytet: retencja 78% przy przejÅ›ciu na staÅ¼.</p>
                    <p style={{ margin: 0 }}><span style={{ color: "#a78bfa", fontWeight: 600 }}>ðŸ”— ÅšcieÅ¼ka kariery</span> â€” widok wg roli = lejek konwersji. WÄ…skie gardÅ‚a: studentâ†’staÅ¼ysta (78%), rezydentâ†’specjalista (70%).</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ===== SEGMENTS ===== */}
        {tab === "segments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* View label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Widok:</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                backgroundColor: view === "age" ? "rgba(129,140,248,0.15)" : "rgba(236,72,153,0.15)",
                color: view === "age" ? "#a5b4fc" : "#f472b6",
                border: `1px solid ${view === "age" ? "rgba(129,140,248,0.3)" : "rgba(236,72,153,0.3)"}`,
              }}>
                {view === "age" ? "ðŸ“Š wg Wieku" : "ðŸŽ¯ wg Roli"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {SEGMENTS.map((seg, i) => {
                const pen = pct(seg.current, seg.market);
                const isActive = selected === i;
                const isOver = pen > 100;
                return (
                  <button key={seg.id} onClick={() => setSelected(selected === i ? null : i)}
                    style={{
                      flexShrink: 0, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
                      color: isActive ? "#fff" : "#6b7280",
                      border: isActive ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.04)",
                    }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, display: "inline-block", marginRight: 6, backgroundColor: seg.color }} />
                    {seg.shortName}
                    <span style={{ marginLeft: 8, fontWeight: 700, color: isOver ? "#22d3ee" : pen > 80 ? "#34d399" : pen > 50 ? "#fbbf24" : "#f87171" }}>
                      {pen + "%"}{isOver && " âš "}
                    </span>
                  </button>
                );
              })}
            </div>

            {selected === null && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 12, color: "#6b7280", fontStyle: "italic", margin: 0 }}>Wybierz segment powyÅ¼ej â†’ szczegÃ³Å‚owa analiza i rekomendacje.</p>
                {SEGMENTS.map((seg, i) => {
                  const pen = pct(seg.current, seg.market);
                  const gap = Math.max(0, seg.market - seg.current);
                  const isOver = pen > 100;
                  return (
                    <button key={seg.id} onClick={() => setSelected(i)}
                      style={{
                        textAlign: "left", cursor: "pointer", width: "100%",
                        backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 12, padding: 12, color: "#e5e7eb",
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 99, flexShrink: 0, backgroundColor: seg.color, display: "inline-block" }} />
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#f9fafb" }}>{seg.name}</span>
                            <Stars count={seg.priority} />
                          </div>
                          <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 0 18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{seg.insight}</p>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexShrink: 0, textAlign: "center" }}>
                          <div><div style={{ fontSize: 9, color: "#4b5563" }}>Pen.</div><div style={{ fontSize: 14, fontWeight: 700, color: isOver ? "#22d3ee" : pen > 80 ? "#34d399" : pen > 50 ? "#fbbf24" : "#f87171" }}>{pen + "%"}{isOver && " âš "}</div></div>
                          <div><div style={{ fontSize: 9, color: "#4b5563" }}>Luka</div><div style={{ fontSize: 14, fontWeight: 700, color: isOver ? "#22d3ee" : "#f472b6" }}>{isOver ? "âˆ’" + fmtK(seg.current - seg.market) : gap > 0 ? fmtK(gap) : "â€”"}</div></div>
                          <div><div style={{ fontSize: 9, color: "#4b5563" }}>ARPU</div><div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>{seg.arpu > 0 ? seg.arpu + "zÅ‚" : "pharma"}</div></div>
                          {seg.annualInflow && <div><div style={{ fontSize: 9, color: "#4b5563" }}>NapÅ‚yw</div><div style={{ fontSize: 14, fontWeight: 700, color: "#22d3ee" }}>{fmtK(seg.annualInflow)}</div></div>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {sel && (() => {
              const pen = pct(sel.current, sel.market);
              const gap = Math.max(0, sel.market - sel.current);
              const isOver = pen > 100;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Card style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: sel.color, display: "inline-block" }} />
                          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>{sel.name}</h2>
                          <Stars count={sel.priority} />
                        </div>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 0 20px" }}>{sel.ageLabel} Â· Åšr. wiek: {sel.avgAge} Â· {sel.genderF}% kobiet</p>
                      </div>
                      <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 14, padding: 4 }}>âœ•</button>
                    </div>
                    <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{sel.description}</p>
                  </Card>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
                    <KPI label="Obecni" value={fmt(sel.current)} small />
                    <KPI label="Rynek" value={fmt(sel.market)} small />
                    <KPI label={isOver ? "NadwyÅ¼ka" : "Luka"} value={isOver ? "+" + fmt(sel.current - sel.market) : gap > 0 ? fmt(gap) : "â€”"} accent small />
                    <KPI label="Penetracja" value={pen + "%"} sub={isOver ? "âš  przesycony" : pen > 80 ? "âœ“ silna" : pen > 50 ? "â— umiark." : "âš  sÅ‚aba"} small />
                    <KPI label="ARPU" value={sel.arpu > 0 ? sel.arpu + " zÅ‚" : "pharma"} sub={sel.monetization} small />
                    <KPI label="NapÅ‚yw/rok" value={sel.annualInflow ? "~" + fmtK(sel.annualInflow) : "â€”"} sub={sel.inflowNote} small />
                    <KPI label="Opt-in" value={sel.optIn ? fmt(sel.optIn) : "â€”"} sub={sel.optInNote} small />
                    <KPI label="Retencja" value={sel.retention ? sel.retention + "%" : "â€”"} sub={sel.retentionNote} small />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Card style={{ backgroundColor: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
                      <div style={{ fontSize: 10, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>ðŸ“ˆ Ocena i szansa</div>
                      <p style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.6, margin: 0 }}>{sel.insight}</p>
                    </Card>
                    <Card style={{ backgroundColor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <div style={{ fontSize: 10, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>âš ï¸ Ryzyka i zagroÅ¼enia</div>
                      <p style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.6, margin: 0 }}>{sel.risk}</p>
                    </Card>
                  </div>

                  <Card>
                    <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8 }}>GÅ‚Ã³wna konkurencja</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {sel.topCompetitors.map((c, j) => (
                        <span key={j} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}>{c}</span>
                      ))}
                    </div>
                  </Card>

                  {(sel.growingSpecs || sel.shrinkingSpecs) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {sel.growingSpecs && (
                        <Card>
                          <div style={{ fontSize: 10, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>RosnÄ…ce specjalizacje</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {sel.growingSpecs.map((s, j) => <span key={j} style={{ fontSize: 11, color: "#d1d5db" }}>+ {s}</span>)}
                          </div>
                        </Card>
                      )}
                      {sel.shrinkingSpecs && (
                        <Card>
                          <div style={{ fontSize: 10, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 6 }}>KurczÄ…ce siÄ™ / zagroÅ¼enia</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {sel.shrinkingSpecs.map((s, j) => <span key={j} style={{ fontSize: 11, color: "#d1d5db" }}>âˆ’ {s}</span>)}
                          </div>
                        </Card>
                      )}
                    </div>
                  )}

                  <Card>
                    <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8 }}>ðŸŽ¯ Rekomendacje</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {sel.recommendations.map((r, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <Badge type={r.type} />
                          <span style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.4 }}>{r.text}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div style={{ fontSize: 10, color: "#374151", fontStyle: "italic", textAlign: "right" }}>Å¹rÃ³dÅ‚o: {sel.source}</div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ===== DYNAMICS ===== */}
        {tab === "dynamics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={S.sectionBg}>
              <h2 style={S.h2}>Prognoza podaÅ¼y lekarzy â‰¤55 r.Å¼. (2024â€“2034) â€” model remedium</h2>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={PROJECTIONS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1b25" />
                  <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickFormatter={fmtK} domain={[80000, 140000]} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="men" stackId="1" name="MÄ™Å¼czyÅºni" fill="#6366f1" fillOpacity={0.3} stroke="#6366f1" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="women" stackId="1" name="Kobiety" fill="#ec4899" fillOpacity={0.3} stroke="#ec4899" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4, fontSize: 10, color: "#6b7280" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(236,72,153,0.5)", display: "inline-block" }} /> Kobiety</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "rgba(99,102,241,0.5)", display: "inline-block" }} /> MÄ™Å¼czyÅºni</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={S.sectionBg}>
                <h2 style={{ ...S.h2, marginBottom: 4 }}>WymienialnoÅ›Ä‡ specjalistÃ³w (netto 2024â†’2030)</h2>
                <p style={{ fontSize: 10, color: "#4b5563", marginBottom: 12, marginTop: 0 }}>Nowi minus emerytury. Zielone = roÅ›nie, czerwone = kurczy siÄ™.</p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={SPEC_DYNAMICS} layout="vertical" margin={{ left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1b25" />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} width={100} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="delta" name="Bilans netto" radius={[4,4,4,4]}>
                      {SPEC_DYNAMICS.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.7} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={S.sectionBg}>
                <h2 style={{ ...S.h2, marginBottom: 4 }}>Lejek Å›cieÅ¼ki kariery â€” retencja remedium</h2>
                <p style={{ fontSize: 10, color: "#4b5563", marginBottom: 16, marginTop: 0 }}>Gdzie tracimy uÅ¼ytkownikÃ³w na Å›cieÅ¼ce kariery lekarza.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Student â†’ remedium", value: "95%", sub: "22,7k / 24k â€” niemal peÅ‚ne nasycenie", color: "#818cf8", w: "95%" },
                    { label: "Student â†’ StaÅ¼ysta", value: "78%", sub: "Retencja: 22% drop. Krytyczne przejÅ›cie!", color: "#f472b6", w: "78%" },
                    { label: "StaÅ¼ysta â†’ Rezydent", value: "85%", sub: "Retencja dobra, ale 36% pen. staÅ¼ystÃ³w", color: "#ec4899", w: "66%" },
                    { label: "Rezydent â†’ Specjalista", value: "70%", sub: "30% utraty przy PES! NajwiÄ™ksza dziura", color: "#f59e0b", w: "46%" },
                    { label: "Specjalista (retencja)", value: "18%", sub: "Pen. specjalistÃ³w â€” 74,7k brakujÄ…cych", color: "#ef4444", w: "18%" },
                  ].map((step, j) => (
                    <div key={j}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{step.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: step.color }}>{step.value}</span>
                      </div>
                      <div style={{ height: 8, backgroundColor: "rgba(31,41,55,0.5)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, width: step.w, backgroundColor: step.color, opacity: 0.6 }} />
                      </div>
                      <div style={{ fontSize: 9, color: "#4b5563", marginTop: 2 }}>{step.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>ðŸ“Š WÄ…skie gardÅ‚a</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#9ca3af" }}>
                    <p style={{ margin: 0 }}>â€¢ <strong style={{ color: "#f472b6" }}>Studentâ†’StaÅ¼ysta</strong>: 22% drop â€” brak auto-onboardingu po LEK</p>
                    <p style={{ margin: 0 }}>â€¢ <strong style={{ color: "#f59e0b" }}>Rezydentâ†’Specjalista</strong>: 30% drop â€” PES = moment decyzji</p>
                    <p style={{ margin: 0 }}>â€¢ <strong style={{ color: "#ef4444" }}>SpecjaliÅ›ci: 18% pen.</strong> â€” segment wymaga innej strategii (KOL + CME)</p>
                  </div>
                </div>
              </div>
            </div>

            <Card style={{ background: "linear-gradient(135deg, #0f1220, #121525)", border: "1px solid rgba(255,255,255,0.06)", padding: 16 }}>
              <h3 style={S.h3}>ðŸ“Š SpostrzeÅ¼enia demograficzne</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12, color: "#9ca3af" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#22d3ee", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Dolina demograficzna 42-48</div>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>1 700-1 800 lekarzy/rocznik vs 3 100 przy 55 lat. Segment 40-49 fizycznie mniejszy niÅ¼ sugeruje przedziaÅ‚.</p>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#f472b6", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Feminizacja zawodu</div>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>60% kobiet â†’ 63% do 2034. WÅ›rÃ³d â‰¤29 juÅ¼ 63%. UX: work-life balance, elastyczne formy pracy.</p>
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.025)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Fala emerytalna</div>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>~3 000/rok opuszcza bracket â‰¤55. ZagroÅ¼one: interna (âˆ’1 790), chirurgia (âˆ’439), med. pracy (âˆ’212).</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 10, color: "#374151", textAlign: "center" }}>
          Å¹rÃ³dÅ‚a: GUS â€žZasoby kadrowe" 28.08.2025 (2024) Â· Dashboard kadrowy MZ Â· Baza remedium.md 7.02.2026 Â· MZ limity rezydenckie Â· Prognoza podaÅ¼y MZ/GUS Â· Compass. Opracowanie wÅ‚asne na podst. danych GUS.
        </div>
      </div>
    </div>
  );
}

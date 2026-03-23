# PRD: Propozycja produktowa dla specjalistów

**Autor:** Sebastian / Growth | **Data:** 15 marca 2026
**Status:** Draft | **Priorytet:** P0

---

## Problem Statement

Remedium ma 22,733 specjalistów w bazie, ale nie ma dla nich dedykowanej propozycji wartości. Specjalista rejestruje się i trafia na ten sam generyczny dashboard co student pierwszego roku. Efekt: niska retencja, niski MAU, a co za tym idzie — niewystarczająca pojemność kampanii display targetowanych po specjalizacji.

87% kampanii pharma w 2024 targetowało ALL/POZ, bo na specjalizacjach brakuje ruchu. Na kardiologii średni PV per kampanię to 1,463 (vs offer 2,900). Na ginekologii: 339 (vs offer 2,900). To utracony przychód — pharma chce kupować specjalizacje, ale Remedium nie ma czym ich obsłużyć.

**Jeśli tego nie rozwiążemy:** Remedium zostaje portalem "dla wszystkich = dla nikogo", specjaliści odchodzą do mp.pl i Termedia po content, kampanie pharma na specjalizacje są niesprzedawalne, revenue jest ograniczony do broad targetingu ALL/POZ.

---

## Goals

1. **Podnieść MAU specjalistów o 30% w 6 miesięcy** od launchu dedykowanego doświadczenia — z szacowanych ~50% do 65% bazy aktywnej miesięcznie
2. **Odblokować sprzedaż kampanii na 3+ nowe specjalizacje** — które dziś nie mają wystarczającej pojemności (kardiologia, ginekologia, psychiatria)
3. **Zwiększyć PV per session specjalistów o 40%** — więcej głębokości wizyty = więcej impressions per user
4. **Zebrać brakujące dane specjalizacji** od 80%+ rezydentów w ciągu 3 miesięcy — odblokowanie ich dla kampanii targetowanych
5. **Zbudować retencję W4 specjalistów >70%** — wraca co tydzień, nie raz na kwartał

---

## Non-Goals

1. **Nie budujemy encyklopedii klinicznej.** mp.pl ma 30 lat treści i 90% lekarzy. Medico PZWL ma MediChat AI. Nie wygramy tej bitwy. Treści kliniczne na Remedium to curated summaries i wytyczne w formie digestu — nie pełna baza wiedzy.
2. **Nie budujemy systemu do przygotowania do PES.** To zadanie dla EgzaminLEK.pl i Medfellows. PES content może być elementem propozycji, ale nie core.
3. **Nie budujemy AI chata klinicznego.** MediChat (PZWL), MedscapeAI, UpToDate Expert AI — ta przestrzeń jest zajęta i wymaga ogromnych inwestycji w walidację treści.
4. **Nie targetujemy dentystów.** Odseparowujemy ich — nie generują wartości dla kampanii pharma (leki na receptę).
5. **Nie budujemy osobnych dashboardów per specjalizacja od razu.** Faza 1 to jeden "specialist mode" z personalizacją per specjalizacja na poziomie contentu. Dedykowane widoki per specjalizacja = Faza 2, jeśli dane potwierdzą impact.

---

## User Stories

### Specjalista (ukończona specjalizacja, wypisuje recepty)

**Codzienny powrót:**
- Jako kardiolog, chcę wchodzić na Remedium i od razu widzieć co nowego w kardiologii — nowe wytyczne, artykuły, webinary — żebym nie musiał szukać tego po 5 różnych portalach
- Jako specjalista, chcę dostawać push/email gdy pojawi się nowy content z mojej specjalizacji, żebym miał powód wracać regularnie
- Jako internista pracujący w POZ, chcę widzieć content z interny I medycyny rodzinnej jednocześnie, bo moja praktyka jest na styku

**Narzędzia kariery (unikalna przewaga Remedium):**
- Jako młody specjalista po PES, chcę porównać swoje zarobki z benchmarkiem (Mapa Wynagrodzeń per specjalizacja × region × forma zatrudnienia), żebym wiedział czy jestem fair paid
- Jako specjalista rozważający B2B, chcę kalkulator etat vs kontrakt z polskimi realiami podatkowymi, żebym podjął świadomą decyzję
- Jako doświadczony specjalista, chcę widzieć oferty pracy filtrowane po mojej specjalizacji i regionie, żebym nie przeglądał setek irrelevant ogłoszeń

**CME compliance:**
- Jako specjalista, chcę wiedzieć ile mam punktów edukacyjnych i ile mi brakuje do końca cyklu, żebym nie musiał tego liczyć ręcznie
- Jako specjalista, chcę dostawać rekomendacje kursów/webinarów w mojej specjalizacji, które dadzą mi brakujące punkty, żebym oszczędził czas na szukaniu

**Społeczność:**
- Jako specjalista, chcę dyskutować z innymi specjalistami z mojej dziedziny o przypadkach klinicznych i wytycznych, w zamkniętej, zweryfikowanej przestrzeni (nie na Facebooku)

### Rezydent (w trakcie specjalizacji, wypisuje recepty)

**Onboarding i dane:**
- Jako rezydent kardiologii, chcę podczas rejestracji podać kierunek mojej specjalizacji, żeby Remedium pokazywało mi content z kardiologii od pierwszego dnia
- Jako rezydent, chcę widzieć tracker moich procedur wymaganych w programie specjalizacyjnym, żebym wiedział co mi zostało

**Przyszły specjalista:**
- Jako rezydent, chcę widzieć ile zarabiają specjaliści w mojej dziedzinie (Mapa Wynagrodzeń), żebym wiedział co mnie czeka
- Jako rezydent, chcę dostawać ten sam content specjalizacyjny co specjaliści, bo wypisuję recepty i podejmuję decyzje kliniczne już teraz

---

## Requirements

### P0 — Must-Have (Faza 1, launch w 6 tygodni)

**1. Specialist Mode Dashboard**

Nowy widok po zalogowaniu dla użytkowników z potwierdzoną lub zadeklarowaną specjalizacją. Zastępuje generyczny dashboard.

Acceptance criteria:
- Widoczny feed contentu filtrowany po specjalizacji użytkownika (artykuły, wytyczne, webinary, VOD)
- Sekcja "Nowości w [specjalizacja]" — ostatnie 7 dni, max 5 pozycji
- Sekcja "Narzędzia" — kalkulatory i poradniki relevantne dla specjalizacji
- Sekcja "Mapa Wynagrodzeń" — benchmark dla specjalizacji użytkownika (widoczny snippet, link do pełnej)
- Sekcja "Webinary i wydarzenia" — filtrowane per specjalizacja, z datami
- Fallback: jeśli brak contentu per specjalizacja, pokaż cross-specialty "Popularne wśród lekarzy"
- Mobile-responsive — specjaliści sprawdzają content między pacjentami

**2. Onboarding z obowiązkową specjalizacją**

Nowy flow rejestracji/weryfikacji, który łapie specjalizację na każdym etapie.

Acceptance criteria:
- Pole "Kierunek specjalizacji" obowiązkowe dla rezydentów (dropdown z listą specjalizacji)
- Pole "Rok rezydentury" (1-6)
- Dla specjalistów: NIL potwierdza automatycznie — dodatkowe pytanie o drugie specjalizacje i zainteresowania kliniczne
- Dla "bez specjalizacji" po NIL: dodatkowy krok — "Czy jesteś w trakcie specjalizacji? Jeśli tak, wybierz kierunek"
- Dane zapisane jako property w PostHog — umożliwia natychmiastową analizę MAU per specjalizacja

**3. Kampania "Uzupełnij profil" dla istniejącej bazy**

Zbiór brakujących danych od rezydentów, którzy zarejestrowali się bez specjalizacji.

Acceptance criteria:
- Wiadomość wewnętrzna + email do rezydentów bez zadeklarowanej specjalizacji
- Prosty formularz: 1 pole (specjalizacja) + 1 pole (rok)
- Incentive: dostęp do dedykowanego dashboardu po uzupełnieniu
- Target: 80% rezydentów uzupełnia profil w ciągu 3 miesięcy
- Bar na górze dashboardu "Uzupełnij specjalizację, żeby odblokować spersonalizowany widok" — dopóki nie uzupełnione

**4. NIL re-check dla starszych rezydentów**

Automatyczne ponowne sprawdzenie statusu specjalizacji.

Acceptance criteria:
- Batch re-weryfikacja rezydentów zarejestrowanych >2 lata temu
- Jeśli NIL zwraca ukończoną specjalizację → automatyczna aktualizacja statusu
- Cron: co 6 miesięcy dla rezydentów >3 lat od rejestracji
- Log zmian: ile kont "awansowało" z rezydenta na specjalistę

**5. Content per specjalizacja — minimum viable**

Zapewnienie minimalnej ilości contentu dla top 10 specjalizacji.

Acceptance criteria:
- Tagowanie istniejących artykułów, webinarów, VOD per specjalizacja (backlog tagging)
- Minimum 3 nowe pozycje contentu per specjalizacja per miesiąc dla top 10 specjalizacji
- Tag system: artykuł może mieć wiele specjalizacji (np. "diabetologia + kardiologia + nefrologia" dla artykułu o powikłaniach nerkowych w cukrzycy)
- Automatyczny digest tygodniowy per specjalizacja (email/push) — "3 nowe materiały z kardiologii na Remedium"

### P1 — Nice-to-Have (Faza 2, Q3 2026)

**6. CME Dashboard**
- Tracker punktów edukacyjnych (200 pkt / 48 miesięcy)
- Automatyczne zaliczanie kursów/webinarów Remedium
- Rekomendacje: "Brakuje Ci X punktów, oto kursy w Twojej specjalizacji"
- Wymaga akredytacji NRL — proces biurokratyczny, start ASAP, efekt Q3-Q4

**7. Kalkulator B2B vs etat**
- Na bazie Mapy Wynagrodzeń + polskich realiów podatkowych
- Input: specjalizacja, region, stawka godzinowa, liczba godzin
- Output: porównanie netto etat vs B2B vs kontrakt

**8. Specjalistyczna społeczność**
- Forum/dyskusje per specjalizacja — zamknięte, tylko zweryfikowani lekarze
- Moderacja przez KOL per specjalizacja
- Start: 3 największe specjalizacje (internisci, POZ, kardiologia)

**9. Personalizacja email/push per specjalizacja**
- Segmented newsletters — nie jeden newsletter dla wszystkich
- "Nowy artykuł z psychiatrii" zamiast "Newsletter Remedium #47"
- CTR target: z obecnych ~0.2% do 1%+

### P2 — Future Considerations

**10. Dedicated specialty microsites** — np. remedium.md/kardiologia z dedykowanym layoutem, contentem i narzędziami. Wymaga znacznej ilości contentu per specjalizacja. Rozważyć po 6 miesiącach danych.

**11. KOL program** — starsi specjaliści jako autorzy contentu w zamian za darmowy premium. Content flywheel: KOL tworzą → rezydenci/specjaliści konsumują → buduje wiarygodność → przyciąga więcej KOL.

**12. Remedium AI Career Assistant** — AI zasilane Mapą Wynagrodzeń i Encyklopedią Rezydentur. "Ile zarabia rezydent kardiologii w Krakowie z 3 dyżurami?" — odpowiedź na podstawie realnych, crowdsourcowanych danych. Unikalny moat — ChatGPT tego nie ma.

**13. Institutional licenses** — szpitale/kliniki kupują dostęp premium dla wszystkich lekarzy. B2B revenue stream.

---

## Success Metrics

### Leading indicators (zmiana w ciągu tygodni)

| Metryka | Baseline (szacunek) | Target 3 msc | Target 6 msc |
|---|---|---|---|
| % rezydentów z uzupełnioną specjalizacją | ~60% (?) | 80% | 90% |
| MAU specjalistów / baza specjalistów | ~50% | 55% | 65% |
| PV per session (specjaliści) | ~4 | 5 | 6 |
| Weekly digest open rate per specjalizacja | - | 35% | 40% |
| Onboarding completion rate (nowi specjaliści) | ? | 85% | 90% |

### Lagging indicators (zmiana w ciągu miesięcy)

| Metryka | Baseline | Target Q3 2026 | Target Q4 2026 |
|---|---|---|---|
| Campaign Fulfillment Rate | ~85% broad, <50% spec | 90% broad, 60% spec | 95% broad, 75% spec |
| Specjalizacje "sprzedawalne" dla pharma | ~5-6 | 8 | 10+ |
| Revenue z kampanii na specjalizacje | ? | +30% vs Q1 | +60% vs Q1 |
| W4 retention specjalistów | ? | 60% | 70% |
| Kardiologia: avg PV per kampanię | 1,463 | 2,200 | 2,900+ |

---

## Open Questions

1. **[Data/Backend]** Ile rezydentów w bazie ma dziś uzupełnione pole specjalizacji? To determinuje skalę problemu i effort kampanii "uzupełnij profil"
2. **[Data/PostHog]** Jaki jest aktualny MAU per specjalizacja? Bez tego nie mamy baseline'u i nie zmierzymy efektu
3. **[Backend]** Czy NIL API wspiera batch re-check, czy trzeba odpytywać jeden po jednym? Determinuje feasibility crona
4. **[Content]** Ile istniejących artykułów/webinarów jest już otagowanych per specjalizacja? Jeśli mało — backlog tagging to duży effort
5. **[Biznes]** Jakie specjalizacje pharma najczęściej pyta w briefach? To powinno determinować priorytet contentu — nie równo na wszystkie, tylko tam gdzie jest demand
6. **[Design]** Jak wygląda obecny dashboard — co można usunąć/zastąpić bez przebudowy całego frontu? Chcemy szybki launch, nie redesign
7. **[Biznes]** Czy mamy dane o tym, ile kampanii pharma odrzuciliśmy / nie zaproponowaliśmy, bo nie mieliśmy pojemności na danej specjalizacji? To by pozwoliło policzyć utracony przychód

---

## Timeline

**Tydzień 1-2 (teraz):** Audyt bazy — odpowiedzi na open questions 1-4. Równolegle: brief na kampanię "uzupełnij profil".

**Tydzień 3-4:** Design specialist mode dashboard (Figma). Wdrożenie pola specjalizacji w onboarding. Start backlog tagging contentu.

**Tydzień 5-6:** Development specialist mode dashboard (MVP). Launch kampanii "uzupełnij profil". Wdrożenie NIL re-check batch.

**Tydzień 7-8:** Launch Fazy 1. Pierwsze dane o adoption. Start prac nad content per specjalizacja (minimum 3/msc/specjalizacja).

**Miesiąc 3:** Review metryk. Decyzja o Fazie 2 (CME Dashboard, forum, kalkulatory).

**Q3 2026:** Launch Fazy 2. Pierwsze kampanie pharma na nowe specjalizacje.

---

## Jak to się łączy z Growth Playbook

Ta propozycja produktowa realizuje jednocześnie wszystkie 4 levery:

**Lever 0 (czyszczenie bazy):** Onboarding z obowiązkową specjalizacją + kampania "uzupełnij profil" + NIL re-check = czyste dane, pewne targetowanie.

**Lever 1 (engagement):** Specialist mode dashboard + content per specjalizacja + weekly digest = powód do powrotu, wyższy MAU.

**Lever 2 (bottleneck specjalizacje):** Content i narzędzia dedykowane per specjalizacja = magnes na nowych specjalistów z niedoreprezentowanych dziedzin. Psychiatria ma kalkulatory (już sprzedane) — teraz dajemy psychiatrom powód, żeby wchodzić regularnie.

**Lever 3 (pipeline):** Ten sam specialist mode dla rezydentów z zadeklarowaną specjalizacją = budowanie nawyku przed ukończeniem specjalizacji.

Efekt netto: więcej aktywnych specjalistów per specjalizacja → więcej impressions → wyższy Campaign Fulfillment Rate → więcej sprzedawalnych kampanii → wyższy revenue.

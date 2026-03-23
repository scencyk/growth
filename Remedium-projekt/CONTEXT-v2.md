# Remedium Growth — Kontekst (v2, 16.03.2026)

## Kto to czyta
Kontekst dla Claude i zespołu. Sebastian (growth, zarząd) przenosi tu ustalenia strategiczne.

---

## 1. Model biznesowy

Pharma płaci fix kwotę za kampanię display z określonym KPI (impressions/clicks), targetowaną po specjalizacji. Trzy tiery cenowe: ALL/POZ (8K PLN, 20K PV/msc), duże specjalizacje >1200 w NIL (1.4K PLN, 2.9K PV/msc), małe specjalizacje <1200 (800 PLN, 1K PV/msc).

87% kampanii w 2024 targetowało ALL/POZ — bo na specjalizacjach brak pojemności. To jest utracony przychód. Każda odblokowana specjalizacja = nowa linia przychodowa.

---

## 2. Metryki growth

### North Star: SCR (Specialty Coverage Rate)
Ilu lekarzy danej specjalizacji (specjaliści + rezydenci z deklaracją) mamy w systemie z czystymi danymi / ilu jest na rynku.

### Companion: Activation Rate
% nowo zarejestrowanych, którzy wracają w ciągu 7 dni.

### Podział growth vs product:
- **Growth (Sebastian):** SCR + Activation. Akwizycja, data quality, onboarding, pierwsze 7 dni.
- **Product (Krzysztof):** DAU/WAU, retencja d30+, feature development.
- **Granica:** dzień 7.
- **Strefa styku:** onboarding flow, specialist dashboard, content per specjalizacja na dzień 1.

---

## 3. Sekwencja działań growth

### Faza 0: Wyczyść bazę (tydzień 1-2)

**Problem:** 39% bazy bez wybranej roli. 49% lekarzy bez specjalizacji. Nie wiesz co masz.

**Do zrobienia:**
- Rozpoznanie 57K bez roli — query: PWZ, ostatnie logowanie, data rejestracji. Kto jest lekarzem a kto martwym kontem?
- Zmierz MAU per specjalizacja w PostHog — to jest baseline SCR × aktywność
- Policz ile rezydentów ma uzupełnione pole specjalizacji
- Odseparuj dentystów, pielęgniarki, farmaceutów w raportach — nie liczyć w metrykach growth
- NIL re-check batch dla rezydentów >2 lata — kto awansował na specjalistę?

**Efekt:** Wiesz ile naprawdę masz. Twój SCR jest oparty na faktach, nie estymacjach.

### Faza 1: Uzupełnij dane (tydzień 3-4)

**Problem:** Nawet wśród znanych lekarzy, wielu nie ma specjalizacji w profilu. Są niewidoczni dla kampanii.

**Do zrobienia:**
- Kampania "uzupełnij profil" do rezydentów bez deklaracji specjalizacji
- Obowiązkowe pole specjalizacji/kierunku rezydentury w onboardingu nowych userów
- Reaktywacja "bez roli" z PWZ — prosta wiadomość, prosty formularz
- NIL cron: re-check co 6 miesięcy dla rezydentów >3 lat

**Efekt:** Baza targetowalna rośnie bez jednej nowej rejestracji.

### Faza 2: Readiness board per rola (miesiąc 2)

**Problem:** Nie każda rola i specjalizacja jest gotowa na kampanię. Musisz widzieć co blokuje.

**4 role × 5 klocków:**

| Klocek | Co mierzy |
|---|---|
| Content | Czy mamy artykuły, VOD, wytyczne z tej dziedziny? Min. 3/msc |
| Narzędzia | Czy mamy kalkulatory, trackery, prep? Codzienny powód do powrotu |
| SCR | Jaka penetracja rynku? Czy jest masa krytyczna? |
| Onboarding | Czy nowy user tej roli widzi coś dla siebie w dzień 1? |
| Kampania | Czy mamy gotowy kanał akwizycji? SEO, partnerstwo, FB? |

Wszystkie zielone → GO, odpalasz.
Brakuje jednego → WAIT, widać co blokuje.

**Luki per rola:**
- Student: brak banku pytań LEK, flashcards (ale 95% penetracji — nie priorytet)
- Stażysta: brak trackera stażu (mały segment, 13 msc cykl)
- Rezydent: brak trackera procedur, prep PES (kluczowy segment — wypisuje recepty)
- Specjalista: brak CME dashboard, specialist mode (**BEZ akredytacji NRL klocek content jest strukturalnie zablokowany**)

### Faza 3: Specialist mode + onboarding (miesiąc 2-3)

**Problem:** Specjalista trafia na generyczny dashboard = nie wraca. Activation Rate spada.

**Do zrobienia (wspólnie z Krzysztofem):**
- 2 ścieżki onboardingu: "uczę się" (studenci, stażyści) vs "pracuję" (rezydenci, specjaliści)
- Specialist mode dashboard: feed per specjalizacja, narzędzia, Mapa Wynagrodzeń, webinary
- Content tagging per specjalizacja (backlog existing content)
- Weekly digest per specjalizacja (email/push)

**Efekt:** Activation Rate rośnie, Krzysztof dostaje użytkowników, którzy mają powód wracać.

### Faza 4: Akwizycja w bottleneck specjalizacjach (miesiąc 3-4)

**Problem:** Psychiatria, gastro, reuma, nefro, pulmo — za mało lekarzy, żeby sprzedać kampanię.

**Do zrobienia:**
- Priorytet: specjalizacje, na które pharma pyta ale nie możesz sprzedać (sprawdź z zespołem sprzedaży)
- Kampanie akwizycyjne per specjalizacja — content jako magnes
- Partnerstwa z towarzystwami naukowymi
- Webinary z KOL per specjalizacja
- SEO na frazy specjalizacyjne

**Efekt:** SCR rośnie w bottleneck specjalizacjach. Nowe kampanie sprzedawalne.

### Faza 5: Skalowanie (Q3 2026+)

- CME dashboard (wymaga akredytacji NRL — start procesu ASAP)
- AI-assisted tools per specjalizacja (wzmocnienie istniejących kalkulatorów i wyszukiwarki leków)
- KOL program (starsi specjaliści jako autorzy contentu)
- Nowe specjalizacje sprzedawalne: cel 10+ (z obecnych 5-6)

---

## 4. Nawigacja — obecny stan

Generyczna — sidebar taki sam dla studenta i specjalisty. Sekcje: Panel główny, Klub Medyka, Egzaminy, Leki, Wyroby medyczne, ICD-10, Kalkulatory, Poradniki, Szybkie pytania, Kalendarz szczepień, Wideo, Publikacje, Kursy, E-booki, Przypadki kliniczne, Mapa staży, Rezydentury, Mapa rezydentur, Mapa wynagrodzeń, Vademecum.

Wniosek: nawigacja powinna być per rola. Specjalista nie potrzebuje "Mapa staży". Student nie potrzebuje "Klub Medyka".

---

## 5. Czego NIE robić

- Nie gonić za liczbą rejestracji — rynek skończony (141K lekarzy)
- Nie budować encyklopedii klinicznej — mp.pl wygrywa tę bitwę
- Nie budować generycznego AI chata — PZWL MediChat jest 3 lata do przodu
- Nie inwestować równo we wszystkie segmenty — specjalista > rezydent > stażysta > student
- Nie sprzedawać kampanii na specjalizacje, gdzie nie możesz dowieźć
- Nie liczyć dentystów, pielęgniarek, farmaceutów w metrykach growth

---

## 6. Preferencje techniczne

- Stack: React + Tailwind + shadcn/ui
- Design tokens: primary #2e35ff, font Inter, border-radius 8/12px, border #e4e4e7
- Output: SPEC.md (handoff do Krzysztofa), .jsx/.tsx (komponenty)
- Dane z realnych źródeł, estymaty jawnie oznaczane

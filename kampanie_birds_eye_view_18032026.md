# Kampanie Remedium — ocena z lotu ptaka

**Data analizy:** 18.03.2026
**Źródła:** Meta Ads (sty 2025 – mar 2026), Notion (Projekty komercyjne), PostHog (Q1 2026)

---

## Podsumowanie: 337 233 PLN wydane w 15 miesięcy

W okresie styczeń 2025 – marzec 2026 Remedium wydało **337 tys. PLN** na reklamy Meta, z czego **66,5% (224 tys. PLN)** to kampanie klienckie [KL], a **33,5% (113 tys.)** to budżet wewnętrzny. To daje średnio ~22,5 tys. PLN miesięcznie — skromny budżet jak na platformę z 70+ tys. użytkowników.

---

## 1. Co działa dobrze

### Treści klienckie LPV — gwiazda portfela
Format `[KL] Treści klienckie [wyświetlenie strony docelowej]` generuje **31% całego spend** (105 tys. PLN) i jest zdecydowanie najefektywniejszy: **0,58 PLN za LPV** (landing page view) przy 182 tys. wyników. To benchmark, do którego powinny aspirować wszystkie pozostałe formaty. W Q1 2026 ten CPR spadł jeszcze niżej — do 0,94 PLN/LPV, co oznacza, że algorytm Meta coraz lepiej optymalizuje delivery.

### Konferencje własne — niski koszt zapisu
Zapisy na konferencje własne Remedium kosztują średnio **2,33 PLN/zapis** przy ponad 8 400 zapisach. To wynik świetny — porównywalny z benchmarkami branżowymi (5–15 PLN/lead w B2B healthcare). Format konferencji buduje też markę i engagement community.

### Aktywacja użytkowników — koszt bliski zeru
Kampania "Najlepsze posty tygodnia" z wynikiem **0,03 PLN/3LPV** przy 288 tys. wyników to prawdopodobnie najlepsza inwestycja wewnętrzna. Za ~8 tys. PLN generuje masową aktywację istniejących użytkowników.

---

## 2. Co budzi wątpliwości

### Nagrania konferencji własnych — 33,7 tys. PLN, niejasny cel
Druga co do wielkości pozycja budżetowa: **33,7 tys. PLN (10% total spend)** na promocję nagrań konferencji. CPM ~14 PLN to najdroższy format. Problem: brak jasnego KPI — ile z tych video views przekłada się na engagement w platformie? PostHog pokazuje, że VOD-y mają średnio 235 UU/materiał, ale nie wiemy, ile z tego pochodzi z Meta vs organic.

**Rekomendacja:** Określ KPI dla tego formatu (np. minimum 500 video_started per kampania) i porównaj z kosztem pozyskania tych samych użytkowników przez format `Treści klienckie` (CPM 7,58 PLN — o 45% taniej).

### Katalog Remedium — 3 tys. PLN za 22 wyniki
Kampania e-commerce "Katalog" wygenerowała zaledwie 22 zainicjowane przejścia do kasy przy koszcie **137 PLN/wynik**. Nawet jeśli to kampania testowa — wynik jest dramatycznie poniżej progu opłacalności.

**Rekomendacja:** Wyłączyć do czasu przebudowy funnelu zakupowego. Kurs EKG z kampanią „Kursy Remedium" też ma CPR ~49 PLN/AddToCart — rozważ, czy Meta jest w ogóle właściwym kanałem dla e-commerce kursów (może lepiej newsletter + in-app).

### Kursy sponsorowane [odblokowanie] — 5,3 tys. PLN, 0 dostarczonych wyników
Format `not_delivering` z pustymi wynikami mimo wydanych 5,3 tys. PLN. Dotyczy głównie kursu hiperurykemii (Egis) i nadciśnienia. Paradoksalnie sam kurs Egis osiągnął KPI 1 200 UU — ale nie dzięki temu formatowi Meta.

**Rekomendacja:** Usunąć ten format z oferty Meta. Przemieścić budżet na `[odtworzenie nagrania]` (CPR 1,60 PLN) lub `Treści klienckie` (CPR 0,58 PLN).

---

## 3. Rozbieżności Meta ↔ PostHog ↔ Notion

### Materiały z deadline 31.03 — alarm
Pięć kampanii z dedline'em za 13 dni nie osiągnie KPI bez interwencji:

| Materiał | % KPI | Brakuje UU | Szansa bez boostu |
|---|---|---|---|
| GLP-1 / Cholestil | 35% | ~325 | Niska |
| Neoangin (benzydamina) | 51% | ~243 | Średnia (szybki wzrost) |
| Mometazon/Ryaltris | 56% | ~218 | Średnia |
| Marimer VOD | 57% | ~172 | Średnia (newsletter pediatria) |
| Escitalopram (Escitil) | 76% | ~96 | Wysoka |

**Problem systemowy:** Te materiały powinny mieć kampanię Meta uruchomioną od dnia publikacji. Dane sugerują, że promocja startuje za późno — content traci 2–3 miesiące "cold start" bez wsparcia paid.

### Bufomix — najpoważniejszy case
73 UU login przy KPI 400 (18% realizacji). Deadline minął 20 stycznia, materiał opublikowany dopiero 9 marca. To nie jest problem kampanii Meta — to problem operacyjny: zbyt późna publikacja. Wymaga natychmiastowej rozmowy z klientem.

### Bayer Iberogast i Merck — kampanie roczne bez raportowania
Obie kampanie roczne (łącznie pokrywające cały 2026) nie mają skonfigurowanego raportowania w Notion (pole Raport = NO). Bez automatycznego trackingu w PostHog nie wiadomo, czy realizujemy KPI. Merck ma powiązane materiały D&L z 314 UU — ale nie wiemy, czy to wystarczy vs plan klienta.

---

## 4. Struktura wydatków — kto płaci, kto zyskuje

### TOP 5 klientów Meta:
1. **Sandoz** — 23,8 tys. PLN (10,6%) — kursy, treści, konferencje
2. **Egis** — 21,3 tys. PLN (9,5%) — kursy, case study, 5min, espresso
3. **AstraZeneca** — 17,5 tys. PLN (7,8%) — poradniki (niewydolność serca, cukrzyca, nerki)
4. **Angelini** — 14,3 tys. PLN (6,4%) — depresja, Trittico
5. **Merck** — 9,3 tys. PLN (4,1%) — tarczyca, nadciśnienie

### Problem: koncentracja
Top 5 klientów = **38% spend klientów**. Pozostali 25+ klientów dzielą resztę. Wielu klientów ma budżet Meta poniżej 2 tys. PLN — za mało, żeby algorytm Meta nauczył się optymalizować dostarczanie.

**Rekomendacja:** Minimalna kampania klienta na Meta powinna wynosić minimum 1 500–2 000 PLN. Dla mniejszych budżetów lepszy ROI da newsletter + push in-app.

---

## 5. Audience insight z PostHog (Q1 2026)

Treści klienckie (poradniki, case study, D&L, VOD, kursy) konsumuje w Q1 2026 **~33 500 unikalnych użytkowników**, z podziałem:

| Segment | UU | Udział |
|---|---|---|
| Lekarze bez specjalizacji | 10 556 | 31,5% |
| Studenci | 10 137 | 30,2% |
| Rezydenci | 4 878 | 14,6% |
| Specjaliści | 3 626 | 10,8% |
| Stażyści | 2 766 | 8,3% |
| Pielęgniarki, farmaceuci, dentyści, inni | ~1 500 | 4,5% |

### Kluczowy wniosek dla kampanii:
**30% konsumentów treści klienckich to studenci** — grupa niekomercyjna z perspektywy pharma (nie wypisują recept). To nie znaczy, że są bezwartościowi (argumenty long-term brand building), ale klienci pharma płacą za dotarcie do lekarzy z decyzyjnością receptową.

**Rekomendacja:** W raportach kampanii dla klientów wydzielaj segmenty (lekarze vs studenci). W targetowaniu Meta wyklucz/ogranicz studentów dla kampanii stricte receptowych.

---

## 6. Efektywność formatów — ranking

| Format | Spend | CPR | Wyniki | Ocena |
|---|---|---|---|---|
| Treści klienckie (LPV) | 105 tys. | **0,58 PLN** | 182 tys. | ⭐⭐⭐⭐⭐ |
| Aktywacja (3LPV) | 8 tys. | **0,03 PLN** | 288 tys. | ⭐⭐⭐⭐⭐ |
| Treści własne (LPV) | 5 tys. | **1,25 PLN** | 4 175 | ⭐⭐⭐⭐ |
| Kursy [odtworzenie] | 19 tys. | **1,60 PLN** | 12 tys. | ⭐⭐⭐⭐ |
| Nagrania konferencji | 34 tys. | **1,74 PLN** | 19 tys. | ⭐⭐⭐ |
| Konferencje własne (zapisy) | 24 tys. | **1,94 PLN** | 12,5 tys. | ⭐⭐⭐⭐ |
| Video/podcasty klienckie | 37 tys. | **2,74 PLN** | 13,5 tys. | ⭐⭐⭐ |
| Nagrania webinarów (VOD) | 14 tys. | **3,01 PLN** | 4,6 tys. | ⭐⭐⭐ |
| Webinary klienckie (zapisy) | 23 tys. | **4,25 PLN** | 4,5 tys. | ⭐⭐ |
| Konferencje klienckie (zapisy) | 13 tys. | **4,73 PLN** | 2,4 tys. | ⭐⭐ |
| Rejestracje | 8 tys. | **13,16 PLN** | 635 | ⭐⭐ |
| Kursy [odblokowanie] | 5 tys. | **19,64 PLN** | 272 | ⭐ |
| Kursy Remedium (zakupy) | 10 tys. | **49,20 PLN** | 200 | ⭐ |
| Katalog | 3 tys. | **137 PLN** | 22 | ❌ |

---

## 7. Strategiczne rekomendacje

### Natychmiast (ten tydzień):
1. **Newsletter + SoMe boost** dla 5 materiałów z deadline 31.03
2. **Wyłącz** format Kursy [odblokowanie] — wyrzucone pieniądze
3. **Kontakt z klientem Bufomix** — renegocjacja warunków

### Krótkoterminowo (marzec–kwiecień):
4. **Skonfiguruj raportowanie** w Notion dla Bayer Iberogast i Merck
5. **Przesuń budżet** z Nagrań konferencji (CPR 1,74) na Treści klienckie (CPR 0,58) — za te same 34 tys. PLN dostaniesz 3x więcej wyników
6. **Ustaw minimum budżetowe** — 1 500 PLN na kampanię klienta, poniżej tego tylko newsletter

### Systemowo (Q2 2026):
7. **Automatyczny pipeline:** publikacja materiału → kampania Meta startuje w ciągu 48h (nie po 2 miesiącach jak Bufomix)
8. **Segmentacja audience** w raportach klienckich — oddzielnie lekarze vs studenci
9. **Wyłącz lub przebuduj** kampanie e-commerce kursów na Meta (CPR 49 PLN) — przenieś na in-app + email
10. **Dashboard KPI** łączący Notion + PostHog + Meta w jednym widoku — dziś dane są w 3 silosach

---

*Dokument wygenerowany na podstawie analizy 467 zestawów reklam Meta, bazy Notion „Projekty komercyjne" i danych PostHog z marca 2026.*

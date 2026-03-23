# PostHog Brandmed — Uzupełnienie skilla (marzec 2026)

Dokument zawiera korekty i nową wiedzę wynikającą z eksploracji danych PostHog w marcu 2026. Każda sekcja oznacza czy to **korekta** (skill mówi nieprawdę), **brak** (skill nie pokrywa) czy **niuans** (skill mówi za mało).

---

## 1. KOREKTA: Statusy lekarzy — angielskie, nie polskie

Skill mówi:
```
stażysta, rezydent, specjalista, lekarz bez specjalizacji
```

**Prawdziwe wartości w PostHog (person.properties.status):**
```
intern, resident, specialist, without_specialization
```

Pole nazywa się `status` (NIE `doctor_status`). Skill podaje też `doctor_status` w przykładzie — ta property nie istnieje.

**Poprawny filtr:**
```sql
person.properties.status = 'resident'    -- NIE 'rezydent'
person.properties.status = 'specialist'  -- NIE 'specjalista'
person.properties.status = 'intern'      -- NIE 'stażysta'
person.properties.status = 'without_specialization'  -- NIE 'lekarz bez specjalizacji'
```

---

## 2. KOREKTA: suggestedSpecializations — inna nazwa

Skill mówi: `suggested_specialization`

**Prawdziwa nazwa:** `suggestedSpecializations` (camelCase, plural, z "S" na końcu)

---

## 3. KOREKTA: Format pól specjalizacji

Skill nie precyzuje formatu. Oto prawdziwe formaty:

| Pole | Format | Przykład |
|------|--------|----------|
| `specialization` | JSON array ze slugami | `["choroby-wewnetrzne","kardiologia"]` |
| `open_specialization` | plain string slug | `choroby-wewnetrzne` |
| `suggestedSpecializations` | JSON array ze slugami | `["medycyna-rodzinna"]` |

**Konsekwencja:** Szukaj po **slugach** (z myślnikami, bez polskich znaków), nie po polskich nazwach:
```sql
-- POPRAWNIE:
properties.specialization ILIKE '%kardiologi%'   -- slug: kardiologia (tu akurat bez myślnika)
properties.specialization ILIKE '%choroby-wewn%'  -- slug: choroby-wewnetrzne

-- NIEPOPRAWNIE:
properties.specialization ILIKE '%choroby wewnętrzne%'  -- polski z ę — nie zadziała
```

**Uwaga:** `open_specialization` jest null dla większości specjalistów. W praktyce ~90% specjalistów ma `open_specialization = null`.

---

## 4. BRAK: property `path` — klucz do kampanii

Skill nie wspomina o property `path`, która jest **kluczowa dla raportowania kampanii**.

`properties.path` = `properties.$pathname` = ścieżka URL strony.

### Struktura ścieżek

| Typ treści | Wzorzec path | Przykład |
|-----------|-------------|---------|
| Poradnik | `/poradniki/{specjalność}/{slug}` | `/poradniki/kardiologia/migotanie-przedsionkow` |
| Kalkulator | `/kalkulatory/{specjalność}/{slug}` | `/kalkulatory/psychiatria/kwestionariusz-phq-9` |
| Artykuł | `/publikacje/{kategoria}/{slug}` | `/publikacje/case-studies/diagnozuj-i-lecz-niewystarczajaco-kontrolowana-astma` |
| Wideo | `/wideo/{playlist-slug}/{video-slug}` | `/wideo/pierwsze-kroki-w-poz-kardiologia-jesien-2025-223/jak-pomoc-pacjentowi...` |
| Przypadek kliniczny | `/przypadki-kliniczne/{specjalność}/{slug}` | `/przypadki-kliniczne/kardiologia/75-letni-pacjent-z-migotaniem...` |
| Szybkie pytanie | (wewnątrz poradnika — sub-path) | `/poradniki/gastroenterologia/przygotowanie-do-kolonoskopii/...` |
| ICD-10 | `/icd-10/{slug}` lub ICD-10. Kod. {code} | |

### Kiedy używać `path` vs `polishName` vs `rmd_feature`

| Cel | Użyj |
|-----|------|
| Raportowanie kampanii / KPI | **`path`** — jedyny wiarygodny sposób |
| Ogólne statystyki featureów | `rmd_feature` |
| Drilldown do konkretnej treści | `polishName` (ale uważaj na warianty!) |

---

## 5. BRAK: polishName ma wiele wariantów per strona

Ta sama strona (ten sam URL/path) może mieć **2–4 różnych wartości `polishName`**. Przykłady:

| Path | polishName wariant 1 | polishName wariant 2 | polishName wariant 3 |
|------|---------------------|---------------------|---------------------|
| `/poradniki/.../migotanie-przedsionkow` | `Poradniki. Poradnik. Migotanie przedsionków` | `Poradniki. Poradnik: migotanie-przedsionkow` | `Poradniki. migotanie-przedsionkow` |
| `/poradniki/.../migrena` | `Poradniki. Poradnik. Migrena` | `Poradniki. Poradnik: migrena` | `Poradniki. migrena` |

**Wzorce wariantów:**
- `{Sekcja}. {Typ}. {Tytuł PL}` — pełna polska nazwa
- `{Sekcja}. {Typ}: {slug}` — z dwukropkiem i slugiem
- `{Sekcja}. {Typ}: {Tytuł PL}` — z dwukropkiem i polską nazwą
- `{Sekcja}. {slug}` — sam slug bez typu

**Konsekwencja:** Gdy filtrujesz po `polishName`, zawsze używaj `ILIKE '%keyword%'`, nigdy dokładnego matchu. Ale dla kampanii lepiej filtruj po `path`.

---

## 6. BRAK: Metodologia notebooków kampanijnych

Notebooki PostHog (tworzenie: Joanna) używane do raportowania kampanii mają standardową metodologię:

```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {"kind": "EventsNode", "math": "dau", "event": "$pageview"},
      {"kind": "EventsNode", "math": "total", "event": "$pageview"}
    ],
    "interval": "month",
    "properties": {
      "type": "AND",
      "values": [
        {"key": "path", "type": "event", "value": "/poradniki/...", "operator": "regex"},
        {"key": "role", "type": "person", "value": "is_set", "operator": "is_set"}
      ]
    }
  }
}
```

**Kluczowe elementy:**
- **Event:** `$pageview`
- **Filtr treści:** `path` z operatorem `regex` (nie exact match!)
- **Filtr użytkowników:** `role IS SET`
- **Math:** `dau` = unique users per interwał (daily/weekly/monthly)
- **Drugi series:** `total` = total pageviews
- **filterTestAccounts:** false (NIE filtrują kont testowych)

**Regex na `path` jest unanchored** — `/poradniki/kardiologia/migotanie-przedsionkow` matchuje zarówno stronę główną poradnika jak i sub-strony (szybkie pytania wewnątrz).

---

## 7. BRAK: Notion ↔ PostHog — struktura kampanii

Kampanie są zarządzane w Notion (baza "Zadania marketing") i mają następujące pola:

| Pole Notion | Opis | Przykład |
|-------------|------|---------|
| KPI | Cel kampanii (zazwyczaj UU/mies.) | `250 UU miesięcznie` lub `400` |
| Interwał statystyk | Częstotliwość raportowania | `tygodniowy`, `dzienny` |
| Budżet (PLN) | Miesięczny budżet promocji | `300 zł na msc` |
| Grupa docelowa | Specjalności docelowe | `POZ/Gastroenterologia` |
| Link do Posthoga | URL notebooka z insightami | `posthog.remedium.md/project/1/notebooks/...` |
| Link do materiału promowanego | URL promowanej treści na Remedium | `remedium.md/poradniki/...` |
| Link do reklam (Meta) | Kampania Facebook Ads | URL Ads Manager |
| Deadline | Okres kampanii (start–end) | `2026-03-05 → 2026-05-31` |
| Realizacja % | Auto-kalkulowane wykonanie | `7.33` |
| Pace Index | Tempo realizacji | `10.65` |
| Produkt | Typ produktu komercyjnego | `Partner poradnik dla lekarza POZ/NPL`, `Diagnozuj i lecz` |

---

## 8. BRAK: Path ≠ polishName (semantyczne rozbieżności)

Czasem path i polishName opisują **tę samą treść różnymi słowami:**

| polishName | path | Problem |
|-----------|------|---------|
| Choroba refluksowa przełyku | `/poradniki/gastroenterologia/zgaga-i-dyspepsja` | Szukając "refluksowa" w path — nie znajdziesz |
| Stłuszczeniowa choroba wątroby... | `.../stluszczeniowa-choroba-watroby-...-mafld-nafld` | Path ma slug bez polskiego `ł`, polishName ma `Stłuszczeniowa` z `ł` |

**Praktyczna rada:** Gdy szukasz konkretnej treści, najpierw sprawdź jaki `path` odpowiada danemu polishName:
```sql
SELECT DISTINCT properties.path, properties.polishName
FROM events
WHERE event = '$pageview'
  AND properties.polishName ILIKE '%refluksow%'
LIMIT 10
```

---

## 9. BRAK: Wideo — metryki zaangażowania

Skill wspomina eventy `video_started`/`video_finished`/`video_watchtime_interval`, ale nie wyjaśnia jak liczyć watchtime:

### video_watchtime_interval
- `properties.start` — sekundy od początku (int)
- `properties.end` — sekundy od początku (int)
- Event wysyłany okresowo w trakcie oglądania

### Obliczanie średniego czasu oglądania
```sql
SELECT
  person_id,
  max(toFloat64OrNull(toString(properties.end))) AS max_watched_seconds
FROM events
WHERE event = 'video_watchtime_interval'
  AND properties.path LIKE '/wideo/...'
GROUP BY person_id
```

### Obliczanie % obejrzenia
Potrzebujesz znać czas trwania wideo (nie jest w evencie — trzeba podać ręcznie lub szukać w metadanych).

```sql
-- Jeśli wideo trwa 1320 sekund (22 min):
max_watched_seconds / 1320.0 * 100 AS watch_percent
```

---

## 10. BRAK: Wewnętrzna wyszukiwarka

Event `search_query` zawiera:
- `properties.query` — tekst wpisany przez użytkownika
- Przydatne do analizy popytu na treści

```sql
SELECT properties.query, count() AS searches, count(DISTINCT person_id) AS uu
FROM events
WHERE event = 'search_query'
  AND person.properties.role IS NOT NULL
  AND properties.query ILIKE '%kolonoskop%'
  AND timestamp >= '2026-01-01'
GROUP BY properties.query
ORDER BY searches DESC
```

Dodatkowe eventy wyszukiwania: `search_click`, `search_med_view` — kliknięcie w wynik i wyświetlenie leku z wyników.

---

## 11. BRAK: Deduplication — person_id vs distinct_id

| Identyfikator | Opis | Kiedy używać |
|---------------|------|-------------|
| `person_id` | Cross-device merged ID | **Domyślnie** — jeden user na wielu urządzeniach |
| `distinct_id` | Per-device/session ID | Gdy chcesz liczyć per-urządzenie |
| `properties.distinct_id` | Distinct ID w properties eventu | Alternatywa do `distinct_id` |

**Zawsze używaj `COUNT(DISTINCT person_id)`** chyba że user wyraźnie prosi o per-device.

---

## 12. NIUANS: rmd_feature nie pokrywa kampanii

`rmd_feature` jest świetne do ogólnych statystyk featureów, ale **nie rozróżnia między konkretnymi poradnikami/kalkulatorami**. Dla kampanii zawsze potrzebujesz `path` lub `polishName`.

Mapowanie `rmd_feature` → typy kampanijne:
- `tutorial` → poradniki (ale nie rozróżnia który poradnik)
- `medical-calculator` → kalkulatory
- `article` → artykuły / publikacje
- `clinical-case` → przypadki kliniczne / DiL (Diagnozuj i Lecz)
- `vod` → wideo
- `fast-question` → szybkie pytania (sub-content poradników)

---

## 13. BRAK: Ekosystem treści — cross-content analysis

Jeden temat kliniczny (np. "kolonoskopia") może mieć treści w wielu typach:
- Poradnik (path: `/poradniki/...`)
- Szybkie pytania (sub-pages poradnika)
- Wideo (path: `/wideo/...`)
- Artykuły/publikacje (path: `/publikacje/...`)
- Przypadki kliniczne (path: `/przypadki-kliniczne/...`)
- Kody ICD-10 (path: `/icd-10/...`)

**Analiza ekosystemu** (ile lekarzy interesuje się tematem across all content types):
```sql
SELECT
  properties.polishName,
  count(DISTINCT person_id) AS uu
FROM events
WHERE event = '$pageview'
  AND person.properties.role IS NOT NULL
  AND (
    properties.path ILIKE '%kolonoskop%'
    OR properties.polishName ILIKE '%kolonoskop%'
  )
  AND timestamp >= '2026-01-01'
GROUP BY properties.polishName
ORDER BY uu DESC
```

To ważne dla oceny potencjału kampanii — jeśli ekosystem tematu ma 300 UU, a kampanijny poradnik zbiera 50, to jest duże pole do cross-linkingu.

---

## 14. BRAK: Typowe wzorce ruchu nowych treści

Z obserwacji kampanii Q1 2026:

| Faza | Czas | UU/mies. vs KPI | Opis |
|------|------|-----------------|------|
| Cold start | miesiąc 1–2 | 30–50% KPI | Nowa treść, brak SEO, brak rekomendacji |
| Ramp-up | miesiąc 3–4 | 60–90% KPI | Algorytm zaczyna rekomendować, SEO rośnie |
| Push spike | po włączeniu Meta/newsletter | 150–450% | Jednorazowy boost, potem stabilizacja |
| Plateau | miesiąc 5+ | 80–120% KPI | Stabilny ruch organiczny |
| Decay | miesiąc 7+ | spadek 10–20%/mies. | Content się "wyczerpuje", potrzeba odświeżenia |

**MASLD jako case study:** Maj=68 → Paź=44 (decay) → Lis=253 (push spike) → Lut=170 (plateau+decay)

---

## 15. BRAK: Backoffice traffic

Rola `backoffice` to ruch wewnętrzny (zespół Brandmed). Stanowi 5–19% UU w zależności od kampanii. Warto filtrować lub osobno raportować:

```sql
-- Bez backoffice:
AND person.properties.role != 'backoffice'

-- Tylko "wartościowy" ruch:
AND person.properties.role IN ('doctor', 'student', 'dentist', 'nurse', 'pharmacist', 'midwife')
```

---

## 16. KOREKTA sekcji 4 — `path` ≠ `$pathname` dla kursów

Sekcja 4 mówi że `path = $pathname`. To nieprawda dla kursów.

Property `path` w kursach jest ustawiana przez Remedium jako identyfikator **całego kursu** — np. `/kursy/ekg-bez-tajemnic-14` — dla WSZYSTKICH eventów w ramach kursu, niezależnie od rzeczywistego URL rozdziału/lekcji.

`$pathname` = surowy URL strony = np. `/kursy/ekg-bez-tajemnic-14/rozdzial/3/lekcja/7`

**Konsekwencja:** Filtrując przez `path ~ /kursy/ekg-bez-tajemnic-14` łapiesz cały ruch kursu (wszystkie rozdziały, lekcje, quizy). Filtrując przez `$pathname` łapiesz tylko strony gdzie dany string dosłownie pojawia się w URL. Różnica: ~14x w liczbach.

| Property | Co zawiera | Kiedy używać |
|---|---|---|
| `path` | Custom property Remedium — identyfikator sekcji/kursu | Raportowanie kampanii, dashboard insightów |
| `$pathname` | Surowy URL strony | Debug, drilldown do konkretnej podstrony |

---

## 17. BRAK — `math: dau` ≠ miesięczni unikalni użytkownicy

Sekcja 6 wspomina `dau` ale nie wyjaśnia kluczowego niuansu metodologicznego:

| Math | Semantyka | Wynik dla aktywnego usera przez 10 dni w miesiącu |
|---|---|---|
| `dau` (PostHog Trends) | Suma dziennych unikalnych per interwał | Liczony 10 razy |
| `countDistinct(person_id)` (HogQL) | Unikalni per okres | Liczony 1 raz |

**W praktyce:** `dau` w widoku miesięcznym = miara zaangażowania (user-days), nie zasięgu. Dlatego PostHog dashboard może pokazywać 3 873 UU w październiku, gdy ręczny HogQL daje 530 (miesięczni unikalni).

**Zasada:** Jeśli chcesz liczby identyczne z PostHog dashboardem — używaj `insight-query`, nie własnego HogQL.

---

## 18. BRAK — Jak uzyskać dane 1:1 z dashboardem PostHog

Ręczny HogQL zawsze będzie się różnił od PostHog Trends przez:
- timezone projektu vs UTC w HogQL
- identity stitching (merging person_id)
- różną semantykę `dau` vs `countDistinct`
- subtelności `role IS SET` vs `IS NOT NULL`

**Jedyna metoda na liczby 1:1:**

```
1. dashboard-get (dashboardId z URL, np. /dashboard/48)
   → zwraca listę insightów z ich short_id

2. insight-query (insightId = short_id, np. "2MUIKTan")
   → zwraca dokładnie te same wyniki co dashboard na ekranie
```

Insight short_id widać też bezpośrednio w URL insightu: `/insights/AbCdEf`

---

## 19. BRAK — Kursy: eventy i rmd_feature

Sekcja 12 nie pokrywa kursów. Uzupełnienie:

| rmd_feature | Typ treści |
|---|---|
| `course` | Kursy (wszystkie eventy wewnątrz kursu) |

**Eventy kursowe:**

| Event | Opis |
|---|---|
| `$pageview` + `rmd_feature=course` | Wyświetlenie strony kursu / rozdziału |
| `ecommerce_purchase` + `items REGEX 'Kurs'` | Zakup kursu |
| `ecommerce_add_to_cart` | Dodanie kursu do koszyka |
| `course_quiz_finish` | Ukończenie quizu w kursie |

**Funnel zakupu kursu (ostatnie 30 dni, kurs EKG):**
- View (niezakupiony) → Add to cart: 1% konwersji
- Add to cart → Purchase: ~39% konwersji
- Mediana czasu decyzji (view→cart): ~64 sek.
- Mediana czasu (cart→purchase): ~133 sek.

Filtrowanie kursu niezakupionego: `polishName REGEX '(niezakupiony)'`

---

## 20. BRAK — `marketingNewsletter` jako pole opt-in

Opt-in do komunikacji marketingowej:

```sql
properties.marketingNewsletter = true   -- opt-in
properties.marketingNewsletter = false  -- opt-out
```

Typ: boolean. Przydatne do raportowania zasięgu marketingowego per specjalizacja:
```sql
countDistinctIf(id,
  (specialization ILIKE '%kardiologi%' OR suggestedSpecializations ILIKE '%kardiologi%')
  AND marketingNewsletter = true
) AS opt_in_kardiolodzy
FROM persons WHERE properties.role = 'doctor'
```

---

## 21. BRAK — Pełna taksonomia ról użytkowników

Kompletna lista wartości `properties.role` w bazie (stan marzec 2026):

| Rola | Liczba | Uwagi |
|---|---|---|
| `doctor` | ~44 000 | Główna grupa docelowa |
| `student` | ~20 000 | 27% bazy, niekomercyjna |
| `nurse` | ~3 052 | |
| `pharmacist` | ~1 605 | |
| `dentist` | ~2 162 | Ma własne statusy (specialist, intern, resident, without_specialization) |
| `paramedic` | ~504 | |
| `midwife` | ~382 | |
| `business` | ~363 | |
| `psychologist` | ~292 | |
| `laboratory_diagnostician` | ~325 | |
| `physiotherapist` | ~251 | |
| `dietician` | ~179 | |
| `health_carer` | ~171 | |
| `public_health_graduate` | ~151 | |
| `radiographer` | ~69 | |
| `occupational_therapist` | ~17 | |
| `backoffice` | ~42 | Ruch wewnętrzny Brandmed |
| `sales_representative` | ~6 | |
| `common` / `uncommon` | ~89 | Legacy / nieokreślone |

**Uwaga:** Istnieje literówka legacy `without_specialisation` (British spelling) obok poprawnego `without_specialization` — łącznie ~74 rekordy. Filtrując statusy warto uwzględnić obie formy lub ignorować jako marginalny błąd danych.

---

## Checklist: Jak prawidłowo sprawdzić KPI kampanii

1. Otwórz stronę kampanii w Notion → pobierz KPI, deadline, URL materiału
2. Wyciągnij `path` z URL materiału (np. `remedium.md/poradniki/.../slug` → `path = '/poradniki/.../slug'`)
3. Query PostHog:
```sql
SELECT
  dateTrunc('month', timestamp) AS m,
  count(DISTINCT person_id) AS uu,
  count() AS pv
FROM events
WHERE event = '$pageview'
  AND person.properties.role IS NOT NULL
  AND properties.path LIKE '/poradniki/.../slug%'   -- z % na końcu!
  AND timestamp >= '{campaign_start}'
  AND timestamp < '{campaign_end}'
GROUP BY m
ORDER BY m
```
4. Porównaj UU z KPI per miesiąc
5. Sprawdź profil (role, status) i ekosystem tematu
6. Oceń trend i prognozę

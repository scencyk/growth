# North Star metryka Growth: Targetable MAU (tMAU)

## Definicja

**tMAU = zweryfikowani lekarze z POTWIERDZONĄ LUB ZADEKLAROWANĄ specjalizacją, aktywni w ostatnich 30 dniach**

Aktywny = co najmniej 1 zalogowana sesja w ciągu 30 dni.

### Dlaczego ta metryka, a nie inna

| Kandydat | Problem |
|---|---|
| Campaign Fulfillment Rate | Output, nie input. Mierzysz po fakcie. Zależy od sprzedaży, nie tylko od growth |
| MAU (ogólny) | Vanity metric. 10K studentów ≠ wartość dla kampanii pharma |
| MAU per specjalizacja | Nie rozróżnia problemu danych (nie wiesz kim jest) od problemu engagement (nie wraca) |
| PV per specjalizacja | Zbyt granularne, zbyt wiele zmiennych |
| Liczba sprzedawalnych specjalizacji | Strategiczne, ale zmienia się raz na kwartał — nie operacyjne |
| **tMAU** | **Łączy czystość danych × aktywność. Jedyna metryka, którą growth kontroluje, i która bezpośrednio determinuje pojemność kampanii** |

### Dlaczego tMAU pociąga za sobą monetyzację

```
tMAU ↑
  → więcej targetowalnych impressions per specjalizacja
    → więcej kampanii sprzedawalnych (odblokowanie nowych specjalizacji)
      → wyższy Campaign Fulfillment Rate (pewniejsza realizacja)
        → retencja klientów pharma + wyższe ceny
          → revenue ↑
```

Jeśli tMAU stoi — nic poniżej w łańcuchu nie rośnie, bez względu na to jak dobrze działa sprzedaż.

---

## Stan na dziś (szacunek, marzec 2026)

### Składowe tMAU

| Składowa | Wartość | Źródło |
|---|---|---|
| Zweryfikowani lekarze (bez dentystów) | ~48,000 | Panel Remedium (54K minus dentyści) |
| Z nich: ze znaną specjalizacją (ukończoną via NIL) | ~22,733 | Specjalizacje liczby 2026.xlsx |
| Z nich: rezydenci z zadeklarowaną specjalizacją | ? (do zmierzenia) | Nieznane — kluczowa luka |
| Z nich: "bez specjalizacji" (NIL nie potwierdza, brak deklaracji) | ~25,000+ | Szacunek (~49% bazy) |

### Szacunek tMAU

| Scenariusz | Baza targetowalna | × est. MAU rate | = tMAU |
|---|---|---|---|
| Pesymistyczny (tylko specjaliści z NIL) | 22,733 | 45% | ~10,230 |
| Realistyczny (specjaliści + 60% rezydentów z deklaracją) | 22,733 + 9,083 = 31,816 | 50% | ~15,908 |
| Po audycie i uzupełnieniu profili | 22,733 + 13,500 = 36,233 | 55% | ~19,928 |
| Cel 12 miesięcy (audyt + engagement + akwizycja) | 28,000 + 14,000 = 42,000 | 60% | ~25,200 |

**Baseline tMAU: prawdopodobnie 10,000-16,000.** Dokładna wartość nieznana — potrzebujesz danych z PostHog.

---

## Rozkład tMAU per specjalizacja (szacunek)

| Specjalizacja | Lekarze w Remedium | Est. ze znaną spec | × Est. MAU | = tMAU | PV offer/msc | Czy sprzedawalne? |
|---|---|---|---|---|---|---|
| Med. rodzinna | 2,716 | 2,716 | 50% | 1,358 | 20,000 | TAK |
| Choroby wewnętrzne | 4,320 | 4,320 | 50% | 2,160 | 20,000 | TAK |
| Pediatria | 1,735 | 1,735 | 50% | 868 | 2,900 | TAK |
| Kardiologia | 1,896 | 1,896 | 50% | 948 | 2,900 | MARGINAL (avg 1,463 PV w 2024) |
| Ginekologia | 1,513 | 1,513 | 50% | 757 | 2,900 | NIE (avg 339 PV w 2024) |
| Ortopedia | 1,162 | 1,162 | 50% | 581 | 2,900 | Nieznane |
| Neurologia | 788 | 788 | 50% | 394 | 1,000 | Prawdopodobnie TAK |
| Onkologia | 621 | 621 | 50% | 311 | 1,000 | TAK |
| Diabetologia | 629 | 629 | 50% | 315 | 1,000 | TAK (avg 4,040 PV w 2024) |
| Pulmonologia | 557 | 557 | 50% | 279 | 1,000 | TAK (avg 2,062 PV w 2024) |
| Psychiatria | 476 | 476 | 50% | 238 | 1,000 | NIE (zero kampanii w 2024) |
| Endokrynologia | 377 | 377 | 50% | 189 | 1,000 | Nieznane |
| Reumatologia | 314 | 314 | 50% | 157 | 1,000 | NIE |
| Nefrologia | 280 | 280 | 50% | 140 | 1,000 | Nieznane |
| Gastroenterologia | 231 | 231 | 50% | 116 | 1,000 | NIE |

**Uwaga:** est. MAU 50% to szacunek na bazie cohort retention data (W1 ~58%). Prawdziwy MAU per specjalizacja = kluczowy do zmierzenia.

---

## Jak tMAU dekompozuje się na growth levers

```
tMAU = (A) × (B) × (C)

A = Zweryfikowani lekarze w bazie
    ↑ Lever 2: Akwizycja w bottleneck specjalizacjach
    ↑ Lever 3: Retencja rezydentów (pipeline)

B = % ze znaną specjalizacją
    ↑ Lever 0: Audyt, onboarding, "uzupełnij profil", NIL re-check

C = % aktywnych (MAU rate)
    ↑ Lever 1: Engagement (dashboard, content per spec, digest, narzędzia)
```

Każdy lever ciągnie inny mnożnik. Razem dają efekt compounding:
- Jeśli A rośnie o 20%, B o 15%, C o 10%:
- tMAU rośnie o: 1.20 × 1.15 × 1.10 = 1.518 → **+52%**

To jest siła tego podejścia — trzy niezależne dźwignie, które się mnożą.

---

## Metryki podporządkowane tMAU (hierarchia)

### L0: North Star
**tMAU** — raportowany tygodniowo, drill-down per specjalizacja

### L1: Health indicators (miesięcznie)

| Kategoria | Metryka | Dlaczego |
|---|---|---|
| Acquisition | Nowi zweryfikowani per specjalizacja | Czy baza rośnie tam gdzie trzeba? |
| Data quality | % lekarzy ze znaną specjalizacją | Czy wiemy kim są? |
| Activation | % nowych, którzy wrócili w ciągu 7 dni | Czy onboarding działa? |
| Engagement | Sessions per user per month (specjaliści) | Jak głęboko angażujemy? |
| Retention | M1, M3 retention per specjalizacja | Czy wracają? |
| Monetization | Campaign Fulfillment Rate | Czy monetyzujemy ruch? |

### L2: Diagnostyczne (tygodniowo, ad hoc)

| Metryka | Kiedy drill-down |
|---|---|
| PV per session per specjalizacja | Gdy tMAU rośnie ale fulfillment nie |
| Content views per specjalizacja | Gdy MAU rate spada — czy brak contentu? |
| Onboarding completion rate | Gdy nowi nie wracają |
| % rezydentów z deklaracją specjalizacji | Gdy "data quality" indicator nie rośnie |
| NIL re-check yield (ile "awansowało") | Przy każdym batchu re-check |
| Digest email open rate per specjalizacja | Gdy MAU rate per spec różni się od oczekiwań |

---

## Scorecard — co mierzyć od poniedziałku

| Metryka | Baseline (do zmierzenia) | Target Q2 2026 | Target Q4 2026 | Status |
|---|---|---|---|---|
| **tMAU (total)** | ? | +25% vs baseline | +50% vs baseline | DO ZMIERZENIA |
| tMAU kardiologia | est. ~948 | 1,300 | 1,800 | At risk |
| tMAU psychiatria | est. ~238 | 400 | 600 | Critical |
| tMAU ginekologia | est. ~757 | 1,000 | 1,400 | At risk |
| % lekarzy ze znaną spec | est. ~47% | 65% | 80% | Critical |
| MAU rate specjalistów | est. ~50% | 55% | 65% | Unknown |
| Nowi specjaliści/msc | est. ~200 | 350 | 500 | Unknown |
| Campaign Fulfillment Rate | est. ~85% broad | 90% | 95%+ | Unknown |
| Specjalizacje sprzedawalne | ~5-6 | 8 | 10+ | At risk |

---

## Co zrobić w poniedziałek

1. **Zbuduj query w PostHog:** ile zalogowanych userów per specjalizacja w ostatnich 30 dniach. To jest twój baseline tMAU. Bez tego nie wiesz, od czego startujesz.

2. **Sprawdź w bazie:** ile rezydentów ma uzupełnione pole specjalizacji. To pokaże ci skalę problemu danych.

3. **Zrób ten sam query za luty i styczeń** — masz trend czy stoisz w miejscu?

4. **Pokaż ten dokument zespołowi** — jedna metryka, którą growth owns i której reszta firmy (sprzedaż, content, product) potrzebuje żeby rosnąć.

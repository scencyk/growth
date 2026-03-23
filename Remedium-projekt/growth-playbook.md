# Remedium Growth — Co robić

## Twój North Star

**Campaign Fulfillment Rate** — % kampanii pharma, w których dowozisz KPI (impressions/clicks).

Wszystko co robisz w growth powinno prowadzić do tego, żeby Remedium mogło sprzedać więcej kampanii, na więcej specjalizacji, i dowieźć 100% KPI na każdej z nich. Jeśli działanie tego nie robi — nie jest priorytetem.

---

## Stan na dziś (marzec 2026)

Remedium ma 22,733 specjalistów i 15,138 rezydentów. To daje ~37,800 lekarzy wypisujących recepty — dokładnie tych, za których pharma płaci.

Problem nie polega na tym, że za mało lekarzy. Problem polega na tym, **gdzie ich brakuje** i **czego o nich nie wiesz**.

87% kampanii display w 2024 targetowało ALL albo POZ — bo tylko tam jest wystarczająca pojemność. Na specjalizacjach typu ginekologia czy psychiatria Remedium nie jest w stanie sprzedać pełnego pakietu, bo nie ma wystarczającego ruchu. To jest utracony przychód.

**Penetracja rynku:** 25% ze 91,100 specjalistów w Polsce. Ale rozkład jest nierówny — medycyna rodzinna 38%, onkologia 40%, a psychiatria 9.9%, gastroenterologia 18.5%, pulmonologia 16.9%.

---

## Lever 0: Audyt i czyszczenie bazy (fundament pod wszystko inne)

Zanim zaczniesz pozyskiwać nowych lekarzy i zwiększać engagement — musisz wiedzieć, co tak naprawdę masz. Dziś połowa twojej bazy jest niewidoczna dla kampanii targetowanych po specjalizacji. To znaczy, że możesz mieć znacznie więcej pojemności niż myślisz — albo znacznie mniej. Dopóki tego nie zmierzysz, każda obietnica wobec pharmy jest obarczona ryzykiem.

### Co nie wiesz o swojej bazie

**49% zweryfikowanych lekarzy to "bez specjalizacji".** Wśród nich są trzy różne grupy o różnej wartości:
- Rezydenci, którzy nie podali kierunku specjalizacji przy rejestracji (deklaratywne — NIL tego nie zwraca). Mogą być od razu "odblokowani" dla kampanii, jeśli uzupełnią profil
- Lekarze po stażu, którzy jeszcze nie zaczęli rezydentury — niska wartość dziś, ale potencjał na przyszłość
- Lekarze pracujący bez specjalizacji od lat — inna wartość niż specjaliści, ale nadal targetowalni dla kampanii ALL

Nie wiesz, ile osób jest w każdej z tych grup. To jest twoja największa niewiadoma.

**Aktualność danych.** Rezydent, który zarejestrował się 3 lata temu, mógł ukończyć specjalizację. NIL teraz by to potwierdził — ale czy robicie periodic re-check? Bez tego macie "rezydentów", którzy dawno są specjalistami, ale system tego nie wie.

**Aktywność vs rejestracja.** Mówisz pharmi "mam 1,896 kardiologów" — ale ilu z nich było aktywnych w ostatnich 30/60/90 dniach? Jeśli 40% nie wchodziło od pół roku, twoja realna pojemność kampanii jest o 40% niższa niż deklarujesz. To ryzyko reputacyjne — obiecujesz impressions, których nie dowieziesz.

**Martwe konta i duplikaty.** 146K rejestracji, 54K zweryfikowanych. 92K niezweryfikowanych — ilu to ludzie, którzy nie dokończyli procesu, a ilu to martwe konta? Wśród zweryfikowanych — ile kont z zerem logowań >12 miesięcy?

**Dentyści w danych.** Dentyści są w bazie, ale nie mają wartości dla typowej kampanii pharma (leki na receptę). Czy są czysto odseparowani w targetowaniu, czy wchodzą do "lekarze i lekarze dentyści" i rozwadniają CTR?

### Co z tym zrobić — plan audytu

**Tydzień 1: Zmierz co masz**
- Wyciągnij z bazy: ile rezydentów ma uzupełnione pole specjalizacji, a ile nie
- Zmierz MAU per specjalizacja (PostHog) — ile z zarejestrowanych faktycznie wchodzi
- Policz martwe konta: zero logowań >6 miesięcy, >12 miesięcy
- Odseparuj dentystów w raportach

**Tydzień 2: Re-check przez NIL**
- Batch re-weryfikacja rezydentów starszych niż 2 lata — NIL pokaże kto w międzyczasie ukończył specjalizację
- Automatyczny cron: re-check co 6 miesięcy dla rezydentów >3 lat od rejestracji

**Tydzień 3-4: Uzupełnij braki deklaratywne**
- Kampania wewnętrzna: "uzupełnij profil" — prosta wiadomość do rezydentów bez zadeklarowanej specjalizacji
- Dodaj obowiązkowe pole specjalizacji/kierunku rezydentury do onboardingu nowych użytkowników
- Rozważ incentive: np. dostęp do dodatkowego contentu po uzupełnieniu profilu

**Efekt:** Po tym audycie będziesz wiedzieć, ile masz naprawdę targetowalnych lekarzy per specjalizacja. To zmienia rozmowę z pharma z "mam jakichś kardiologów" na "mam 1,896 specjalistów + 620 rezydentów kardiologii, z czego 1,250 aktywnych w ostatnich 30 dniach — gwarantuję 3,200 PV/miesiąc".

---

## Lever 1: Zwiększ engagement istniejącej bazy (najwyższy impact, szybko)

To jest twój najważniejszy lever po audycie. Masz 22K specjalistów, ale jeśli tylko 50% jest aktywnych miesięcznie, tracisz połowę pojemności reklamowej. Każdy punkt procentowy MAU to więcej impressions bez ani jednej nowej rejestracji.

**Co konkretnie:**
- Zmierz MAU per specjalizacja w PostHog — nie globalny MAU, a per specialty. To twoja waluta
- Zidentyfikuj specjalizacje gdzie MAU jest niski vs baza (np. masz 1896 kardiologów, ale ile z nich wchodzi w miesiącu?)
- Personalizuj dashboard/homepage per specjalizacja — lekarz wchodzący na Remedium powinien od razu widzieć content z jego dziedziny
- Email/push z nowym contentem per specjalizacja — nie newsletter ogólny, a "nowy artykuł z kardiologii"
- Cel: MAU/baza z ~50% do 65% w 12 miesięcy → +30% pojemności PV

## Lever 2: Rozbij wąskie gardła w 5 kluczowych specjalizacjach (nowy revenue, średnioterminowo)

To jest twoja szansa na nowy przychód. Dziś nie możesz sprzedać kampanii na te specjalizacje — albo sprzedajesz z ryzykiem niedowiezienia.

**Priorytetowe specjalizacje (od najgorszej penetracji):**

| Specjalizacja | W Remedium | W Polsce | Penetracja | Brakuje do oferty |
|---|---|---|---|---|
| Psychiatria | 476 | 4,825 | 9.9% | tak — za mało na jakąkolwiek kampanię |
| Pulmonologia | 557 | 3,299 | 16.9% | nie — ale na granicy |
| Reumatologia | 314 | 1,843 | 17.0% | tak |
| Gastroenterologia | 231 | 1,249 | 18.5% | tak |
| Nefrologia | 280 | 1,468 | 19.1% | tak |

**Co konkretnie:**
- Cel per specjalizacja: +50% lekarzy w 12 miesięcy (np. psychiatria: z 476 do 714)
- Kampanie akwizycyjne targetowane — content dedykowany per specjalizacja jako magnes
- Partnerstwa z towarzystwami naukowymi (PTPs, PTG, PTR)
- Webinary z KOL-ami per specjalizacja — dane z Live Konferencje pokazują, że to działa (19-48% show-up rate)
- Każda zdobyta specjalizacja to nowa możliwość sprzedaży kampanii za 800-1,392 PLN/msc

## Lever 3: Utrzymaj pipeline przyszłych specjalistów (niski koszt, long-term)

15,138 rezydentów to twoi przyszli specjaliści. Za 2-5 lat będą wypisywać recepty i pharma będzie chciała do nich dotrzeć. Nie musisz tu dużo inwestować — ale musisz ich nie stracić.

**Co konkretnie:**
- Zmierz retencję rezydentów rok do roku — cel: >80%
- Studenci 5-6 roku i stażyści: utrzymuj obecność, dawaj wartość (kalkulatory, case studies)
- Studenci 1-4 roku: organic, zero inwestycji — przyjdą sami jak będą potrzebować
- To jest Tier 2/3 — nie poświęcaj na to czasu kosztem levers 0, 1 i 2

---

## Czego NIE robić

- **Nie gonić za liczbą rejestracji.** Rynek jest skończony (141K lekarzy). Liczy się kto się rejestruje (specjalizacja), czy wiesz kim jest (czystość danych), i czy wraca (MAU)
- **Nie optymalizować opt-in / zgód marketingowych.** Twój model to display/impressions, nie email marketing. Opt-in nie wpływa na realizację kampanii
- **Nie inwestować równo we wszystkie segmenty.** Studenci 1-4 roku nie generują przychodu przez 5-10 lat. Skup się na tych, którzy wypisują recepty dziś
- **Nie sprzedawać kampanii na specjalizacje, gdzie nie możesz dowieźć.** Lepiej odmówić niż niedowieźć i stracić klienta
- **Nie zakładać, że baza = pojemność.** Bez wiedzy o MAU per specjalizacja i czystości danych, liczba rejestracji to vanity metric

---

## Jak mierzyć sukces

**Metryki tygodniowe (operacyjne):**
- MAU per top 10 specjalizacji
- Pace realizacji aktywnych kampanii (% KPI vs % upływu czasu)
- Nowe rejestracje per specjalizacja
- % profili z uzupełnioną specjalizacją (wśród rezydentów)

**Metryki miesięczne (taktyczne):**
- Campaign Fulfillment Rate (ile kampanii dowiezionych na 100%)
- Active Prescribers per Specialty — trend
- PV per session (depth of visit)
- Czystość bazy: % lekarzy z potwierdzoną/zadeklarowaną specjalizacją

**Metryki kwartalne (strategiczne):**
- Liczba specjalizacji, na które można sprzedać kampanię (dziś: ~5-6, cel: 10+)
- Nowe kampanie na specjalizacje, które wcześniej były niedostępne
- Revenue per specialty tier
- Targetable Physician Inventory per specjalizacja (zweryfikowani + specjalizacja + aktywni)

---

## Kolejność działań — co najpierw

**Tydzień 1-2:** Audyt bazy. Zmierz: ile rezydentów ma specjalizację w profilu, MAU per specjalizacja, martwe konta, odseparuj dentystów. Bez tego latasz na ślepo.

**Tydzień 3-4:** Re-check NIL dla starszych rezydentów + kampania "uzupełnij profil". Dodaj obowiązkowe pole specjalizacji do onboardingu.

**Miesiąc 2:** Z nową wiedzą o bazie — zidentyfikuj 3 specjalizacje z najgorszym ratio MAU/baza. Uruchom engagement actions na nich. Równolegle: pierwsza kampania akwizycyjna na jedną bottleneck specjalizację (psychiatria — największy gap, kalkulatory psychiatryczne już sprzedane, jest na czym budować).

**Miesiąc 3:** Zmierz efekt. Jeśli działa — skaluj na kolejne specjalizacje. Jeśli nie — pivot na inny lever.

**Q2 2026:** Cel — mieć 2-3 nowe specjalizacje "sprzedawalne" dla pharma, z czystymi danymi pozwalającymi na pewną wycenę pojemności.

---

## Jeden slajd dla zarządu

Remedium zarabia na kampaniach pharma targetowanych po specjalizacji. Dziś 87% kampanii celuje w ALL/POZ, bo tylko tam jest pojemność. Żeby odblokować nowy przychód, musimy:

1. **Wiedzieć co mamy** — połowa bazy jest niewidoczna dla kampanii (brak specjalizacji w profilu). Audyt i czyszczenie danych to fundament
2. **Aktywować co mamy** — zwiększyć MAU istniejących lekarzy per specjalizacja, bo każdy aktywny lekarz to impressions
3. **Zdobyć czego brakuje** — psychiatria, gastro, reuma, nefro, pulmo to specjalizacje, na których nie możemy sprzedać kampanii. Każda zdobyta = nowa linia przychodowa

Efekt: z 5-6 sprzedawalnych specjalizacji do 10+ w ciągu roku. Pewniejsza realizacja KPI. Więcej kampanii. Wyższy przychód.

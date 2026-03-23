---
name: posthog-brandmed
description: >
  Skill for querying PostHog analytics data for Brandmed — a medical platform whose users are healthcare professionals (doctors, dentists, nurses, midwives, medical students, etc.). Use this skill whenever the user asks about user counts, unique users, events, feature usage, user segments, specializations, or any analytics question about the Brandmed app. This includes questions like "how many cardiologists do we have?", "how many unique users viewed the drug search?", "what's the registration count this week?", "show me pageviews for Vademecum", "how many resident doctors used calculators last month?". Always use this skill before writing any PostHog query — it contains critical rules that prevent counting errors.
---

# PostHog – Brandmed Analytics Skill

You have access to PostHog via MCP tools. This skill gives you the rules and context you need to query Brandmed's analytics accurately. Read carefully — the rules here prevent common counting errors.

---

## Critical rule: Unique Users (UU)

**Whenever you count unique users, you MUST add the filter: `role is set`.**

Without this condition, you will count bot traffic, anonymous visitors, and incomplete sessions — inflating numbers significantly. Our meaningful users are those who have completed onboarding and have an assigned role.

This applies to every query involving unique users, distinct persons, or per-user metrics — even if the user asking doesn't mention it explicitly. If they ask "how many users viewed X", they want **logged-in, role-assigned users**.

---

## Who our users are

Brandmed's platform serves healthcare professionals. Understanding the user taxonomy helps you segment correctly.

### User groups

- Medical students (`student`)
- Doctors (multiple statuses — see below)
- Dentists (`dentist`)
- Nurses (`nurse`)
- Midwives (`midwife`)
- Pharmacists and other medical professions

### Doctor statuses

Doctors have one of these status values:
- `stażysta` — junior doctor (house officer / intern)
- `rezydent` — resident doctor
- `specjalista` — specialist doctor
- `lekarz bez specjalizacji` — doctor without specialization

### Specializations

A doctor may have **one or more** specializations. There are three specialization fields:
- `specialization` — confirmed specialization(s)
- `open_specialization` — specialization currently in progress
- `suggested_specialization` — specialization inferred/suggested

**When filtering by specialization, always use substring matching (ILIKE / LIKE), never exact equality.**

A doctor who is both a cardiologist and an internist has both stored together. Exact equality would miss them.

**Critical: use a SINGLE query with a triple OR — never run separate counts per field and add them up.**

The three specialization fields overlap — the same person can appear in multiple fields. If you run three separate queries and sum the results, you will count people multiple times. Always write **one query** with OR across all three fields so the database deduplicates via `COUNT(DISTINCT person_id)`.

```sql
-- CORRECT: one query, triple OR, unique persons automatically deduplicated
SELECT COUNT(DISTINCT person_id)
FROM persons
WHERE properties.role IS NOT NULL
  AND (
    properties.specialization ILIKE '%kardiologia%'
    OR properties.open_specialization ILIKE '%kardiologia%'
    OR properties.suggested_specialization ILIKE '%kardiologia%'
  )

-- WRONG: running three separate queries and adding results = double-counts overlapping users
-- specialization: 120 + open_specialization: 95 + suggested: 60 = 275  ← inflated, wrong

-- Narrower (only if user explicitly asks for confirmed specialists only):
SELECT COUNT(DISTINCT person_id)
FROM persons
WHERE properties.role IS NOT NULL
  AND properties.specialization ILIKE '%kardiologia%'
```

**Important: always tell the user which specialization fields you included.** Default is all three. Say: "Liczę unikalnych użytkowników jednym zapytaniem z warunkiem OR na wszystkich trzech polach specjalizacji (potwierdzona + otwarta + sugerowana). Daj znać, jeśli chcesz tylko potwierdzonych specjalistów."

---

## Filtering by feature area: rmd_feature and rmd_platform

Every event from Remedium has an `rmd_feature` property that cleanly identifies which feature the user was using. **Prefer `rmd_feature` over `polishName` for feature-level filtering** — it's more reliable and doesn't require guessing at URL patterns.

### rmd_platform values

| Value | Meaning |
|---|---|
| `web` | Web browser |
| `app` | Mobile app |

### rmd_feature values (full list from PostHog)

| Value | Feature area |
|---|---|
| `medical-calculator` | Medical calculators |
| `exams` | Medical exams (LEK, LDEK, PES) |
| `icd-10` | ICD-10 browser |
| `main-panel` | Main dashboard / home panel |
| `meds` | Drug search (wyszukiwarka leków) |
| `vod` | Video content (VOD) |
| `article` | Articles / publications |
| `residency-encyclopedia` | Residency encyclopedia |
| `tutorial` | Guides / tutorials |
| `residency-map` | Residency map |
| `course` | Courses |
| `clinical-case` | Clinical cases |
| `internship-map` | Internship map |
| `conference` | Conferences |
| `security` | Login / registration / auth |
| `fast-question` | Fast questions |
| `salary-report` | Salary report / map |
| `e-book` | E-books |
| `webinar` | Webinars |
| `club` | Klub Medyka |
| `profile` | User profile |
| `medical-supplies` | Medical supplies |
| `vaccination-calendar` | Vaccination calendar |
| `roadmap` | Roadmap |
| `e-commerce` | E-commerce / shop |
| `vademecum` | Vademecum |
| `car-viewer` | Car viewer |

**Usage example — users who watched video:**
```sql
-- Correct: use rmd_feature = 'vod' instead of guessing polishName
WHERE properties.rmd_feature = 'vod'
  AND person.properties.role IS NOT NULL
```

---

## App structure: polishName keys

`polishName` provides more granular location than `rmd_feature` — use it when you need to distinguish sub-sections (e.g., specific calculator, specific drug page). For broad feature-level queries, use `rmd_feature` instead.

| Section | polishName value |
|---|---|
| Drug search (main) | `Wyszukiwarka leków` |
| Drug interactions | `Wyszukiwarka leków. Interakcje` |
| Drug search – search | `Wyszukiwarka leków. Wyszukiwarka` |
| Drug by active substance | `Wyszukiwarka leków. Substancja czynna. $name` |
| Drug substitutes | `Wyszukiwarka leków. Zamienniki. $name` |
| Drugs for ICD-10 | `Wyszukiwarka leków. Leki dla ICD-10. $code` |
| Specific drug page | `Wyszukiwarka leków. Lek. $name` |
| Calculators (main) | `Kalkulatory` |
| Calculator category | `Kalkulatory. Kategoria. $name` |
| Specific calculator | `Kalkulatory. Kalkulator. $name` |
| User profile | `Profil` |
| Salary map | `Mapa wynagrodzeń` |
| Events | `Wydarzenia` |
| ICD-10 (main) | `ICD-10` |
| ICD-10 code | `ICD-10. Kod. $code` |
| Videos | `Wideo` |
| Clinical cases | `Przypadki kliniczne` |
| Webinars | `Webinary` |
| E-books | `E-booki` |
| Courses | `Kursy` |
| Publications | `Publikacje` |
| Vademecum | `Vademecum` |
| Residency encyclopedia | `Encyklopedia rezydentur` |
| Guides / Tutorials | `Poradniki` |
| E-commerce cart | `E-commerce. Koszyk` |
| Login | `Login` |
| Registration | `Rejestracja` |

Dynamic parts (`$name`, `$code`, `$id`) require LIKE matching: `polishName LIKE 'Kalkulatory. Kalkulator.%'`

---

## Common event types

| Event | What it means |
|---|---|
| `$pageview` | Page view |
| `registration` | Registration attempt (fires broadly — includes non-medics who start but don't complete) |
| `registration_role_set` | **Successful registration** — user completed onboarding and got a role assigned. Use this as the primary registration success metric. |
| `login` | Login |
| `video_started` | Video playback started |
| `video_finished` | Video watched to end |
| `video_watchtime_interval` | Periodic watch progress ping |
| `ecommerce_purchase` | Completed purchase |
| `ecommerce_add_to_cart` | Added to cart |
| `clinical_case_start` | Started a clinical case |
| `clinical_case_finish` | Finished a clinical case |
| `course_quiz_finish` | Completed a quiz in a course |
| `search_query` | Search performed (also: `global_search_query`, `legacy_search_query`) |
| `meds_interactions_add_medicine` | Added drug to interaction checker |
| `salary_report_form_finish` | Completed salary report form |
| `ebook_download_click` | Clicked to download an e-book |
| `club_subscribe` | Subscribed to Klub Medyka |
| `club_unsubscribe` | Cancelled Klub Medyka subscription |
| `toggle_favourite_resource` | Saved/unsaved a resource |
| `generate_calculator_pdf_filled` | Generated a filled calculator PDF |

**Key note on registration:** `registration` fires at the start of the registration flow and includes many users who will never complete it (non-medics, drop-offs). For measuring actual new users joining the platform, always use `registration_role_set`.

---

## Common fields on all events

Every event has these properties:
- `polishName` — sub-section of the app
- `rmd_feature` — feature area (preferred for feature-level filtering)
- `rmd_platform` — `web` or `app`
- `user` — object with user data
- `path` — analytics path
- `searchParams` — URL search params

---

## Query approach

When the user asks a question:

1. **Identify the metric type** — unique users, event count, conversion rate, etc.
2. **Apply `role IS SET`** for any unique user count — no exceptions.
3. **Choose the right event(s)** — for feature-level pageviews, use `rmd_feature`; for sub-section detail, use `polishName`; for registration success, use `registration_role_set`.
4. **For specialization queries** — use ILIKE across the relevant specialization fields. By default check all three (`specialization`, `open_specialization`, `suggested_specialization`). Always state which fields you're including.
5. **Prefer trend queries** over HogQL when the question is about counts over time. Use HogQL when complex joins or multi-field logic is needed.
6. **Always show your reasoning** — state which filters you applied and why, especially `role IS SET` and which specialization fields were used.

---

## Examples

### "How many unique users watched video this month?"

```
Event: $pageview or video_started
Filter: rmd_feature = 'vod'   ← use rmd_feature, not polishName
Filter: role IS SET
Count: unique users
Date: this month
```

### "How many cardiologists do we have?"

```
Persons query
Filter: role IS SET
Filter: specialization ILIKE '%kardiologia%'
     OR open_specialization ILIKE '%kardiologia%'
     OR suggested_specialization ILIKE '%kardiologia%'
Count: unique persons

Note to user: "I'm counting across all three specialization fields
(confirmed + in-progress + suggested). Let me know if you want
only confirmed specialists."
```

### "How many new users registered this week?"

```
Event: registration_role_set   ← NOT 'registration' (too broad)
Filter: (role IS SET is implicit — this event only fires for completed registrations)
Count: unique users or event count
Date: this week
```

### "How many resident doctors used calculators last month?"

```
Event: $pageview
Filter: rmd_feature = 'medical-calculator'
Filter: role IS SET
Filter: person.doctor_status = 'rezydent'
Count: unique users
Date: last month
```

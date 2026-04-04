# Unit Conversions — Design Notes

## Unit Table

| Unit    | Type   | System  | Base (g or ml) |
|---------|--------|---------|----------------|
| g       | weight | metric  | 1              |
| kg      | weight | metric  | 1000           |
| oz      | weight | US      | 28.35          |
| lb      | weight | US      | 453.59         |
| ml      | volume | metric  | 1              |
| L       | volume | metric  | 1000           |
| fl oz   | volume | US      | 29.57          |
| cup     | volume | US      | 240            |
| pint    | volume | US      | 473.18         |
| quart   | volume | US      | 946.35         |
| gallon  | volume | US      | 3785.41        |
| tsp     | spoon  | neutral | —              |
| tbsp    | spoon  | neutral | —              |
| piece   | count  | neutral | —              |
| clove   | count  | neutral | —              |
| slice   | count  | neutral | —              |
| handful | count  | neutral | —              |
| pinch   | count  | neutral | —              |
| bunch   | count  | neutral | —              |
| sprig   | count  | neutral | —              |
| bag     | count  | neutral | —              |
| pack    | count  | neutral | —              |
| bottle  | count  | neutral | —              |
| yolk    | count  | neutral | —              |
| rib     | count  | neutral | —              |
| shot    | count  | neutral | —              |

---

## What Converts to What

| Metric | US      |
|--------|---------|
| g      | oz      |
| kg     | lb      |
| ml     | fl oz   |
| L      | fl oz   |
| tsp    | tsp     |
| tbsp   | tbsp    |

Count and spoon units are neutral — they stay the same in both systems.

---

## Conversion Formulas

### Metric → US
| Metric | US     | Formula        |
|--------|--------|----------------|
| 1 g    | 0.035 oz  | g × 0.035   |
| 1 kg   | 2.205 lb  | kg × 2.205  |
| 1 ml   | 0.034 fl oz | ml × 0.034 |
| 1 L    | 33.814 fl oz | L × 33.814 |

### US → Metric
| US       | Metric  | Formula              |
|----------|---------|----------------------|
| 1 oz     | 28.35 g    | oz × 28.35        |
| 1 lb     | 453.59 g   | lb × 453.59       |
| 1 fl oz  | 29.57 ml   | fl oz × 29.57     |
| 1 cup    | 240 ml     | cup × 240         |
| 1 pint   | 473.18 ml  | pint × 473.18     |
| 1 quart  | 946.35 ml  | quart × 946.35    |
| 1 gallon | 3785.41 ml | gallon × 3785.41  |

---

## Rules

- **Metric mode** — display in g, kg, ml, L. Never convert tsp/tbsp to ml.
- **US mode** — display in oz, lb, fl oz, cup, pint, quart, gallon. Never convert tsp/tbsp to fl oz.
- **tsp/tbsp** — always stay as tsp/tbsp in both modes. 1 tbsp = 3 tsp for merging purposes.
- **Count units** — never converted. Listed separately if units differ.
- **Incompatible units** — if two recipes use weight + volume for the same ingredient, list them separately rather than attempting a conversion.

---

## Grocery List Merging

- Same ingredient, same unit → merge quantities (200ml + 100ml = 300ml)
- Same ingredient, metric + metric → convert to same unit then merge
- Same ingredient, US + US → convert to same unit then merge
- Same ingredient, metric + US → convert both to base unit, merge, display in user's preferred system
- Same ingredient, spoon + spoon → merge (2 tsp + 1 tbsp = 5 tsp)
- Same ingredient, count + anything → list separately

---

## Settings

A toggle in the Settings sheet: **Metric / US**
- Stored in localStorage as `gc_units`
- Affects how recipe ingredient amounts are displayed
- Affects how grocery list quantities are shown
- Does not change the stored data — conversion happens at display time

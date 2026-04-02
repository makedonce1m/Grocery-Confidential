# Unit Conversions — Design Notes

## Concept
A standalone conversions file (`conversions.js` or similar) that the app can call
whenever it needs to convert between units. Two use cases:

1. **Automatic merging** — when two recipes both need "milk" but one says 200ml and
   the other says 1 cup, the app looks up the conversion and combines them into one
   grocery entry.

2. **Interactive converter** — a small tool the user can open to ask "how much is
   this in that?", e.g. "2 cups → how many ml?"

---

## Unit Groups

### Volume
| Unit       | Base (ml) |
|------------|-----------|
| ml         | 1         |
| L          | 1000      |
| tsp        | 4.92892   |
| tbsp       | 14.7868   |
| fl oz      | 29.5735   |
| cup        | 240       |
| pint       | 473.176   |
| quart      | 946.353   |
| gallon     | 3785.41   |

### Weight
| Unit       | Base (g)  |
|------------|-----------|
| g          | 1         |
| kg         | 1000      |
| oz         | 28.3495   |
| lb         | 453.592   |

### Count / Non-convertible
Some units can't be converted mathematically — they depend on the ingredient:
- piece, clove, slice, handful, pinch, bunch, sprig

These should never be auto-merged with volume or weight units.
If two recipes use incompatible units for the same ingredient, list them separately
on the grocery list rather than attempting a conversion.

---

## Conversion Logic (rough idea)
```
convert(amount, fromUnit, toUnit):
  if fromUnit === toUnit → return amount
  if both units are in the same group (volume or weight):
    baseValue = amount × baseMultiplier[fromUnit]
    return baseValue / baseMultiplier[toUnit]
  else:
    cannot convert → return null (list separately)
```

---

## Interactive Converter (future UI)
A small converter tool accessible from the recipe view or a dedicated screen:
- Pick a unit (e.g. "cup")
- Enter an amount (e.g. "2")
- Pick target unit (e.g. "ml")
- Shows result: "2 cups = 480 ml"

Could also auto-detect conversions in instruction text — e.g. if an instruction
says "add 2 cups (480ml)" it recognises both values.

---

## Metric vs US Toggle (future)
A global setting: "Preferred units — Metric / US"
- Metric: g, kg, ml, L
- US: oz, lb, tsp, tbsp, cup, fl oz

When set, recipe amounts display in the preferred system. The conversions file
handles the translation. Stored in user settings in localStorage.

---

## Open Questions
- [ ] Should the converter be a standalone screen, a modal, or inline on the recipe page?
- [ ] Do we want the metric/US toggle as a global setting from day one, or add it later?

# Recipes Feature — Design Notes

## Recipe Tags (categories)
- Breakfast
- Lunch
- Dinner
- Sauces
- Dessert
- Cocktails

## All Decided

### Core features
- [x] Scaling — servings picker, all ingredient amounts scale proportionally
- [x] Merging — same ingredient from multiple recipes merges into one grocery entry
- [x] Step-by-step instructions
- [x] Recipe photo — one image per recipe, tappable to change
- [x] Favourites — heart button on each recipe card and recipe page
- [x] Prep time + cook time — separate fields, total auto-calculated
- [x] Timers — future, auto-detected from instruction text (e.g. "simmer for 20 min" → tappable timer)
- [x] Creating recipes — manually only for now

### Navigation
- [x] Recipes gets its own tab in the nav bar (3 tabs total: Items · Recipes · Grocery)
- [x] The FAB (the big + button in the nav bar) is removed from the nav entirely
- [x] Items view: + button moves to the header (top right, same row as Edit)
- [x] Recipes view: + button in the Recipes header to create a new recipe

### Recipe list view
- [x] Default sort: favourites first, then rest by most recently added
- [x] Sort button in header cycles through 3 modes:
  1. Favourites first (default)
  2. A → Z alphabetical
  3. Added order (newest first)
- [x] Show all recipes by default (no filter on open)

### Adding to grocery list
- [x] One "Add to groceries" button on the recipe page
- [x] Tapping it opens a bottom sheet popup showing:
  - Recipe name at top
  - Servings picker to scale amounts before adding
  - Full ingredient list with checkboxes (all checked by default)
  - Each row: checkbox · ingredient name · amount + unit
  - Tap any ingredient to deselect it
  - Confirm button at bottom: "Add X ingredients to list"

---

## Recipe Card (in list view)
- Photo thumbnail (left)
- Name (bold)
- Tag (Breakfast / Lunch / etc.)
- Prep · Cook · Total time
- Heart icon (tappable favourite toggle)

## Recipe Page Layout (top to bottom)
1. Photo — full width, tap to change
2. Name (large) + heart icon (top right)
3. Tag pill | Prep Xmin | Cook Xmin | Total Xmin
4. Step-by-step instructions — numbered cards, time mentions are tappable (future timer)
5. "Add to groceries" button — opens bottom sheet (see above)

---

## Data Structure
```
Recipe {
  id
  name
  tag             // breakfast | lunch | dinner | sauces | dessert | cocktails
  photo           // base64 or blob URL
  favourite       // boolean
  prepTime        // minutes (number)
  cookTime        // minutes (number)
  totalTime       // calculated: prepTime + cookTime
  servings        // default serving size
  ingredients: [
    { itemName, amount, unit }   // e.g. { "Chicken", 400, "g" }
  ]
  instructions: [ string ]      // ordered steps
  createdAt       // timestamp for "added order" sort
}
```

## Units to Support
- Weight: g, kg
- Volume: ml, L, tsp, tbsp, cup
- Count: piece, clove, slice, handful, pinch, sprig
- Free text fallback for anything else

## Grocery List Integration
- Servings picker in the bottom sheet scales all amounts before adding
- Each selected ingredient → grocery entry with amount + unit
- Same ingredient already on the list → quantities merge
- Units must match to merge (200ml + 100ml = 300ml, but 200ml + 1 cup = listed separately until conversions are built)

# Recipes Feature — Design Notes

## Recipe Categories
- Breakfast
- Lunch
- Dinner
- Sauces
- Dessert
- Cocktails

## Decided
- [x] Scaling — yes, servings field with automatic amount scaling
- [x] Merging — yes, same ingredient from multiple recipes merges into one grocery entry
- [x] Instructions — yes, step-by-step, shown below the ingredient list
- [x] Ingredient list is interactive — each ingredient is tappable to toggle whether it gets added
- [x] "Add all ingredients" button to add everything at once

## Recipe Card (list view)
- Photo thumbnail
- Name
- Category
- Prep / Cook / Total time
- Favourite star (tappable)

## Recipe Page Layout (top to bottom)
1. Photo (full width)
2. Recipe name + favourite star
3. Category | Prep Xmin | Cook Xmin | Total Xmin
4. Servings picker (−/+ to scale from default)
5. Ingredients list — each one tappable (checked/unchecked), shows scaled amount + unit
6. "Add selected to grocery list" button + "Add all" button
7. Step-by-step instructions (timers auto-detected from text, tappable)

## Decided (continued)
- [x] Recipe photo — yes, one image per recipe
- [x] Timers — future feature, timers triggered from instruction steps (e.g. "simmer for 20 min" becomes a tappable timer)
- [x] Creating recipes — manually only for now, no URL import
- [x] Unit conversion — a separate conversions file (see FUTURE_CONVERSIONS.md)

## Decided (continued)
- [x] Favourites — yes, star/heart button on each recipe, filterable from the recipe list
- [x] Prep time + cook time — yes, both separate fields (e.g. prep: 15 min, cook: 30 min)
  - Total time calculated automatically (prep + cook)
  - Shown on the recipe card in the list view

## Data Structure (rough idea)
```
Recipe {
  id
  name
  category        // breakfast | lunch | dinner | sauces | dessert | cocktails
  photo           // stored as base64 or a local blob URL
  favourite       // boolean
  prepTime        // minutes
  cookTime        // minutes
  totalTime       // calculated: prepTime + cookTime
  servings        // default serving size the amounts are written for
  ingredients: [
    { itemName, amount, unit }   // e.g. "chicken", 400, "g"
  ]
  instructions: [ string ]      // ordered steps, timers auto-detected from text
}
```

## Units to Support
- Weight: g, kg
- Volume: ml, L, tsp, tbsp, cup
- Count: piece, clove, slice, handful
- Free text fallback for anything else

## Grocery List Integration
When adding from a recipe:
- Servings picker lets you scale up/down before adding (amounts adjust proportionally)
- Each selected ingredient becomes a grocery entry with amount + unit pre-filled
- If the same ingredient already exists on the list, quantities merge into one entry

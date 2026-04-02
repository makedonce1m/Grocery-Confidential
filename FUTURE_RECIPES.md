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

## Recipe Page Layout (top to bottom)
1. Recipe name + category + servings picker (e.g. −/+ to adjust from default)
2. Ingredients list — each one tappable (checked/unchecked), shows amount + unit
3. "Add selected to grocery list" button
4. "Add all ingredients" button
5. Step-by-step instructions

## Decided (continued)
- [x] Recipe photo — yes, one image per recipe
- [x] Timers — future feature, timers triggered from instruction steps (e.g. "simmer for 20 min" becomes a tappable timer)
- [x] Creating recipes — manually only for now, no URL import
- [x] Unit conversion — a separate conversions file (see FUTURE_CONVERSIONS.md)

## Open Questions / Still To Discuss
- [ ] Do we want a favourites / star system for recipes?
- [ ] Should there be a prep time / cook time field?

## Data Structure (rough idea)
```
Recipe {
  id
  name
  category        // breakfast | lunch | dinner | sauces | dessert | cocktails
  servings        // default serving size the amounts are written for
  ingredients: [
    { itemName, amount, unit }   // e.g. "chicken", 400, "g"
  ]
  instructions: [ string ]      // ordered steps
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

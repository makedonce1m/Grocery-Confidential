# Recipes Feature — Design Notes

## Recipe Categories
- Breakfast
- Lunch
- Dinner
- Sauces
- Dessert
- Cocktails

## Open Questions / To Discuss
- [ ] Should recipes have a photo or just text?
- [ ] Do we want a "servings" field so quantities scale? (e.g. recipe is for 4, you're cooking for 2)
- [ ] Should adding a recipe to the grocery list merge duplicates? (two recipes both need garlic → combine into one grocery entry)
- [ ] Do we want a "favourites" or star system for recipes?
- [ ] Should there be a prep time / cook time field?
- [ ] Step-by-step instructions, or just the ingredient list?

## Data Structure (rough idea)
```
Recipe {
  id
  name
  category        // breakfast | lunch | dinner | sauces | dessert | cocktails
  servings        // default serving size
  ingredients: [
    { itemName, amount, unit }   // e.g. "chicken", 400, "g"
  ]
  instructions    // optional steps
}
```

## Units to Support
- Weight: g, kg
- Volume: ml, L, tsp, tbsp, cup
- Count: piece, clove, slice, handful
- Free text fallback for anything else

## Grocery List Integration
When a recipe is added to the grocery list:
- Each ingredient becomes a grocery entry with its amount + unit pre-filled
- If the same ingredient already exists on the list, quantities should merge
- Scaling: if recipe serves 4 but you pick "2 servings", amounts halve automatically

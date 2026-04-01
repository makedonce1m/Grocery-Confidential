/* ─────────────────────────────────────────────
   Grocery Confidential — listdatabase.js
   Edit this file to add, remove or rename
   categories and items. Do not touch app.js.
   ───────────────────────────────────────────── */

// ══════════════════════════════════════════════
//  CATEGORIES
//  Fields: id (unique, no spaces), name, emoji
// ══════════════════════════════════════════════

const DEFAULT_CATEGORIES = [
  { id: 'protein',    name: 'Protein',    emoji: '🥩' },
  { id: 'dairy',      name: 'Dairy',      emoji: '🥛' },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥦' },
  { id: 'carbs',      name: 'Carbs',      emoji: '🍞' },
  { id: 'household',  name: 'Household',  emoji: '🧹' },
];

// ══════════════════════════════════════════════
//  ITEMS
//  Fields:
//    id         — unique string, no spaces
//    name       — display name
//    categoryId — must match an id above
//    unit       — optional (e.g. 'kg', 'pack') or ''
// ══════════════════════════════════════════════

const DEFAULT_ITEMS = [
  // ── Protein ──────────────────────────────────
  { id: 'pr01', name: 'Chicken Breast',     categoryId: 'protein',    unit: 'kg' },
  { id: 'pr02', name: 'Chicken Thighs',     categoryId: 'protein',    unit: 'kg' },
  { id: 'pr03', name: 'Ground Beef',        categoryId: 'protein',    unit: 'kg' },
  { id: 'pr04', name: 'Beef Steak',         categoryId: 'protein',    unit: 'kg' },
  { id: 'pr05', name: 'Pork Chops',         categoryId: 'protein',    unit: 'kg' },
  { id: 'pr06', name: 'Bacon',              categoryId: 'protein',    unit: 'pack' },
  { id: 'pr07', name: 'Salmon Fillet',      categoryId: 'protein',    unit: 'fillet' },
  { id: 'pr08', name: 'Canned Tuna',        categoryId: 'protein',    unit: 'can' },
  { id: 'pr09', name: 'Shrimp',             categoryId: 'protein',    unit: 'kg' },
  { id: 'pr10', name: 'Eggs',               categoryId: 'protein',    unit: 'dozen' },
  { id: 'pr11', name: 'Ground Turkey',      categoryId: 'protein',    unit: 'kg' },
  { id: 'pr12', name: 'Sausage',            categoryId: 'protein',    unit: 'pack' },
  { id: 'pr13', name: 'Lamb Chops',         categoryId: 'protein',    unit: 'kg' },
  { id: 'pr14', name: 'Ham',                categoryId: 'protein',    unit: 'pack' },
  { id: 'pr15', name: 'Deli Turkey',        categoryId: 'protein',    unit: 'pack' },
  // ── Dairy ────────────────────────────────────
  { id: 'd01',  name: 'Whole Milk',         categoryId: 'dairy',      unit: 'jug' },
  { id: 'd02',  name: 'Skim Milk',          categoryId: 'dairy',      unit: 'jug' },
  { id: 'd03',  name: 'Butter',             categoryId: 'dairy',      unit: 'pack' },
  { id: 'd04',  name: 'Cheddar Cheese',     categoryId: 'dairy',      unit: 'block' },
  { id: 'd05',  name: 'Mozzarella',         categoryId: 'dairy',      unit: 'pack' },
  { id: 'd06',  name: 'Parmesan',           categoryId: 'dairy',      unit: 'block' },
  { id: 'd07',  name: 'Cream Cheese',       categoryId: 'dairy',      unit: 'tub' },
  { id: 'd08',  name: 'Sour Cream',         categoryId: 'dairy',      unit: 'tub' },
  { id: 'd09',  name: 'Heavy Cream',        categoryId: 'dairy',      unit: 'carton' },
  { id: 'd10',  name: 'Greek Yogurt',       categoryId: 'dairy',      unit: 'tub' },
  { id: 'd11',  name: 'Yogurt',             categoryId: 'dairy',      unit: 'tub' },
  { id: 'd12',  name: 'Cottage Cheese',     categoryId: 'dairy',      unit: 'tub' },
  { id: 'd13',  name: 'Almond Milk',        categoryId: 'dairy',      unit: 'carton' },
  // ── Vegetables ───────────────────────────────
  { id: 'v01',  name: 'Tomatoes',           categoryId: 'vegetables', unit: '' },
  { id: 'v02',  name: 'Lettuce',            categoryId: 'vegetables', unit: 'head' },
  { id: 'v03',  name: 'Spinach',            categoryId: 'vegetables', unit: 'bag' },
  { id: 'v04',  name: 'Kale',               categoryId: 'vegetables', unit: 'bunch' },
  { id: 'v05',  name: 'Broccoli',           categoryId: 'vegetables', unit: 'head' },
  { id: 'v06',  name: 'Carrots',            categoryId: 'vegetables', unit: 'bag' },
  { id: 'v07',  name: 'Celery',             categoryId: 'vegetables', unit: 'bunch' },
  { id: 'v08',  name: 'Cucumber',           categoryId: 'vegetables', unit: '' },
  { id: 'v09',  name: 'Bell Peppers',       categoryId: 'vegetables', unit: '' },
  { id: 'v10',  name: 'Onions',             categoryId: 'vegetables', unit: 'bag' },
  { id: 'v11',  name: 'Garlic',             categoryId: 'vegetables', unit: 'bulb' },
  { id: 'v12',  name: 'Potatoes',           categoryId: 'vegetables', unit: 'bag' },
  { id: 'v13',  name: 'Sweet Potatoes',     categoryId: 'vegetables', unit: '' },
  { id: 'v14',  name: 'Mushrooms',          categoryId: 'vegetables', unit: 'pack' },
  { id: 'v15',  name: 'Zucchini',           categoryId: 'vegetables', unit: '' },
  { id: 'v16',  name: 'Corn',               categoryId: 'vegetables', unit: '' },
  { id: 'v17',  name: 'Avocados',           categoryId: 'vegetables', unit: '' },
  { id: 'v18',  name: 'Apples',             categoryId: 'vegetables', unit: '' },
  { id: 'v19',  name: 'Bananas',            categoryId: 'vegetables', unit: 'bunch' },
  { id: 'v20',  name: 'Oranges',            categoryId: 'vegetables', unit: '' },
  { id: 'v21',  name: 'Strawberries',       categoryId: 'vegetables', unit: 'punnet' },
  { id: 'v22',  name: 'Blueberries',        categoryId: 'vegetables', unit: 'punnet' },
  { id: 'v23',  name: 'Lemons',             categoryId: 'vegetables', unit: '' },
  { id: 'v24',  name: 'Limes',              categoryId: 'vegetables', unit: '' },
  // ── Carbs ────────────────────────────────────
  { id: 'c01',  name: 'White Bread',        categoryId: 'carbs',      unit: 'loaf' },
  { id: 'c02',  name: 'Whole Wheat Bread',  categoryId: 'carbs',      unit: 'loaf' },
  { id: 'c03',  name: 'Sourdough',          categoryId: 'carbs',      unit: 'loaf' },
  { id: 'c04',  name: 'Pasta',              categoryId: 'carbs',      unit: 'pack' },
  { id: 'c05',  name: 'White Rice',         categoryId: 'carbs',      unit: 'bag' },
  { id: 'c06',  name: 'Brown Rice',         categoryId: 'carbs',      unit: 'bag' },
  { id: 'c07',  name: 'Quinoa',             categoryId: 'carbs',      unit: 'bag' },
  { id: 'c08',  name: 'Oatmeal',            categoryId: 'carbs',      unit: 'box' },
  { id: 'c09',  name: 'Bagels',             categoryId: 'carbs',      unit: 'pack' },
  { id: 'c10',  name: 'Flour Tortillas',    categoryId: 'carbs',      unit: 'pack' },
  { id: 'c11',  name: 'Pita Bread',         categoryId: 'carbs',      unit: 'pack' },
  { id: 'c12',  name: 'Cereal',             categoryId: 'carbs',      unit: 'box' },
  { id: 'c13',  name: 'Granola',            categoryId: 'carbs',      unit: 'bag' },
  { id: 'c14',  name: 'Crackers',           categoryId: 'carbs',      unit: 'box' },
  { id: 'c15',  name: 'Potato Chips',       categoryId: 'carbs',      unit: 'bag' },
  // ── Household ────────────────────────────────
  { id: 'h01',  name: 'Paper Towels',       categoryId: 'household',  unit: 'pack' },
  { id: 'h02',  name: 'Toilet Paper',       categoryId: 'household',  unit: 'pack' },
  { id: 'h03',  name: 'Dish Soap',          categoryId: 'household',  unit: 'bottle' },
  { id: 'h04',  name: 'Laundry Detergent',  categoryId: 'household',  unit: 'bottle' },
  { id: 'h05',  name: 'Trash Bags',         categoryId: 'household',  unit: 'box' },
  { id: 'h06',  name: 'Sponges',            categoryId: 'household',  unit: 'pack' },
  { id: 'h07',  name: 'All-Purpose Cleaner',categoryId: 'household',  unit: 'bottle' },
  { id: 'h08',  name: 'Glass Cleaner',      categoryId: 'household',  unit: 'bottle' },
  { id: 'h09',  name: 'Bleach',             categoryId: 'household',  unit: 'bottle' },
  { id: 'h10',  name: 'Dryer Sheets',       categoryId: 'household',  unit: 'box' },
  { id: 'h11',  name: 'Dishwasher Pods',    categoryId: 'household',  unit: 'pack' },
  { id: 'h12',  name: 'Aluminum Foil',      categoryId: 'household',  unit: 'box' },
  { id: 'h13',  name: 'Plastic Wrap',       categoryId: 'household',  unit: 'box' },
  { id: 'h14',  name: 'Zip-lock Bags',      categoryId: 'household',  unit: 'box' },
  { id: 'h15',  name: 'Candles',            categoryId: 'household',  unit: '' },
];

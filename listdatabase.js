/* ─────────────────────────────────────────────
   Grocery Confidential — listdatabase.js
   Edit this file to manage your categories and items.
   Do not touch app.js.
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
  { id: 'pr01', name: 'Chicken Breast',  categoryId: 'protein',    unit: 'kg' },
  { id: 'pr02', name: 'Ground Beef',     categoryId: 'protein',    unit: 'kg' },
  { id: 'pr03', name: 'Salmon Fillet',   categoryId: 'protein',    unit: 'fillet' },
  // ── Dairy ────────────────────────────────────
  { id: 'd01',  name: 'Whole Milk',      categoryId: 'dairy',      unit: 'jug' },
  { id: 'd02',  name: 'Butter',          categoryId: 'dairy',      unit: 'pack' },
  { id: 'd03',  name: 'Cheddar Cheese',  categoryId: 'dairy',      unit: 'block' },
  // ── Vegetables ───────────────────────────────
  { id: 'v01',  name: 'Broccoli',        categoryId: 'vegetables', unit: 'head' },
  { id: 'v02',  name: 'Spinach',         categoryId: 'vegetables', unit: 'bag' },
  { id: 'v03',  name: 'Bell Peppers',    categoryId: 'vegetables', unit: '' },
  // ── Carbs ────────────────────────────────────
  { id: 'c01',  name: 'White Rice',      categoryId: 'carbs',      unit: 'bag' },
  { id: 'c02',  name: 'Pasta',           categoryId: 'carbs',      unit: 'pack' },
  { id: 'c03',  name: 'Sourdough',       categoryId: 'carbs',      unit: 'loaf' },
  // ── Household ────────────────────────────────
  { id: 'h01',  name: 'Paper Towels',    categoryId: 'household',  unit: 'pack' },
  { id: 'h02',  name: 'Dish Soap',       categoryId: 'household',  unit: 'bottle' },
  { id: 'h03',  name: 'Trash Bags',      categoryId: 'household',  unit: 'box' },
];

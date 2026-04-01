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
  { id: 'vegetables',   name: 'Vegetables',          emoji: '🥦' },
  { id: 'protein',      name: 'Protein',              emoji: '🥩' },
  { id: 'carbs',        name: 'Carbs',                emoji: '🍞' },
  { id: 'dairy',        name: 'Dairy',                emoji: '🥛' },
  { id: 'fruits',       name: 'Fruits',               emoji: '🍎' },
  { id: 'nuts_seeds',   name: 'Nuts & Seeds',          emoji: '🥜' },
  { id: 'oils',         name: 'Oils',                 emoji: '🫒' },
  { id: 'condiments',   name: 'Condiments & Sauces',  emoji: '🫙' },
  { id: 'herbs',        name: 'Herbs & Powders',       emoji: '🌿' },
  { id: 'baking',       name: 'Baking',               emoji: '🧁' },
  { id: 'cold_cuts',    name: 'Cold Cuts',             emoji: '🥓' },
  { id: 'drinks',       name: 'Drinks',               emoji: '🥤' },
  { id: 'cat_goods',    name: 'Cat Goods',             emoji: '🐱' },
  { id: 'canned_goods', name: 'Canned Goods',          emoji: '🥫' },
  { id: 'household',    name: 'Household',             emoji: '🧹' },
  { id: 'supplements',  name: 'Supplements',           emoji: '💊' },
  { id: 'other',        name: 'Other',                emoji: '📦' },
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
  // Add your items here
];

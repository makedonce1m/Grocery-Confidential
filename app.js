/* ─────────────────────────────────────────────
   Grocery Confidential — app.js
   ───────────────────────────────────────────── */

// ══════════════════════════════════════════════
//  DEFAULT DATA
// ══════════════════════════════════════════════

const DEFAULT_CATEGORIES = [
  { id: 'produce',    name: 'Produce',          emoji: '🥦' },
  { id: 'dairy',      name: 'Dairy & Eggs',      emoji: '🥛' },
  { id: 'meat',       name: 'Meat & Seafood',    emoji: '🥩' },
  { id: 'bakery',     name: 'Bakery',            emoji: '🍞' },
  { id: 'pantry',     name: 'Pantry',            emoji: '🫙' },
  { id: 'frozen',     name: 'Frozen',            emoji: '🧊' },
  { id: 'beverages',  name: 'Beverages',         emoji: '🥤' },
  { id: 'snacks',     name: 'Snacks',            emoji: '🍿' },
  { id: 'condiments', name: 'Condiments',        emoji: '🫒' },
  { id: 'household',  name: 'Household',         emoji: '🧹' },
  { id: 'personal',   name: 'Personal Care',     emoji: '🧴' },
];

const DEFAULT_ITEMS = [
  // ── Produce ──────────────────────────────────
  { id: 'p01',  name: 'Apples',           categoryId: 'produce',    unit: '' },
  { id: 'p02',  name: 'Bananas',          categoryId: 'produce',    unit: 'bunch' },
  { id: 'p03',  name: 'Oranges',          categoryId: 'produce',    unit: '' },
  { id: 'p04',  name: 'Lemons',           categoryId: 'produce',    unit: '' },
  { id: 'p05',  name: 'Limes',            categoryId: 'produce',    unit: '' },
  { id: 'p06',  name: 'Strawberries',     categoryId: 'produce',    unit: 'punnet' },
  { id: 'p07',  name: 'Blueberries',      categoryId: 'produce',    unit: 'punnet' },
  { id: 'p08',  name: 'Grapes',           categoryId: 'produce',    unit: 'bag' },
  { id: 'p09',  name: 'Avocados',         categoryId: 'produce',    unit: '' },
  { id: 'p10',  name: 'Tomatoes',         categoryId: 'produce',    unit: '' },
  { id: 'p11',  name: 'Lettuce',          categoryId: 'produce',    unit: 'head' },
  { id: 'p12',  name: 'Spinach',          categoryId: 'produce',    unit: 'bag' },
  { id: 'p13',  name: 'Kale',             categoryId: 'produce',    unit: 'bunch' },
  { id: 'p14',  name: 'Broccoli',         categoryId: 'produce',    unit: 'head' },
  { id: 'p15',  name: 'Carrots',          categoryId: 'produce',    unit: 'bag' },
  { id: 'p16',  name: 'Celery',           categoryId: 'produce',    unit: 'bunch' },
  { id: 'p17',  name: 'Cucumber',         categoryId: 'produce',    unit: '' },
  { id: 'p18',  name: 'Bell Peppers',     categoryId: 'produce',    unit: '' },
  { id: 'p19',  name: 'Onions',           categoryId: 'produce',    unit: 'bag' },
  { id: 'p20',  name: 'Garlic',           categoryId: 'produce',    unit: 'bulb' },
  { id: 'p21',  name: 'Potatoes',         categoryId: 'produce',    unit: 'bag' },
  { id: 'p22',  name: 'Sweet Potatoes',   categoryId: 'produce',    unit: '' },
  { id: 'p23',  name: 'Mushrooms',        categoryId: 'produce',    unit: 'pack' },
  { id: 'p24',  name: 'Zucchini',         categoryId: 'produce',    unit: '' },
  { id: 'p25',  name: 'Corn',             categoryId: 'produce',    unit: '' },
  // ── Dairy & Eggs ─────────────────────────────
  { id: 'd01',  name: 'Whole Milk',       categoryId: 'dairy',      unit: 'jug' },
  { id: 'd02',  name: 'Skim Milk',        categoryId: 'dairy',      unit: 'jug' },
  { id: 'd03',  name: 'Butter',           categoryId: 'dairy',      unit: 'pack' },
  { id: 'd04',  name: 'Eggs',             categoryId: 'dairy',      unit: 'dozen' },
  { id: 'd05',  name: 'Cheddar Cheese',   categoryId: 'dairy',      unit: 'block' },
  { id: 'd06',  name: 'Mozzarella',       categoryId: 'dairy',      unit: 'pack' },
  { id: 'd07',  name: 'Parmesan',         categoryId: 'dairy',      unit: 'block' },
  { id: 'd08',  name: 'Cream Cheese',     categoryId: 'dairy',      unit: 'tub' },
  { id: 'd09',  name: 'Sour Cream',       categoryId: 'dairy',      unit: 'tub' },
  { id: 'd10',  name: 'Heavy Cream',      categoryId: 'dairy',      unit: 'carton' },
  { id: 'd11',  name: 'Greek Yogurt',     categoryId: 'dairy',      unit: 'tub' },
  { id: 'd12',  name: 'Yogurt',           categoryId: 'dairy',      unit: 'tub' },
  { id: 'd13',  name: 'Cottage Cheese',   categoryId: 'dairy',      unit: 'tub' },
  { id: 'd14',  name: 'Half & Half',      categoryId: 'dairy',      unit: 'carton' },
  { id: 'd15',  name: 'Almond Milk',      categoryId: 'dairy',      unit: 'carton' },
  // ── Meat & Seafood ───────────────────────────
  { id: 'm01',  name: 'Chicken Breast',   categoryId: 'meat',       unit: 'kg' },
  { id: 'm02',  name: 'Chicken Thighs',   categoryId: 'meat',       unit: 'kg' },
  { id: 'm03',  name: 'Ground Beef',      categoryId: 'meat',       unit: 'kg' },
  { id: 'm04',  name: 'Beef Steak',       categoryId: 'meat',       unit: 'kg' },
  { id: 'm05',  name: 'Pork Chops',       categoryId: 'meat',       unit: 'kg' },
  { id: 'm06',  name: 'Bacon',            categoryId: 'meat',       unit: 'pack' },
  { id: 'm07',  name: 'Ham',              categoryId: 'meat',       unit: 'pack' },
  { id: 'm08',  name: 'Sausage',          categoryId: 'meat',       unit: 'pack' },
  { id: 'm09',  name: 'Salmon Fillet',    categoryId: 'meat',       unit: 'fillet' },
  { id: 'm10',  name: 'Canned Tuna',      categoryId: 'meat',       unit: 'can' },
  { id: 'm11',  name: 'Shrimp',           categoryId: 'meat',       unit: 'kg' },
  { id: 'm12',  name: 'Ground Turkey',    categoryId: 'meat',       unit: 'kg' },
  { id: 'm13',  name: 'Deli Turkey',      categoryId: 'meat',       unit: 'pack' },
  { id: 'm14',  name: 'Hot Dogs',         categoryId: 'meat',       unit: 'pack' },
  { id: 'm15',  name: 'Lamb Chops',       categoryId: 'meat',       unit: 'kg' },
  // ── Bakery ───────────────────────────────────
  { id: 'b01',  name: 'White Bread',      categoryId: 'bakery',     unit: 'loaf' },
  { id: 'b02',  name: 'Whole Wheat Bread',categoryId: 'bakery',     unit: 'loaf' },
  { id: 'b03',  name: 'Sourdough',        categoryId: 'bakery',     unit: 'loaf' },
  { id: 'b04',  name: 'Bagels',           categoryId: 'bakery',     unit: 'pack' },
  { id: 'b05',  name: 'English Muffins',  categoryId: 'bakery',     unit: 'pack' },
  { id: 'b06',  name: 'Flour Tortillas',  categoryId: 'bakery',     unit: 'pack' },
  { id: 'b07',  name: 'Pita Bread',       categoryId: 'bakery',     unit: 'pack' },
  { id: 'b08',  name: 'Dinner Rolls',     categoryId: 'bakery',     unit: 'pack' },
  { id: 'b09',  name: 'Croissants',       categoryId: 'bakery',     unit: 'pack' },
  { id: 'b10',  name: 'Hamburger Buns',   categoryId: 'bakery',     unit: 'pack' },
  // ── Pantry ───────────────────────────────────
  { id: 'pa01', name: 'Pasta',            categoryId: 'pantry',     unit: 'pack' },
  { id: 'pa02', name: 'White Rice',       categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa03', name: 'Brown Rice',       categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa04', name: 'Quinoa',           categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa05', name: 'Oatmeal',          categoryId: 'pantry',     unit: 'box' },
  { id: 'pa06', name: 'All-Purpose Flour',categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa07', name: 'Sugar',            categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa08', name: 'Brown Sugar',      categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa09', name: 'Salt',             categoryId: 'pantry',     unit: 'box' },
  { id: 'pa10', name: 'Black Pepper',     categoryId: 'pantry',     unit: 'jar' },
  { id: 'pa11', name: 'Olive Oil',        categoryId: 'pantry',     unit: 'bottle' },
  { id: 'pa12', name: 'Vegetable Oil',    categoryId: 'pantry',     unit: 'bottle' },
  { id: 'pa13', name: 'Canned Tomatoes',  categoryId: 'pantry',     unit: 'can' },
  { id: 'pa14', name: 'Canned Beans',     categoryId: 'pantry',     unit: 'can' },
  { id: 'pa15', name: 'Chicken Broth',    categoryId: 'pantry',     unit: 'carton' },
  { id: 'pa16', name: 'Baking Soda',      categoryId: 'pantry',     unit: 'box' },
  { id: 'pa17', name: 'Baking Powder',    categoryId: 'pantry',     unit: 'tin' },
  { id: 'pa18', name: 'Cereal',           categoryId: 'pantry',     unit: 'box' },
  { id: 'pa19', name: 'Granola',          categoryId: 'pantry',     unit: 'bag' },
  { id: 'pa20', name: 'Canned Soup',      categoryId: 'pantry',     unit: 'can' },
  // ── Frozen ───────────────────────────────────
  { id: 'f01',  name: 'Frozen Pizza',     categoryId: 'frozen',     unit: '' },
  { id: 'f02',  name: 'Ice Cream',        categoryId: 'frozen',     unit: 'tub' },
  { id: 'f03',  name: 'Frozen Vegetables',categoryId: 'frozen',     unit: 'bag' },
  { id: 'f04',  name: 'Frozen Fruit',     categoryId: 'frozen',     unit: 'bag' },
  { id: 'f05',  name: 'Frozen Waffles',   categoryId: 'frozen',     unit: 'box' },
  { id: 'f06',  name: 'Frozen Burritos',  categoryId: 'frozen',     unit: 'box' },
  { id: 'f07',  name: 'Fish Sticks',      categoryId: 'frozen',     unit: 'box' },
  { id: 'f08',  name: 'Chicken Nuggets',  categoryId: 'frozen',     unit: 'bag' },
  { id: 'f09',  name: 'Edamame',          categoryId: 'frozen',     unit: 'bag' },
  { id: 'f10',  name: 'Frozen Meals',     categoryId: 'frozen',     unit: '' },
  // ── Beverages ────────────────────────────────
  { id: 'bv01', name: 'Sparkling Water',  categoryId: 'beverages',  unit: 'pack' },
  { id: 'bv02', name: 'Orange Juice',     categoryId: 'beverages',  unit: 'carton' },
  { id: 'bv03', name: 'Apple Juice',      categoryId: 'beverages',  unit: 'carton' },
  { id: 'bv04', name: 'Ground Coffee',    categoryId: 'beverages',  unit: 'bag' },
  { id: 'bv05', name: 'Coffee Beans',     categoryId: 'beverages',  unit: 'bag' },
  { id: 'bv06', name: 'Tea Bags',         categoryId: 'beverages',  unit: 'box' },
  { id: 'bv07', name: 'Cola',             categoryId: 'beverages',  unit: 'pack' },
  { id: 'bv08', name: 'Beer',             categoryId: 'beverages',  unit: 'pack' },
  { id: 'bv09', name: 'Wine',             categoryId: 'beverages',  unit: 'bottle' },
  { id: 'bv10', name: 'Sports Drink',     categoryId: 'beverages',  unit: 'bottle' },
  { id: 'bv11', name: 'Lemonade',         categoryId: 'beverages',  unit: 'bottle' },
  { id: 'bv12', name: 'Bottled Water',    categoryId: 'beverages',  unit: 'pack' },
  // ── Snacks ───────────────────────────────────
  { id: 'sn01', name: 'Potato Chips',     categoryId: 'snacks',     unit: 'bag' },
  { id: 'sn02', name: 'Crackers',         categoryId: 'snacks',     unit: 'box' },
  { id: 'sn03', name: 'Microwave Popcorn',categoryId: 'snacks',     unit: 'pack' },
  { id: 'sn04', name: 'Mixed Nuts',       categoryId: 'snacks',     unit: 'bag' },
  { id: 'sn05', name: 'Trail Mix',        categoryId: 'snacks',     unit: 'bag' },
  { id: 'sn06', name: 'Granola Bars',     categoryId: 'snacks',     unit: 'box' },
  { id: 'sn07', name: 'Cookies',          categoryId: 'snacks',     unit: 'pack' },
  { id: 'sn08', name: 'Chocolate Bar',    categoryId: 'snacks',     unit: '' },
  { id: 'sn09', name: 'Pretzels',         categoryId: 'snacks',     unit: 'bag' },
  { id: 'sn10', name: 'Rice Cakes',       categoryId: 'snacks',     unit: 'pack' },
  // ── Condiments ───────────────────────────────
  { id: 'co01', name: 'Ketchup',          categoryId: 'condiments', unit: 'bottle' },
  { id: 'co02', name: 'Mustard',          categoryId: 'condiments', unit: 'bottle' },
  { id: 'co03', name: 'Mayonnaise',       categoryId: 'condiments', unit: 'jar' },
  { id: 'co04', name: 'Ranch Dressing',   categoryId: 'condiments', unit: 'bottle' },
  { id: 'co05', name: 'Hot Sauce',        categoryId: 'condiments', unit: 'bottle' },
  { id: 'co06', name: 'BBQ Sauce',        categoryId: 'condiments', unit: 'bottle' },
  { id: 'co07', name: 'Soy Sauce',        categoryId: 'condiments', unit: 'bottle' },
  { id: 'co08', name: 'Honey',            categoryId: 'condiments', unit: 'jar' },
  { id: 'co09', name: 'Jam',              categoryId: 'condiments', unit: 'jar' },
  { id: 'co10', name: 'Peanut Butter',    categoryId: 'condiments', unit: 'jar' },
  { id: 'co11', name: 'Maple Syrup',      categoryId: 'condiments', unit: 'bottle' },
  { id: 'co12', name: 'Salsa',            categoryId: 'condiments', unit: 'jar' },
  { id: 'co13', name: 'Hummus',           categoryId: 'condiments', unit: 'tub' },
  { id: 'co14', name: 'Guacamole',        categoryId: 'condiments', unit: 'tub' },
  // ── Household ────────────────────────────────
  { id: 'h01',  name: 'Paper Towels',     categoryId: 'household',  unit: 'pack' },
  { id: 'h02',  name: 'Toilet Paper',     categoryId: 'household',  unit: 'pack' },
  { id: 'h03',  name: 'Dish Soap',        categoryId: 'household',  unit: 'bottle' },
  { id: 'h04',  name: 'Laundry Detergent',categoryId: 'household',  unit: 'bottle' },
  { id: 'h05',  name: 'Trash Bags',       categoryId: 'household',  unit: 'box' },
  { id: 'h06',  name: 'Sponges',          categoryId: 'household',  unit: 'pack' },
  { id: 'h07',  name: 'All-Purpose Cleaner',categoryId:'household', unit: 'bottle' },
  { id: 'h08',  name: 'Glass Cleaner',    categoryId: 'household',  unit: 'bottle' },
  { id: 'h09',  name: 'Bleach',           categoryId: 'household',  unit: 'bottle' },
  { id: 'h10',  name: 'Dryer Sheets',     categoryId: 'household',  unit: 'box' },
  { id: 'h11',  name: 'Dishwasher Pods',  categoryId: 'household',  unit: 'pack' },
  { id: 'h12',  name: 'Aluminum Foil',    categoryId: 'household',  unit: 'box' },
  { id: 'h13',  name: 'Plastic Wrap',     categoryId: 'household',  unit: 'box' },
  { id: 'h14',  name: 'Zip-lock Bags',    categoryId: 'household',  unit: 'box' },
  { id: 'h15',  name: 'Candles',          categoryId: 'household',  unit: '' },
  // ── Personal Care ────────────────────────────
  { id: 'pc01', name: 'Shampoo',          categoryId: 'personal',   unit: 'bottle' },
  { id: 'pc02', name: 'Conditioner',      categoryId: 'personal',   unit: 'bottle' },
  { id: 'pc03', name: 'Body Wash',        categoryId: 'personal',   unit: 'bottle' },
  { id: 'pc04', name: 'Bar Soap',         categoryId: 'personal',   unit: 'pack' },
  { id: 'pc05', name: 'Toothpaste',       categoryId: 'personal',   unit: 'tube' },
  { id: 'pc06', name: 'Toothbrush',       categoryId: 'personal',   unit: '' },
  { id: 'pc07', name: 'Deodorant',        categoryId: 'personal',   unit: '' },
  { id: 'pc08', name: 'Razor',            categoryId: 'personal',   unit: '' },
  { id: 'pc09', name: 'Shaving Cream',    categoryId: 'personal',   unit: 'can' },
  { id: 'pc10', name: 'Lotion',           categoryId: 'personal',   unit: 'bottle' },
  { id: 'pc11', name: 'Sunscreen',        categoryId: 'personal',   unit: 'bottle' },
  { id: 'pc12', name: 'Bandages',         categoryId: 'personal',   unit: 'box' },
  { id: 'pc13', name: 'Cotton Balls',     categoryId: 'personal',   unit: 'bag' },
  { id: 'pc14', name: 'Floss',            categoryId: 'personal',   unit: '' },
  { id: 'pc15', name: 'Mouthwash',        categoryId: 'personal',   unit: 'bottle' },
];

// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════

const state = {
  view:           'items',
  categoryFilter: 'all',
  searchQuery:    '',
  categories:     [],
  items:          [],
  groceryList:    [],
};

// ══════════════════════════════════════════════
//  STORAGE
// ══════════════════════════════════════════════

const STORE_KEY = 'grocery_confidential_v1';

function saveData() {
  const payload = {
    customCategories: state.categories.filter(c => c.custom),
    customItems:      state.items.filter(i => i.custom),
    groceryList:      state.groceryList,
  };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(payload)); }
  catch (e) { console.warn('Could not save:', e); }
}

function loadData() {
  state.categories = DEFAULT_CATEGORIES.map(c => ({ ...c }));
  state.items      = DEFAULT_ITEMS.map(i => ({ ...i }));
  state.groceryList = [];

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    (data.customCategories || []).forEach(cat => {
      if (!state.categories.find(c => c.id === cat.id))
        state.categories.push(cat);
    });

    (data.customItems || []).forEach(item => {
      if (!state.items.find(i => i.id === item.id))
        state.items.push(item);
    });

    if (Array.isArray(data.groceryList))
      state.groceryList = data.groceryList;

  } catch (e) {
    console.warn('Could not load saved data:', e);
  }
}

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

function catById(id)  { return state.categories.find(c => c.id === id); }
function itemById(id) { return state.items.find(i => i.id === id); }
function groceryByItemId(itemId) { return state.groceryList.find(g => g.itemId === itemId); }
function groceryById(id)         { return state.groceryList.find(g => g.id === id); }

function filteredItems() {
  let list = state.items;
  if (state.categoryFilter !== 'all')
    list = list.filter(i => i.categoryId === state.categoryFilter);
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(q));
  }
  return list;
}

function uncheckedCount() { return state.groceryList.filter(g => !g.checked).length; }

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }

// ══════════════════════════════════════════════
//  ACTIONS
// ══════════════════════════════════════════════

function addToGrocery(itemId) {
  const existing = groceryByItemId(itemId);
  if (existing) {
    existing.quantity += 1;
    showToast(`Quantity → ${existing.quantity}`);
  } else {
    const item = itemById(itemId);
    if (!item) return;
    const cat = catById(item.categoryId);
    state.groceryList.push({
      id:          `g_${uid()}`,
      itemId:      item.id,
      itemName:    item.name,
      categoryId:  item.categoryId,
      categoryName:cat ? cat.name  : '',
      categoryEmoji:cat ? cat.emoji : '📦',
      quantity:    1,
      unit:        item.unit || '',
      checked:     false,
      addedAt:     Date.now(),
    });
    showToast(`${item.name} added to list`);
  }
  saveData();
  updateBadge();
  renderItems(); // refresh button state
}

function removeFromGrocery(groceryId) {
  state.groceryList = state.groceryList.filter(g => g.id !== groceryId);
  saveData();
  updateBadge();
  renderGrocery();
  renderItems();
}

function adjustQty(groceryId, delta) {
  const g = groceryById(groceryId);
  if (!g) return;
  g.quantity = Math.max(1, g.quantity + delta);
  saveData();
  // only re-render qty value to avoid full repaint jank
  const card = document.querySelector(`.grocery-item[data-gid="${groceryId}"]`);
  if (card) card.querySelector('.qty-val').textContent = g.quantity;
}

function toggleChecked(groceryId) {
  const g = groceryById(groceryId);
  if (!g) return;
  g.checked = !g.checked;
  saveData();
  updateBadge();
  renderGrocery();
}

function clearCompleted() {
  const n = state.groceryList.filter(g => g.checked).length;
  if (!n) { showToast('No completed items'); return; }
  state.groceryList = state.groceryList.filter(g => !g.checked);
  saveData();
  updateBadge();
  renderGrocery();
  renderItems();
  showToast(`Cleared ${n} item${n > 1 ? 's' : ''}`);
}

function addCategory(emoji, name) {
  const id  = `cat_${uid()}`;
  const cat = { id, name: name.trim(), emoji: emoji || '📦', custom: true };
  state.categories.push(cat);
  saveData();
  renderPills();
  syncCategorySelect();
  return cat;
}

function addItem(name, categoryId, unit) {
  const item = {
    id:         `item_${uid()}`,
    name:       name.trim(),
    categoryId,
    unit:       unit.trim(),
    custom:     true,
  };
  state.items.push(item);
  saveData();
  renderItems();
  return item;
}

// ══════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════

function renderPills() {
  const wrap = document.getElementById('category-pills');
  let html = pill('all', 'All', '', state.categoryFilter === 'all');

  state.categories.forEach(c =>
    html += pill(c.id, c.name, c.emoji, state.categoryFilter === c.id)
  );

  html += `<button class="pill pill-add" id="pill-add-cat">+ Category</button>`;
  wrap.innerHTML = html;

  wrap.querySelectorAll('.pill[data-cat]').forEach(btn =>
    btn.addEventListener('click', () => {
      state.categoryFilter = btn.dataset.cat;
      renderPills();
      renderItems();
    })
  );

  document.getElementById('pill-add-cat').addEventListener('click', () =>
    openModal('modal-add-category')
  );
}

function pill(id, name, emoji, active) {
  return `<button class="pill${active ? ' active' : ''}" data-cat="${esc(id)}">
    ${emoji ? `<span>${emoji}</span>` : ''}${esc(name)}
  </button>`;
}

function renderItems() {
  const list  = document.getElementById('items-list');
  const empty = document.getElementById('items-empty');
  const items = filteredItems();

  if (!items.length) {
    list.innerHTML = '';
    list.hidden  = true;
    empty.hidden = false;
    return;
  }

  list.hidden  = false;
  empty.hidden = true;

  const showGroups = state.categoryFilter === 'all' && !state.searchQuery;
  let html = '';

  if (showGroups) {
    // Group by category
    const grouped = {};
    items.forEach(item => {
      (grouped[item.categoryId] = grouped[item.categoryId] || []).push(item);
    });
    state.categories.forEach(cat => {
      if (!grouped[cat.id]?.length) return;
      html += `<div class="section-hdr">${cat.emoji} ${esc(cat.name)}</div>`;
      grouped[cat.id].forEach(item => html += itemCard(item, cat));
    });
  } else {
    items.forEach(item => html += itemCard(item, catById(item.categoryId)));
  }

  list.innerHTML = html;

  list.querySelectorAll('.add-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToGrocery(btn.dataset.itemId);
    })
  );
}

function itemCard(item, cat) {
  const inList = !!groceryByItemId(item.id);
  const emoji  = cat ? cat.emoji : '📦';
  const tag    = cat ? cat.name  : '';
  return `<div class="item-card">
    <span class="item-emoji">${emoji}</span>
    <div class="item-info">
      <div class="item-name">${esc(item.name)}</div>
      <div class="item-meta">
        <span class="item-tag">${esc(tag)}</span>
        ${item.unit ? `<span class="item-unit">${esc(item.unit)}</span>` : ''}
      </div>
    </div>
    <button class="add-btn${inList ? ' in-list' : ''}" data-item-id="${esc(item.id)}" aria-label="Add to grocery list">
      ${inList ? '✓' : '+'}
    </button>
  </div>`;
}

function renderGrocery() {
  const list  = document.getElementById('grocery-list');
  const empty = document.getElementById('grocery-empty');

  if (!state.groceryList.length) {
    list.innerHTML = '';
    list.hidden  = true;
    empty.hidden = false;
    return;
  }

  list.hidden  = false;
  empty.hidden = true;

  // unchecked first, then checked; within each group sort by addedAt
  const sorted = [...state.groceryList].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    return a.addedAt - b.addedAt;
  });

  list.innerHTML = sorted.map(g => `
    <div class="grocery-item${g.checked ? ' checked' : ''}" data-gid="${esc(g.id)}">
      <div class="g-check${g.checked ? ' checked' : ''}" data-action="toggle" data-gid="${esc(g.id)}">
        ${g.checked ? '✓' : ''}
      </div>
      <div class="g-info">
        <div class="g-name">${esc(g.itemName)}</div>
        <span class="g-cat">${g.categoryEmoji} ${esc(g.categoryName)}</span>
      </div>
      <div class="qty">
        <button class="qty-btn" data-action="minus" data-gid="${esc(g.id)}" aria-label="Less">−</button>
        <span class="qty-val">${g.quantity}</span>
        <button class="qty-btn" data-action="plus"  data-gid="${esc(g.id)}" aria-label="More">+</button>
      </div>
      <button class="g-del" data-action="delete" data-gid="${esc(g.id)}" aria-label="Remove">✕</button>
    </div>`).join('');

  // Single delegated listener
  list.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
      const { action, gid } = el.dataset;
      if (action === 'toggle') toggleChecked(gid);
      if (action === 'minus')  adjustQty(gid, -1);
      if (action === 'plus')   adjustQty(gid, +1);
      if (action === 'delete') removeFromGrocery(gid);
    });
  });
}

function updateBadge() {
  const badge = document.getElementById('grocery-badge');
  const n = uncheckedCount();
  badge.textContent = n;
  badge.hidden = n === 0;
}

// ══════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════

function switchView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`nav-${view}`).classList.add('active');
  if (view === 'grocery') renderGrocery();
}

// ══════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════

function openModal(id) {
  const el = document.getElementById(id);
  el.hidden = false;
  setTimeout(() => {
    const first = el.querySelector('input, select');
    if (first) first.focus();
  }, 310);
}

function closeModal(id) {
  document.getElementById(id).hidden = true;
}

function syncCategorySelect() {
  const sel = document.getElementById('item-category');
  sel.innerHTML = state.categories
    .map(c => `<option value="${esc(c.id)}">${c.emoji} ${esc(c.name)}</option>`)
    .join('');
  if (state.categoryFilter !== 'all')
    sel.value = state.categoryFilter;
}

// ══════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════

let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════

function init() {
  loadData();

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Initial render
  renderPills();
  renderItems();
  updateBadge();

  // ── Nav ──────────────────────────────────────
  document.querySelectorAll('.nav-btn[data-view]').forEach(btn =>
    btn.addEventListener('click', () => switchView(btn.dataset.view))
  );

  // ── Search ───────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  searchInput.addEventListener('input', () => {
    state.searchQuery = searchInput.value;
    searchClear.classList.toggle('visible', searchInput.value.length > 0);
    renderItems();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    searchClear.classList.remove('visible');
    renderItems();
    searchInput.focus();
  });

  // ── FAB ──────────────────────────────────────
  document.getElementById('fab-add-item').addEventListener('click', () => {
    syncCategorySelect();
    openModal('modal-add-item');
  });

  // ── Empty state buttons ───────────────────────
  document.getElementById('empty-add-btn').addEventListener('click', () => {
    syncCategorySelect();
    openModal('modal-add-item');
  });
  document.getElementById('go-browse-btn').addEventListener('click', () => switchView('items'));

  // ── Clear completed ───────────────────────────
  document.getElementById('clear-completed-btn').addEventListener('click', clearCompleted);

  // ── Modal: close buttons (shared attr) ────────
  document.querySelectorAll('[data-modal]').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.dataset.modal))
  );

  // Close modal on overlay click
  ['modal-add-item', 'modal-add-category'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      if (e.target.id === id) closeModal(id);
    });
  });

  // ── Confirm: Add Item ─────────────────────────
  document.getElementById('confirm-add-item').addEventListener('click', () => {
    const nameEl = document.getElementById('item-name');
    const catEl  = document.getElementById('item-category');
    const unitEl = document.getElementById('item-unit');
    const name   = nameEl.value.trim();

    if (!name) {
      nameEl.classList.add('error');
      nameEl.focus();
      showToast('Please enter an item name');
      nameEl.addEventListener('input', () => nameEl.classList.remove('error'), { once: true });
      return;
    }

    const item = addItem(name, catEl.value, unitEl.value);
    closeModal('modal-add-item');
    nameEl.value = '';
    unitEl.value = '';

    // Jump to that category
    state.categoryFilter = item.categoryId;
    renderPills();
    renderItems();

    showToast(`${item.name} added`);
  });

  // ── Confirm: Add Category ─────────────────────
  document.getElementById('confirm-add-category').addEventListener('click', () => {
    const emojiEl = document.getElementById('cat-emoji');
    const nameEl  = document.getElementById('cat-name');
    const name    = nameEl.value.trim();

    if (!name) {
      nameEl.classList.add('error');
      nameEl.focus();
      showToast('Please enter a category name');
      nameEl.addEventListener('input', () => nameEl.classList.remove('error'), { once: true });
      return;
    }

    const cat = addCategory(emojiEl.value.trim(), name);
    closeModal('modal-add-category');
    emojiEl.value = '';
    nameEl.value  = '';

    state.categoryFilter = cat.id;
    renderPills();
    renderItems();

    showToast(`${cat.name} added`);
  });

  // ── Enter key shortcuts ───────────────────────
  document.getElementById('item-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('confirm-add-item').click();
  });
  document.getElementById('cat-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('confirm-add-category').click();
  });
}

document.addEventListener('DOMContentLoaded', init);

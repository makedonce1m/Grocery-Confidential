/* ─────────────────────────────────────────────
   Grocery Confidential — app.js
   ───────────────────────────────────────────── */

// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════

const state = {
  view:               'recipes',
  categoryFilter:     'all',
  searchQuery:        '',
  editMode:           false,
  categories:         [],
  items:              [],
  groceryList:        [],
  deletedItemIds:     [],
  deletedCategoryIds: [],
  // Recipes
  recipes:            [],
  recipeSort:         'favourites', // favourites | alpha | recent
  activeRecipeId:     null,
  editingRecipeId:    null,
  // Add-to-grocery sheet
  atgRecipeId:        null,
  atgServings:        1,
  atgChecked:         new Set(),
};

// ══════════════════════════════════════════════
//  STORAGE
// ══════════════════════════════════════════════

const STORE_KEY = 'grocery_confidential_v1';

function saveData() {
  const payload = {
    customCategories:   state.categories.filter(c => c.custom),
    customItems:        state.items.filter(i => i.custom),
    groceryList:        state.groceryList,
    deletedItemIds:     state.deletedItemIds,
    deletedCategoryIds: state.deletedCategoryIds,
    recipes:            state.recipes,
  };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(payload)); }
  catch (e) { console.warn('Could not save:', e); }
}

function loadData() {
  state.deletedItemIds     = [];
  state.deletedCategoryIds = [];

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      state.deletedItemIds     = data.deletedItemIds     || [];
      state.deletedCategoryIds = data.deletedCategoryIds || [];
    }
  } catch (e) {}

  const delItems = new Set(state.deletedItemIds);
  const delCats  = new Set(state.deletedCategoryIds);

  state.categories  = DEFAULT_CATEGORIES.filter(c => !delCats.has(c.id)).map(c => ({ ...c }));
  state.items       = DEFAULT_ITEMS.filter(i => !delItems.has(i.id)).map(i => ({ ...i }));
  state.groceryList = [];
  state.recipes     = SEED_RECIPES.map(r => ({ ...r })); // overwritten below if localStorage has recipes

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

    if (Array.isArray(data.recipes)) {
      state.recipes = data.recipes;
      // Merge in any new seed recipes not yet in localStorage
      SEED_RECIPES.forEach(seed => {
        if (!state.recipes.find(r => r.id === seed.id))
          state.recipes.push({ ...seed });
      });
    } else {
      state.recipes = SEED_RECIPES.map(r => ({ ...r }));
    }

  } catch (e) {
    console.warn('Could not load saved data:', e);
  }
}

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

function catById(id)      { return state.categories.find(c => c.id === id); }
function itemById(id)     { return state.items.find(i => i.id === id); }
function recipeById(id)   { return state.recipes.find(r => r.id === id); }
function groceryByItemId(itemId) { return state.groceryList.find(g => g.itemId === itemId); }
function groceryById(id)         { return state.groceryList.find(g => g.id === id); }

function sortedRecipes() {
  const list = [...state.recipes];
  if (state.recipeSort === 'alpha')
    return list.sort((a, b) => a.name.localeCompare(b.name));
  if (state.recipeSort === 'recent')
    return list.sort((a, b) => b.createdAt - a.createdAt);
  // favourites first, then by recency
  return list.sort((a, b) => {
    if (a.favourite !== b.favourite) return a.favourite ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
}

function fmtTime(min) {
  if (!min || min <= 0) return null;
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function filteredItems() {
  let list = state.items;
  if (state.searchQuery) {
    // Search always spans all categories
    const q = state.searchQuery.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(q));
  } else if (state.categoryFilter !== 'all') {
    list = list.filter(i => i.categoryId === state.categoryFilter);
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
    if (existing.checked) {
      // Remove the checked item and fall through to add it fresh
      state.groceryList = state.groceryList.filter(g => g.id !== existing.id);
    } else {
      openAddMorePopup(existing);
      return;
    }
  }
  const item = itemById(itemId);
  if (!item) return;
  const cat = catById(item.categoryId);
  state.groceryList.push({
    id:           `g_${uid()}`,
    itemId:       item.id,
    itemName:     item.name,
    categoryId:   item.categoryId,
    categoryName: cat ? cat.name  : '',
    categoryEmoji:cat ? cat.emoji : '📦',
    quantity:     1,
    unit:         item.unit || '',
    checked:      false,
    addedAt:      Date.now(),
  });
  showToast(`${item.name} added to list`);
  saveData();
  updateBadge();
  renderItems();
}

function openAddMorePopup(g) {
  document.getElementById('qty-popup-overlay')?.remove();

  const unitLabel = g.unit ? ` ${g.unit}` : '';
  const overlay = document.createElement('div');
  overlay.id = 'qty-popup-overlay';
  overlay.className = 'qty-popup-overlay';
  overlay.innerHTML = `
    <div class="qty-popup" role="dialog">
      <div class="qty-popup-label">${esc(g.itemName)}</div>
      <div class="qty-popup-already">Already on list: <strong>${g.quantity}${unitLabel}</strong></div>
      <div class="qty-popup-more-label">Add how much more?</div>
      <input id="qty-popup-input" class="qty-popup-input" type="number" inputmode="numeric" min="0.01" step="any" placeholder="">
      <div class="qty-popup-actions">
        <button class="qty-popup-del" id="qty-popup-cancel">Cancel</button>
        <button class="qty-popup-ok"  id="qty-popup-ok">Add</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById('qty-popup-input');
  input.focus();

  const close = () => overlay.remove();

  const confirm = () => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      g.quantity = Math.round((g.quantity + val) * 100) / 100;
      saveData();
      updateBadge();
      renderItems();
      if (state.view === 'grocery') renderGrocery();
      showToast(`${g.itemName} → ${g.quantity}${unitLabel}`);
    }
    close();
  };

  document.getElementById('qty-popup-ok').addEventListener('click', confirm);
  document.getElementById('qty-popup-cancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') close(); });
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
  const card = document.querySelector(`.grocery-item[data-gid="${groceryId}"]`);
  if (card) card.querySelector('.qty-tap-val').textContent = g.quantity;
}

function openQtyPopup(groceryId) {
  const g = groceryById(groceryId);
  if (!g) return;

  // Remove any existing popup
  document.getElementById('qty-popup-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'qty-popup-overlay';
  overlay.className = 'qty-popup-overlay';
  overlay.innerHTML = `
    <div class="qty-popup" role="dialog" aria-label="Set quantity">
      <div class="qty-popup-label">${esc(g.itemName)}${g.unit ? ` <span class="qty-popup-unit">(${esc(g.unit)})</span>` : ''}</div>
      <input id="qty-popup-input" class="qty-popup-input" type="number" inputmode="decimal" min="0.01" step="any" value="${g.quantity}">
      <div class="qty-popup-actions">
        <button class="qty-popup-del" id="qty-popup-del">Remove item</button>
        <button class="qty-popup-ok"  id="qty-popup-ok">Done</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById('qty-popup-input');
  input.focus();
  input.select();

  const close = () => overlay.remove();

  const confirm = () => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      g.quantity = Math.round(val * 100) / 100;
      saveData();
      renderGrocery();
    }
    close();
  };

  document.getElementById('qty-popup-ok').addEventListener('click', confirm);
  document.getElementById('qty-popup-del').addEventListener('click', () => { close(); removeFromGrocery(groceryId); });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') close(); });
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

// ── Recipe CRUD ──────────────────────────────

function addRecipe(data) {
  const recipe = { id: `rec_${uid()}`, createdAt: Date.now(), favourite: false, ...data };
  state.recipes.push(recipe);
  saveData();
  return recipe;
}

function updateRecipe(id, data) {
  const idx = state.recipes.findIndex(r => r.id === id);
  if (idx === -1) return;
  state.recipes[idx] = { ...state.recipes[idx], ...data };
  saveData();
}

function deleteRecipe(id) {
  state.recipes = state.recipes.filter(r => r.id !== id);
  saveData();
}

function toggleRecipeFavourite(id) {
  const r = recipeById(id);
  if (!r) return;
  r.favourite = !r.favourite;
  saveData();
}

function addRecipeIngredientsToGrocery(recipeId, checkedIndices, servings) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  const scale = servings / (recipe.servings || 1);
  let count = 0;
  recipe.ingredients.forEach((ing, i) => {
    if (!checkedIndices.has(i)) return;
    const scaledAmt = Math.round(ing.amount * scale * 100) / 100;
    const nameLower = ing.itemName.toLowerCase().trim();
    // Try to match with existing item in database for proper category
    const dbItem = state.items.find(it => it.name.toLowerCase() === nameLower);
    // Merge if same name + same unit already in list (remove first if checked)
    const existing = state.groceryList.find(g =>
      g.itemName.toLowerCase() === nameLower && g.unit === ing.unit
    );
    if (existing && !existing.checked) {
      existing.quantity = Math.round((existing.quantity + scaledAmt) * 100) / 100;
    } else {
      if (existing) state.groceryList = state.groceryList.filter(g => g.id !== existing.id);
      state.groceryList.push({
        id:           `g_${uid()}`,
        itemId:       dbItem ? dbItem.id : null,
        itemName:     ing.itemName,
        categoryId:   dbItem ? dbItem.categoryId : null,
        categoryName: dbItem ? (catById(dbItem.categoryId)?.name || '') : recipe.tag,
        quantity:     scaledAmt,
        unit:         ing.unit,
        checked:      false,
        addedAt:      Date.now(),
      });
      count++;
    }
  });
  saveData();
  updateBadge();
  renderItems();
  const merged = checkedIndices.size - count;
  let msg = `${count} ingredient${count !== 1 ? 's' : ''} added`;
  if (merged > 0) msg += `, ${merged} merged`;
  showToast(msg);
}

// ── Image resize helper ───────────────────────

function resizeImageToBase64(file, maxDim = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function toggleEditMode() {
  state.editMode = !state.editMode;
  document.getElementById('edit-mode-btn').textContent = state.editMode ? 'Done' : 'Edit';
  document.getElementById('fab-add-item').style.display = state.editMode ? 'none' : '';
  renderPills();
  renderItems();
}

function cycleSortMode() {
  const modes = ['favourites', 'alpha', 'recent'];
  const labels = { favourites: 'Fav first', alpha: 'A → Z', recent: 'Recent' };
  const next = modes[(modes.indexOf(state.recipeSort) + 1) % modes.length];
  state.recipeSort = next;
  document.getElementById('recipe-sort-btn').textContent = labels[next];
  renderRecipes();
}

function deleteItem(itemId) {
  const item = itemById(itemId);
  if (!item) return;
  const name = item.name;
  if (!item.custom) state.deletedItemIds.push(itemId);
  state.items = state.items.filter(i => i.id !== itemId);
  state.groceryList = state.groceryList.filter(g => g.itemId !== itemId);
  saveData();
  updateBadge();
  renderItems();
  if (state.view === 'grocery') renderGrocery();
  showToast(`${name} removed`);
}

function deleteCategory(categoryId) {
  const cat = catById(categoryId);
  if (!cat) return;
  const itemCount = state.items.filter(i => i.categoryId === categoryId).length;
  const msg = itemCount > 0
    ? `Delete "${cat.name}"? This will also remove ${itemCount} item${itemCount !== 1 ? 's' : ''}.`
    : `Delete "${cat.name}"?`;
  document.getElementById('confirm-del-cat-msg').textContent = msg;
  document.getElementById('confirm-del-cat-btn').dataset.catId = categoryId;
  openModal('modal-confirm-del-cat');
}

function confirmDeleteCategory(categoryId) {
  const cat = catById(categoryId);
  if (!cat) return;
  const name = cat.name;
  if (!cat.custom) state.deletedCategoryIds.push(categoryId);
  state.items.forEach(i => {
    if (i.categoryId === categoryId && !i.custom)
      state.deletedItemIds.push(i.id);
  });
  const itemIds = new Set(state.items.filter(i => i.categoryId === categoryId).map(i => i.id));
  state.items = state.items.filter(i => i.categoryId !== categoryId);
  state.groceryList = state.groceryList.filter(g => !itemIds.has(g.itemId));
  state.categories = state.categories.filter(c => c.id !== categoryId);
  if (state.categoryFilter === categoryId) state.categoryFilter = 'all';
  saveData();
  updateBadge();
  renderPills();
  renderItems();
  if (state.view === 'grocery') renderGrocery();
  showToast(`${name} deleted`);
}

// ══════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════

function renderPills() {
  // Update the dropdown label to reflect current selection
  const cat = catById(state.categoryFilter);
  document.getElementById('cat-select-label').textContent = cat ? cat.name : 'All';
}

function openCatDropdown() {
  const dropdown = document.getElementById('cat-dropdown');
  const allActive = state.categoryFilter === 'all';
  let html = `<div class="cat-option${allActive ? ' active' : ''}" data-cat="all">All</div>`;

  state.categories.forEach(c => {
    const active = state.categoryFilter === c.id;
    html += `<div class="cat-option${active ? ' active' : ''}" data-cat="${esc(c.id)}">
      <span class="cat-option-name">${esc(c.name)}</span>
      ${state.editMode ? `<button class="cat-option-del" data-del-cat="${esc(c.id)}" aria-label="Delete ${esc(c.name)}">✕</button>` : ''}
    </div>`;
  });

  html += `<div class="cat-option cat-option-add" id="cat-option-add">+ Add Category</div>`;
  dropdown.innerHTML = html;
  dropdown.hidden = false;

  dropdown.querySelectorAll('.cat-option[data-cat]').forEach(opt =>
    opt.addEventListener('click', () => {
      state.categoryFilter = opt.dataset.cat;
      closeCatDropdown();
      renderPills();
      renderItems();
      document.getElementById('view-items').querySelector('.items-scroll').scrollTop = 0;
    })
  );

  dropdown.querySelectorAll('.cat-option-del').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeCatDropdown();
      deleteCategory(btn.dataset.delCat);
    })
  );

  document.getElementById('cat-option-add').addEventListener('click', () => {
    closeCatDropdown();
    openModal('modal-add-category');
  });
}

function closeCatDropdown() {
  document.getElementById('cat-dropdown').hidden = true;
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
      html += `<div class="section-hdr"><span class="section-hdr-name">${esc(cat.name)}</span></div>`;
      grouped[cat.id].forEach(item => html += itemCard(item, cat));
    });
  } else {
    items.forEach(item => html += itemCard(item, catById(item.categoryId)));
  }

  list.innerHTML = html;

  list.querySelectorAll('.add-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const wasSearching = !!state.searchQuery;
      const alreadyInList = !!groceryByItemId(btn.dataset.itemId);

      // Always clear search state first (behind the popup if one opens)
      if (wasSearching) {
        const si = document.getElementById('search-input');
        const sc = document.getElementById('search-clear');
        si.value = '';
        state.searchQuery = '';
        sc.classList.remove('visible');
        renderItems();
      }

      // Don't blur — let focus shift directly from search input to popup numpad
      // so keyboard stays up and switches from text→numeric
      addToGrocery(btn.dataset.itemId);

      if (wasSearching && !alreadyInList) {
        // Item was new — reopen keyboard to keep adding
        document.getElementById('search-input').focus();
      }
    })
  );

  list.querySelectorAll('.trash-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteItem(btn.dataset.delItem);
    })
  );
}

function itemCard(item, cat) {
  const inList = !!groceryByItemId(item.id);
  const emoji  = cat ? cat.emoji : '📦';
  const tag    = cat ? cat.name  : '';
  const actionBtn = state.editMode
    ? `<button class="trash-btn" data-del-item="${esc(item.id)}" aria-label="Delete ${esc(item.name)}">✕</button>`
    : `<button class="add-btn${inList ? ' in-list' : ''}" data-item-id="${esc(item.id)}" aria-label="Add to grocery list">${inList ? '✓' : '+'}</button>`;
  return `<div class="item-card">
    <div class="item-info">
      <span class="item-name">${esc(item.name)}</span>${item.unit ? `<span class="item-unit">${esc(item.unit)}</span>` : ''}
    </div>
    ${actionBtn}
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

  const unchecked = state.groceryList.filter(g => !g.checked);
  const checked   = state.groceryList.filter(g =>  g.checked);

  const renderItem = g => {
    const qtyStr = [g.quantity, g.unit].filter(Boolean).join(' ');
    return `
    <div class="grocery-item${g.checked ? ' checked' : ''}" data-gid="${esc(g.id)}">
      <div class="g-col-qty" data-action="edit-qty" data-gid="${esc(g.id)}">${esc(qtyStr)}</div>
      <div class="g-col-name" data-action="edit-qty" data-gid="${esc(g.id)}">${esc(g.itemName)}</div>
      <button class="g-checkbox${g.checked ? ' checked' : ''}" data-action="toggle" data-gid="${esc(g.id)}" aria-label="Check off">
        ${g.checked ? '✓' : ''}
      </button>
    </div>`;
  };

  // Group unchecked items by category
  const grouped = {};
  unchecked.forEach(g => {
    (grouped[g.categoryId] = grouped[g.categoryId] || []).push(g);
  });
  Object.values(grouped).forEach(grp => grp.sort((a, b) => a.addedAt - b.addedAt));

  let html = '';
  state.categories.forEach(cat => {
    if (!grouped[cat.id]?.length) return;
    html += `<div class="section-hdr"><span class="section-hdr-name">${esc(cat.name)}</span></div>`;
    grouped[cat.id].forEach(g => { html += renderItem(g); });
  });
  // fallback for items with unknown category
  const knownIds = new Set(state.categories.map(c => c.id));
  unchecked.filter(g => !knownIds.has(g.categoryId)).forEach(g => { html += renderItem(g); });

  // Checked section at the bottom — always visible
  if (checked.length) {
    html += `<div class="section-hdr"><span class="section-hdr-name">Checked (${checked.length})</span></div>`;
    checked.sort((a, b) => a.addedAt - b.addedAt).forEach(g => { html += renderItem(g); });
  }

  list.innerHTML = html;

  // Single delegated listener
  list.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
      const { action, gid } = el.dataset;
      if (action === 'edit-qty') openQtyPopup(gid);
      if (action === 'toggle')   { e.stopPropagation(); toggleChecked(gid); }
    });
  });
}

// ══════════════════════════════════════════════
//  RECIPE RENDER
// ══════════════════════════════════════════════

function renderRecipes() {
  const list  = document.getElementById('recipe-list');
  const empty = document.getElementById('recipes-empty');
  const recipes = sortedRecipes();

  if (!recipes.length) {
    list.innerHTML = '';
    list.hidden  = true;
    empty.hidden = false;
    return;
  }
  list.hidden  = false;
  empty.hidden = true;

  list.innerHTML = recipes.map(r => {
    const total = (r.prepTime || 0) + (r.cookTime || 0);
    const timeStr = fmtTime(total);
    const photo = r.photo
      ? `<img src="${r.photo}" alt="${esc(r.name)}">`
      : `<div class="recipe-card-photo-placeholder">No photo</div>`;
    return `<div class="recipe-card" data-recipe-id="${esc(r.id)}">
      <div class="recipe-card-photo">${photo}</div>
      <div class="recipe-card-info">
        <div class="recipe-card-name">${esc(r.name)}</div>
        <div class="recipe-card-meta">
          ${r.tag ? `<span class="recipe-card-tag">${esc(r.tag)}</span>` : ''}
          <div class="recipe-card-actions">
            <button class="recipe-card-fav${r.favourite ? ' active' : ''}" data-fav-id="${esc(r.id)}" aria-label="Favourite">
              ${r.favourite ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.recipe-card').forEach(card =>
    card.addEventListener('click', e => {
      if (e.target.closest('.recipe-card-fav')) return;
      openRecipePage(card.dataset.recipeId);
    })
  );
  list.querySelectorAll('.recipe-card-fav').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleRecipeFavourite(btn.dataset.favId);
      renderRecipes();
    })
  );
}

function openRecipePage(id) {
  state.activeRecipeId = id;
  const recipe = recipeById(id);
  if (!recipe) return;
  document.getElementById('recipe-page-scroll').scrollTop = 0;

  // Photo
  const photoEl = document.getElementById('recipe-page-photo');
  const noPhoto  = document.getElementById('recipe-page-no-photo');
  const photoWrap = document.getElementById('recipe-page-photo-wrap');
  if (recipe.photo) {
    photoEl.src = recipe.photo;
    photoEl.hidden = false;
    photoWrap.hidden = false;
  } else {
    photoWrap.hidden = true;
  }
  noPhoto.hidden = true;

  // Title + fav
  document.getElementById('recipe-page-name').textContent = recipe.name;
  const favBtn = document.getElementById('recipe-page-fav');
  favBtn.textContent = recipe.favourite ? '♥' : '♡';
  favBtn.classList.toggle('active', !!recipe.favourite);

  // Meta pills
  const meta = document.getElementById('recipe-page-meta');
  const pills = [];
  if (recipe.tag) pills.push(`<span class="recipe-meta-pill tag">${esc(recipe.tag)}</span>`);
  const prep = fmtTime(recipe.prepTime), cook = fmtTime(recipe.cookTime), total = fmtTime((recipe.prepTime||0)+(recipe.cookTime||0));
  if (prep)  pills.push(`<span class="recipe-meta-pill">Prep ${prep}</span>`);
  if (cook)  pills.push(`<span class="recipe-meta-pill">Cook ${cook}</span>`);
  if (total && (recipe.prepTime||0)+(recipe.cookTime||0) > 0) pills.push(`<span class="recipe-meta-pill">Total ${total}</span>`);
  if (recipe.servings) pills.push(`<span class="recipe-meta-pill">Serves ${recipe.servings}</span>`);
  meta.innerHTML = pills.join('');

  // Ingredients
  const ingSection = document.getElementById('recipe-page-ingredients-section');
  const ingEl      = document.getElementById('recipe-page-ingredients');
  if (recipe.ingredients?.length) {
    ingSection.hidden = false;
    ingEl.innerHTML = recipe.ingredients.map(ing => {
      const amt = ing.amount ? `${ing.amount} ${ing.unit}`.trim() : (ing.unit || '');
      return `<div class="recipe-ing-row">
        <span class="recipe-ing-name">${esc(ing.itemName)}</span>
        ${amt ? `<span class="recipe-ing-amt">${esc(amt)}</span>` : ''}
      </div>`;
    }).join('');
  } else {
    ingSection.hidden = true;
  }

  // Instructions
  const instrEl = document.getElementById('recipe-page-instructions');
  const section  = document.getElementById('recipe-page-instructions-section');
  if (recipe.instructions?.length) {
    section.hidden = false;
    instrEl.innerHTML = recipe.instructions.map((step, i) => `
      <div class="instruction-step">
        <div class="step-num">${i + 1}</div>
        <div class="step-text">${esc(step)}</div>
      </div>`).join('');
  } else {
    section.hidden = true;
  }

  document.getElementById('recipe-page').classList.add('open');
}

function closeRecipePage() {
  document.getElementById('recipe-page').classList.remove('open');
  state.activeRecipeId = null;
}

// ── Recipe Form Page ──────────────────────────

function openRecipeFormPage(id = null) {
  state.editingRecipeId = id;
  const recipe = id ? recipeById(id) : null;
  document.getElementById('recipe-form-title').textContent = id ? 'Edit Recipe' : 'New Recipe';
  document.getElementById('recipe-form-page').querySelector('.recipe-form-scroll').scrollTop = 0;

  // Reset / prefill fields
  document.getElementById('rf-name').value     = recipe?.name     || '';
  document.getElementById('rf-tag').value      = recipe?.tag      || 'dinner';
  document.getElementById('rf-prep').value     = recipe?.prepTime != null ? recipe.prepTime : '';
  document.getElementById('rf-cook').value     = recipe?.cookTime != null ? recipe.cookTime : '';
  document.getElementById('rf-servings').value = recipe?.servings || '';

  // Photo preview
  const preview = document.getElementById('recipe-form-photo-preview');
  const photoBtn = document.getElementById('recipe-form-photo-btn');
  const urlInput = document.getElementById('recipe-form-photo-url');
  if (recipe?.photo) {
    preview.src = recipe.photo;
    preview.hidden = false;
    photoBtn.textContent = 'Change Photo';
    // Populate URL field if photo is a URL (not base64)
    urlInput.value = recipe.photo.startsWith('data:') ? '' : recipe.photo;
  } else {
    preview.hidden = true;
    photoBtn.textContent = '+ Add Photo';
    urlInput.value = '';
  }

  // Ingredients
  renderFormIngredients(recipe?.ingredients || []);

  // Steps
  renderFormSteps(recipe?.instructions || []);

  document.getElementById('recipe-form-page').classList.add('open');
}

function closeRecipeFormPage() {
  document.getElementById('recipe-form-page').classList.remove('open');
  state.editingRecipeId = null;
}

function renderFormIngredients(list) {
  const UNITS = ['g','kg','ml','L','tsp','tbsp','cup','fl oz','oz','lb','piece','clove','slice','handful','pinch','sprig',''];
  const sortedItems = [...state.items].sort((a, b) => a.name.localeCompare(b.name));
  // One shared datalist is enough — all rows reference the same one
  const datalistId = 'rf-ing-datalist';

  const S = 'padding:10px 8px;border:1.5px solid var(--border);border-radius:var(--r-md);background:var(--surface-2);color:var(--text);font-size:16px;font-family:var(--font);outline:none;-webkit-appearance:none;';

  const container = document.getElementById('rf-ingredients-list');

  // Inject shared datalist once
  if (!document.getElementById(datalistId)) {
    const dl = document.createElement('datalist');
    dl.id = datalistId;
    dl.innerHTML = sortedItems.map(it => `<option value="${esc(it.name)}">`).join('');
    document.body.appendChild(dl);
  }

  container.innerHTML = list.map((ing, i) => `
    <div class="rf-ingredient-row" data-ing-idx="${i}">
      <input class="rf-ing-name" type="text" list="${datalistId}" placeholder="Ingredient…"
             value="${esc(ing.itemName)}" autocomplete="off"
             style="flex:2;min-width:0;${S}">
      <input class="rf-ing-amount" type="number" min="0" step="any" placeholder="Amt"
             value="${ing.amount || ''}"
             style="width:62px;${S}text-align:right;">
      <select class="rf-ing-unit" style="width:74px;${S}">
        ${UNITS.map(u => `<option value="${u}"${ing.unit===u?' selected':''}>${u||'—'}</option>`).join('')}
      </select>
      <button class="rf-row-del" data-del-ing="${i}" type="button">✕</button>
    </div>`).join('');

  container.querySelectorAll('.rf-row-del').forEach(btn =>
    btn.addEventListener('click', () => {
      const rows = getFormIngredients();
      rows.splice(parseInt(btn.dataset.delIng), 1);
      renderFormIngredients(rows);
    })
  );
}

function renderFormSteps(list) {
  const container = document.getElementById('rf-instructions-list');
  container.innerHTML = list.map((step, i) => `
    <div class="rf-step-row" data-step-idx="${i}">
      <div class="rf-step-num">${i + 1}</div>
      <textarea class="rf-step-text" placeholder="Describe this step…">${esc(step)}</textarea>
      <button class="rf-row-del" data-del-step="${i}" type="button">✕</button>
    </div>`).join('');

  container.querySelectorAll('.rf-row-del').forEach(btn =>
    btn.addEventListener('click', () => {
      const steps = getFormSteps();
      steps.splice(parseInt(btn.dataset.delStep), 1);
      renderFormSteps(steps);
    })
  );
}

function getFormIngredients() {
  return Array.from(document.querySelectorAll('#rf-ingredients-list .rf-ingredient-row')).map(row => ({
    itemName: row.querySelector('.rf-ing-name').value.trim(),
    amount:   parseFloat(row.querySelector('.rf-ing-amount').value) || 0,
    unit:     row.querySelector('.rf-ing-unit').value,
  })).filter(i => i.itemName);
}

function getFormSteps() {
  return Array.from(document.querySelectorAll('#rf-instructions-list .rf-step-text'))
    .map(t => t.value.trim()).filter(Boolean);
}

function saveRecipeForm() {
  const name = document.getElementById('rf-name').value.trim();
  if (!name) {
    document.getElementById('rf-name').classList.add('error');
    showToast('Please enter a recipe name');
    return;
  }
  const data = {
    name,
    tag:          document.getElementById('rf-tag').value,
    prepTime:     parseInt(document.getElementById('rf-prep').value)     || 0,
    cookTime:     parseInt(document.getElementById('rf-cook').value)     || 0,
    servings:     parseInt(document.getElementById('rf-servings').value) || 1,
    ingredients:  getFormIngredients(),
    instructions: getFormSteps(),
    photo:        document.getElementById('recipe-form-photo-preview').hidden
                    ? (state.editingRecipeId ? recipeById(state.editingRecipeId)?.photo || null : null)
                    : document.getElementById('recipe-form-photo-preview').src,
  };
  if (state.editingRecipeId) {
    updateRecipe(state.editingRecipeId, data);
    showToast('Recipe updated');
    closeRecipeFormPage();
    if (state.activeRecipeId === state.editingRecipeId) openRecipePage(state.editingRecipeId);
  } else {
    const r = addRecipe(data);
    showToast(`${r.name} added`);
    closeRecipeFormPage();
  }
  renderRecipes();
}

// ── Add to Grocery Sheet ──────────────────────

function openAddToGrocerySheet(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  state.atgRecipeId = recipeId;
  state.atgServings = recipe.servings || 1;
  state.atgChecked  = new Set(recipe.ingredients.map((_, i) => i));
  document.getElementById('atg-recipe-name').textContent = recipe.name;
  renderAtgSheet();
  openModal('modal-add-to-grocery');
}

function renderAtgSheet() {
  const recipe = recipeById(state.atgRecipeId);
  if (!recipe) return;
  const scale = state.atgServings / (recipe.servings || 1);
  document.getElementById('atg-servings-val').textContent = state.atgServings;

  document.getElementById('atg-ingredients-list').innerHTML = recipe.ingredients.map((ing, i) => {
    const checked = state.atgChecked.has(i);
    const scaledAmt = Math.round(ing.amount * scale * 100) / 100;
    const amtStr = scaledAmt ? `${scaledAmt} ${ing.unit}`.trim() : ing.unit || '';
    return `<div class="atg-ingredient-row" data-ing-idx="${i}">
      <div class="atg-check${checked ? ' checked' : ''}">${checked ? '✓' : ''}</div>
      <span class="atg-ing-name">${esc(ing.itemName)}</span>
      ${amtStr ? `<span class="atg-ing-amount">${esc(amtStr)}</span>` : ''}
    </div>`;
  }).join('');

  document.querySelectorAll('.atg-ingredient-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.dataset.ingIdx);
      state.atgChecked.has(idx) ? state.atgChecked.delete(idx) : state.atgChecked.add(idx);
      renderAtgSheet();
    });
  });

  const n = state.atgChecked.size;
  document.getElementById('atg-confirm-btn').textContent = `Add ${n} ingredient${n !== 1 ? 's' : ''} to list`;
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
  const el = document.getElementById(`view-${view}`);
  el.classList.add('active');
  const scroller = el.querySelector('.items-scroll');
  if (scroller) scroller.scrollTop = 0;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`nav-${view}`).classList.add('active');
  if (view === 'grocery') renderGrocery();
  if (view === 'recipes') renderRecipes();
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
    .map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`)
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
  renderRecipes();
  updateBadge();

  // ── Category dropdown ────────────────────────
  document.getElementById('cat-select-btn').addEventListener('click', () => {
    const dropdown = document.getElementById('cat-dropdown');
    dropdown.hidden ? openCatDropdown() : closeCatDropdown();
  });
  document.addEventListener('click', e => {
    if (!document.getElementById('cat-select-wrap').contains(e.target))
      closeCatDropdown();
  });

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

  document.getElementById('go-browse-btn')?.addEventListener('click', () => switchView('items'));

  // ── Edit mode ─────────────────────────────────
  document.getElementById('edit-mode-btn').addEventListener('click', toggleEditMode);

  // ── Clear completed ───────────────────────────
  document.getElementById('clear-completed-btn').addEventListener('click', clearCompleted);

  // ── Modal: close buttons (shared attr) ────────
  document.querySelectorAll('[data-modal]').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.dataset.modal))
  );

  // Close modal on overlay click
  ['modal-add-item', 'modal-add-category', 'modal-confirm-del-cat'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      if (e.target.id === id) closeModal(id);
    });
  });

  // ── Confirm: Delete Category ──────────────────
  document.getElementById('confirm-del-cat-btn').addEventListener('click', () => {
    const catId = document.getElementById('confirm-del-cat-btn').dataset.catId;
    closeModal('modal-confirm-del-cat');
    confirmDeleteCategory(catId);
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
    const nameEl  = document.getElementById('cat-name');
    const name    = nameEl.value.trim();

    if (!name) {
      nameEl.classList.add('error');
      nameEl.focus();
      showToast('Please enter a category name');
      nameEl.addEventListener('input', () => nameEl.classList.remove('error'), { once: true });
      return;
    }

    const cat = addCategory('', name);
    closeModal('modal-add-category');
    nameEl.value = '';

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

  // ── Recipes: list buttons ─────────────────────
  document.getElementById('add-recipe-btn').addEventListener('click', () => openRecipeFormPage());
  document.getElementById('empty-add-recipe-btn').addEventListener('click', () => openRecipeFormPage());
  document.getElementById('recipe-sort-btn').addEventListener('click', cycleSortMode);

  // ── Recipes: detail page ──────────────────────
  document.getElementById('recipe-back-btn').addEventListener('click', closeRecipePage);
  document.getElementById('recipe-edit-btn').addEventListener('click', () => {
    openRecipeFormPage(state.activeRecipeId);
  });
  document.getElementById('recipe-delete-btn').addEventListener('click', () => {
    openModal('modal-confirm-del-recipe');
  });
  document.getElementById('confirm-del-recipe-btn').addEventListener('click', () => {
    closeModal('modal-confirm-del-recipe');
    const id = state.activeRecipeId;
    closeRecipePage();
    deleteRecipe(id);
    renderRecipes();
    showToast('Recipe deleted');
  });
  document.getElementById('recipe-page-fav').addEventListener('click', () => {
    if (!state.activeRecipeId) return;
    toggleRecipeFavourite(state.activeRecipeId);
    const r = recipeById(state.activeRecipeId);
    const btn = document.getElementById('recipe-page-fav');
    btn.textContent = r.favourite ? '♥' : '♡';
    btn.classList.toggle('active', r.favourite);
    renderRecipes();
  });
  document.getElementById('recipe-add-grocery-btn').addEventListener('click', () => {
    if (state.activeRecipeId) openAddToGrocerySheet(state.activeRecipeId);
  });

  // ── Recipes: form page ────────────────────────
  document.getElementById('recipe-form-cancel').addEventListener('click', closeRecipeFormPage);
  document.getElementById('recipe-form-save').addEventListener('click', saveRecipeForm);
  document.getElementById('rf-add-ingredient-btn').addEventListener('click', () => {
    renderFormIngredients([...getFormIngredients(), { itemName: '', amount: 0, unit: 'g' }]);
  });
  document.getElementById('rf-add-step-btn').addEventListener('click', () => {
    renderFormSteps([...getFormSteps(), '']);
  });
  document.getElementById('rf-name').addEventListener('input', e =>
    e.target.classList.remove('error')
  );

  // Photo picker
  const photoInput   = document.getElementById('recipe-form-photo-input');
  const photoPreview = document.getElementById('recipe-form-photo-preview');
  const photoBtn     = document.getElementById('recipe-form-photo-btn');
  const photoUrlInput = document.getElementById('recipe-form-photo-url');

  photoBtn.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', async () => {
    const file = photoInput.files[0];
    if (!file) return;
    try {
      const b64 = await resizeImageToBase64(file);
      photoPreview.src = b64;
      photoPreview.hidden = false;
      photoBtn.textContent = 'Change Photo';
      photoUrlInput.value = '';  // clear URL input when file chosen
    } catch (e) { showToast('Could not load photo'); }
    photoInput.value = '';
  });

  photoUrlInput.addEventListener('input', () => {
    const url = photoUrlInput.value.trim();
    if (url) {
      photoPreview.src = url;
      photoPreview.hidden = false;
      photoBtn.textContent = 'Change Photo';
    } else {
      photoPreview.hidden = true;
      photoPreview.src = '';
      photoBtn.textContent = '+ Add Photo';
    }
  });

  // ── Add to Grocery sheet ──────────────────────
  document.getElementById('atg-servings-minus').addEventListener('click', () => {
    if (state.atgServings <= 1) return;
    state.atgServings--;
    renderAtgSheet();
  });
  document.getElementById('atg-servings-plus').addEventListener('click', () => {
    state.atgServings++;
    renderAtgSheet();
  });
  document.getElementById('atg-confirm-btn').addEventListener('click', () => {
    addRecipeIngredientsToGrocery(state.atgRecipeId, state.atgChecked, state.atgServings);
    closeModal('modal-add-to-grocery');
  });
  document.getElementById('modal-add-to-grocery').addEventListener('click', e => {
    if (e.target.id === 'modal-add-to-grocery') closeModal('modal-add-to-grocery');
  });
  document.getElementById('modal-confirm-del-recipe').addEventListener('click', e => {
    if (e.target.id === 'modal-confirm-del-recipe') closeModal('modal-confirm-del-recipe');
  });
}

document.addEventListener('DOMContentLoaded', init);

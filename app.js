/* ─────────────────────────────────────────────
   Grocery Confidential — app.js
   ───────────────────────────────────────────── */

// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════

const state = {
  view:               'items',
  categoryFilter:     'all',
  searchQuery:        '',
  editMode:           false,
  categories:         [],
  items:              [],
  groceryList:        [],
  deletedItemIds:     [],
  deletedCategoryIds: [],
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

function toggleEditMode() {
  state.editMode = !state.editMode;
  document.getElementById('edit-mode-btn').textContent = state.editMode ? 'Done' : 'Edit';
  document.getElementById('fab-add-item').style.display = state.editMode ? 'none' : '';
  renderPills();
  renderItems();
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

  wrap.querySelectorAll('.pill-del-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteCategory(btn.dataset.delCat);
    })
  );

  document.getElementById('pill-add-cat').addEventListener('click', () =>
    openModal('modal-add-category')
  );
}

function pill(id, name, emoji, active) {
  const btn = `<button class="pill${active ? ' active' : ''}" data-cat="${esc(id)}">${esc(name)}</button>`;
  if (state.editMode && id !== 'all') {
    return `<div class="pill-wrap">${btn}<button class="pill-del-btn" data-del-cat="${esc(id)}" aria-label="Delete ${esc(name)}">×</button></div>`;
  }
  return btn;
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
      html += `<div class="section-hdr">${esc(cat.name)}</div>`;
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
      <div class="item-name">${esc(item.name)}</div>
      <div class="item-meta">
        <span class="item-tag">${esc(tag)}</span>
        ${item.unit ? `<span class="item-unit">${esc(item.unit)}</span>` : ''}
      </div>
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
        <span class="g-cat">${esc(g.categoryName)}</span>
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
}

document.addEventListener('DOMContentLoaded', init);

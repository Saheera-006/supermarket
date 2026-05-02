// ──────────────────────────────────────────────
// DATA STORE
// ──────────────────────────────────────────────
let categories = JSON.parse(localStorage.getItem('gm_cats') || '[]');
let products = JSON.parse(localStorage.getItem('gm_products') || '[]');
let bills = JSON.parse(localStorage.getItem('gm_bills') || '[]');
let billItems = []; // current bill in progress
let editingProductId = null;
let billCounter = parseInt(localStorage.getItem('gm_billcounter') || '1000');

// Seed data if empty
if (categories.length === 0) {
    categories = [
        { id: 'c1', name: 'Grains & Pulses' },
        { id: 'c2', name: 'Dairy & Eggs' },
        { id: 'c3', name: 'Vegetables' },
        { id: 'c4', name: 'Fruits' },
        { id: 'c5', name: 'Beverages' },
        { id: 'c6', name: 'Snacks' },
        { id: 'c7', name: 'Oils & Spices' },
    ];
    saveData();
}
if (products.length === 0) {
    products = [
        { id: 'p1', name: 'Basmati Rice', cat: 'c1', price: 80, stock: 50, unit: 'kg', lowStock: 5, sku: 'SKU001' },
        { id: 'p2', name: 'Toor Dal', cat: 'c1', price: 120, stock: 30, unit: 'kg', lowStock: 5, sku: 'SKU002' },
        { id: 'p3', name: 'Full Cream Milk', cat: 'c2', price: 28, stock: 4, unit: 'L', lowStock: 5, sku: 'SKU003' },
        { id: 'p4', name: 'Amul Butter', cat: 'c2', price: 55, stock: 20, unit: 'pcs', lowStock: 5, sku: 'SKU004' },
        { id: 'p5', name: 'Tomatoes', cat: 'c3', price: 30, stock: 15, unit: 'kg', lowStock: 5, sku: 'SKU005' },
        { id: 'p6', name: 'Onions', cat: 'c3', price: 25, stock: 40, unit: 'kg', lowStock: 5, sku: 'SKU006' },
        { id: 'p7', name: 'Bananas', cat: 'c4', price: 40, stock: 3, unit: 'dozen', lowStock: 5, sku: 'SKU007' },
        { id: 'p8', name: 'Sunflower Oil', cat: 'c7', price: 140, stock: 12, unit: 'L', lowStock: 5, sku: 'SKU008' },
        { id: 'p9', name: 'Maggi Noodles', cat: 'c6', price: 14, stock: 60, unit: 'pcs', lowStock: 10, sku: 'SKU009' },
        { id: 'p10', name: 'Tata Tea Premium', cat: 'c5', price: 90, stock: 25, unit: 'pcs', lowStock: 5, sku: 'SKU010' },
    ];
    saveData();
}
if (bills.length === 0) {
    // seed a few sample bills
    const now = Date.now();
    bills = [
        { id: 'b1001', num: 1001, date: now - 86400000 * 6, customer: 'Ravi Kumar', phone: '9876543210', items: [{ pid: 'p1', name: 'Basmati Rice', price: 80, qty: 2, unit: 'kg' }, { pid: 'p9', name: 'Maggi Noodles', price: 14, qty: 5, unit: 'pcs' }], subtotal: 230, discount: 0, tax: 11.5, total: 241.5 },
        { id: 'b1002', num: 1002, date: now - 86400000 * 5, customer: 'Priya S', phone: '', items: [{ pid: 'p3', name: 'Full Cream Milk', price: 28, qty: 3, unit: 'L' }, { pid: 'p4', name: 'Amul Butter', price: 55, qty: 1, unit: 'pcs' }], subtotal: 139, discount: 5, tax: 6.6275, total: 138.6275 },
        { id: 'b1003', num: 1003, date: now - 86400000 * 4, customer: 'Walk-in', phone: '', items: [{ pid: 'p5', name: 'Tomatoes', price: 30, qty: 2, unit: 'kg' }, { pid: 'p6', name: 'Onions', price: 25, qty: 3, unit: 'kg' }], subtotal: 135, discount: 0, tax: 6.75, total: 141.75 },
        { id: 'b1004', num: 1004, date: now - 86400000 * 3, customer: 'Sundar M', phone: '9988776655', items: [{ pid: 'p8', name: 'Sunflower Oil', price: 140, qty: 2, unit: 'L' }, { pid: 'p10', name: 'Tata Tea Premium', price: 90, qty: 1, unit: 'pcs' }], subtotal: 370, discount: 10, tax: 17.575, total: 350.575 },
        { id: 'b1005', num: 1005, date: now - 86400000 * 2, customer: 'Kavitha R', phone: '', items: [{ pid: 'p2', name: 'Toor Dal', price: 120, qty: 1, unit: 'kg' }, { pid: 'p7', name: 'Bananas', price: 40, qty: 2, unit: 'dozen' }], subtotal: 200, discount: 0, tax: 10, total: 210 },
        { id: 'b1006', num: 1006, date: now - 86400000 * 1, customer: 'Walk-in', phone: '', items: [{ pid: 'p9', name: 'Maggi Noodles', price: 14, qty: 10, unit: 'pcs' }, { pid: 'p1', name: 'Basmati Rice', price: 80, qty: 5, unit: 'kg' }], subtotal: 540, discount: 0, tax: 27, total: 567 },
        { id: 'b1007', num: 1007, date: now, customer: 'Anand P', phone: '9123456789', items: [{ pid: 'p4', name: 'Amul Butter', price: 55, qty: 2, unit: 'pcs' }, { pid: 'p10', name: 'Tata Tea Premium', price: 90, qty: 2, unit: 'pcs' }], subtotal: 290, discount: 0, tax: 14.5, total: 304.5 },
    ];
    billCounter = 1008;
    saveData();
}

function saveData() {
    localStorage.setItem('gm_cats', JSON.stringify(categories));
    localStorage.setItem('gm_products', JSON.stringify(products));
    localStorage.setItem('gm_bills', JSON.stringify(bills));
    localStorage.setItem('gm_billcounter', billCounter);
}

// ──────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────
const pageTitles = { dashboard: 'Dashboard', products: 'Products', billing: 'New Bill', bills: 'Bill History', categories: 'Categories' };

function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + page + "'")) n.classList.add('active');
    });
    document.getElementById('page-title').textContent = pageTitles[page] || page;
    if (page === 'dashboard') renderDashboard();
    if (page === 'products') { renderProducts(); populateCategoryFilter(); }
    if (page === 'billing') populateBillingProducts();
    if (page === 'bills') renderBills();
    if (page === 'categories') renderCategories();
    checkLowStock();
}

// ──────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayBills = bills.filter(b => new Date(b.date) >= today);
    const weekAgo = Date.now() - 7 * 86400000;
    const weekBills = bills.filter(b => b.date >= weekAgo);
    const totalRevenue = bills.reduce((s, b) => s + b.total, 0);
    const todayRevenue = todayBills.reduce((s, b) => s + b.total, 0);
    const weekRevenue = weekBills.reduce((s, b) => s + b.total, 0);
    const lowStockCount = products.filter(p => p.stock <= p.lowStock).length;

    document.getElementById('dashboard-stats').innerHTML = `
    <div class="stat-card"><div class="stat-label">Today's Revenue</div><div class="stat-value">₹${fmt(todayRevenue)}</div><div class="stat-sub">${todayBills.length} bill(s) today</div></div>
    <div class="stat-card"><div class="stat-label">Weekly Revenue</div><div class="stat-value">₹${fmt(weekRevenue)}</div><div class="stat-sub">Last 7 days</div></div>
    <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">₹${fmt(totalRevenue)}</div><div class="stat-sub">${bills.length} bills total</div></div>
    <div class="stat-card"><div class="stat-label">Low Stock Items</div><div class="stat-value" style="color:${lowStockCount > 0 ? 'var(--warn)' : 'var(--accent)'}">${lowStockCount}</div><div class="stat-sub">${products.length} products total</div></div>
  `;

    // Bar chart - last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
        const next = new Date(d); next.setDate(next.getDate() + 1);
        const rev = bills.filter(b => b.date >= d.getTime() && b.date < next.getTime()).reduce((s, b) => s + b.total, 0);
        days.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), rev });
    }
    const maxRev = Math.max(...days.map(d => d.rev), 1);
    document.getElementById('sales-chart').innerHTML = days.map(d => `
    <div class="bar-wrap">
      <div class="bar" style="height:${Math.max((d.rev / maxRev) * 100, 4)}%" title="₹${fmt(d.rev)}"></div>
      <div class="bar-label">${d.label}</div>
    </div>
  `).join('');

    // Recent bills
    const recent = [...bills].sort((a, b) => b.date - a.date).slice(0, 5);
    document.getElementById('recent-bills-list').innerHTML = recent.length ? recent.map(b => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;font-weight:500">#${b.num} · ${b.customer}</div>
        <div style="font-size:11.5px;color:var(--text3)">${new Date(b.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div style="font-family:var(--mono);font-size:13px;font-weight:500">₹${fmt(b.total)}</div>
    </div>
  `).join('') : '<div class="empty-state">No bills yet</div>';

    // Top products by qty sold
    const sold = {};
    bills.forEach(b => b.items.forEach(it => { sold[it.name] = (sold[it.name] || 0) + it.qty; }));
    const topP = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.getElementById('top-products-list').innerHTML = topP.length ? `
    <table style="width:100%;border-collapse:collapse;font-size:13.5px">
      <thead><tr><th style="text-align:left;padding:8px 0;font-size:11.5px;color:var(--text3);font-weight:500;text-transform:uppercase;letter-spacing:.4px">Product</th><th style="text-align:right;padding:8px 0;font-size:11.5px;color:var(--text3);font-weight:500;text-transform:uppercase;letter-spacing:.4px">Qty Sold</th></tr></thead>
      <tbody>${topP.map(([name, qty]) => `<tr><td style="padding:10px 0;border-top:1px solid var(--border)">${name}</td><td style="text-align:right;padding:10px 0;border-top:1px solid var(--border);font-family:var(--mono)">${qty}</td></tr>`).join('')}</tbody>
    </table>
  ` : '<div class="empty-state">No sales data</div>';
}

// ──────────────────────────────────────────────
// PRODUCTS
// ──────────────────────────────────────────────
function renderProducts() {
    const q = (document.getElementById('product-search').value || '').toLowerCase();
    const cf = document.getElementById('category-filter').value;
    let list = products.filter(p => {
        const matchQ = !q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
        const matchC = !cf || p.cat === cf;
        return matchQ && matchC;
    });
    const tbody = document.getElementById('products-table');
    if (!list.length) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">No products found</div></td></tr>'; return; }
    tbody.innerHTML = list.map(p => {
        const cat = categories.find(c => c.id === p.cat);
        const low = p.stock <= p.lowStock;
        const statusBadge = low ? `<span class="badge badge-orange">Low Stock</span>` : `<span class="badge badge-green">In Stock</span>`;
        return `<tr>
      <td><strong style="font-size:13.5px">${p.name}</strong>${p.sku ? `<br><span style="font-size:11px;color:var(--text3)">${p.sku}</span>` : ''}</td>
      <td><span class="badge badge-blue">${cat ? cat.name : '—'}</span></td>
      <td style="font-family:var(--mono)">₹${fmt(p.price)}</td>
      <td style="font-family:var(--mono)">${p.stock} ${p.unit}</td>
      <td>${p.unit}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn btn-sm" style="border:1px solid var(--danger-light);color:var(--danger);background:transparent;margin-left:4px" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>`;
    }).join('');
}

function populateCategoryFilter() {
    const sel = document.getElementById('category-filter');
    const cur = sel.value;
    sel.innerHTML = '<option value="">All Categories</option>' + categories.map(c => `<option value="${c.id}"${c.id === cur ? ' selected' : ''}>${c.name}</option>`).join('');
}

function populateProductCatSelect() {
    const sel = document.getElementById('p-cat');
    sel.innerHTML = '<option value="">Select…</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function openModal(id) {
    document.getElementById(id).classList.add('open');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingProductId = id;
    populateProductCatSelect();
    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-cat').value = p.cat;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-stock').value = p.stock;
    document.getElementById('p-unit').value = p.unit;
    document.getElementById('p-lowstock').value = p.lowStock;
    document.getElementById('p-sku').value = p.sku || '';
    openModal('product-modal');
}

function saveProduct() {
    const name = document.getElementById('p-name').value.trim();
    const cat = document.getElementById('p-cat').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const stock = parseInt(document.getElementById('p-stock').value);
    const unit = document.getElementById('p-unit').value;
    const lowStock = parseInt(document.getElementById('p-lowstock').value) || 5;
    const sku = document.getElementById('p-sku').value.trim();
    if (!name || !cat || isNaN(price) || isNaN(stock)) { toast('Please fill all required fields'); return; }
    if (editingProductId) {
        const idx = products.findIndex(p => p.id === editingProductId);
        products[idx] = { ...products[idx], name, cat, price, stock, unit, lowStock, sku };
    } else {
        products.push({ id: 'p' + Date.now(), name, cat, price, stock, unit, lowStock, sku });
    }
    saveData(); closeModal('product-modal'); editingProductId = null;
    renderProducts(); checkLowStock();
    document.getElementById('product-modal-title').textContent = 'Add Product';
    ['p-name', 'p-price', 'p-stock', 'p-sku'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('p-lowstock').value = '5';
    toast(editingProductId ? 'Product updated' : 'Product added');
}

function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    products = products.filter(p => p.id !== id);
    saveData(); renderProducts(); checkLowStock();
    toast('Product deleted');
}

// ──────────────────────────────────────────────
// BILLING
// ──────────────────────────────────────────────
function populateBillingProducts() {
    const sel = document.getElementById('bill-product');
    const available = products.filter(p => p.stock > 0);
    sel.innerHTML = '<option value="">Select product…</option>' + available.map(p => `<option value="${p.id}">${p.name} — ₹${p.price}/${p.unit} (Stock: ${p.stock})</option>`).join('');
}

function setBillQtyMax() {
    const pid = document.getElementById('bill-product').value;
    const p = products.find(x => x.id === pid);
    if (p) { document.getElementById('bill-qty').max = p.stock; document.getElementById('bill-qty').value = 1; }
}

function addBillItem() {
    const pid = document.getElementById('bill-product').value;
    const qty = parseInt(document.getElementById('bill-qty').value) || 1;
    if (!pid) { toast('Select a product'); return; }
    const p = products.find(x => x.id === pid);
    if (!p) return;
    if (qty > p.stock) { toast(`Only ${p.stock} ${p.unit} available`); return; }
    const existing = billItems.find(it => it.pid === pid);
    if (existing) {
        if (existing.qty + qty > p.stock) { toast('Not enough stock'); return; }
        existing.qty += qty;
    } else {
        billItems.push({ pid, name: p.name, price: p.price, qty, unit: p.unit });
    }
    renderBillSummary();
    document.getElementById('bill-product').value = '';
    document.getElementById('bill-qty').value = 1;
    toast(`${p.name} added`);
}

function renderBillSummary() {
    const list = document.getElementById('bill-items-list');
    if (!billItems.length) {
        list.innerHTML = '<div class="empty-state" style="padding:20px"><div>No items added yet</div></div>';
        document.getElementById('bill-totals').style.display = 'none';
        return;
    }
    list.innerHTML = billItems.map((it, i) => `
    <div class="bill-item-row">
      <div>
        <div style="font-size:13px;font-weight:500">${it.name}</div>
        <div style="font-size:11.5px;color:var(--text3)">₹${it.price} × ${it.qty} ${it.unit}</div>
      </div>
      <div style="font-family:var(--mono);font-size:13px;font-weight:500">₹${fmt(it.price * it.qty)}</div>
      <input type="number" class="form-input" value="${it.qty}" min="1" style="width:70px" onchange="updateItemQty(${i},this.value)">
      <button onclick="removeItem(${i})" style="background:none;border:none;cursor:pointer;color:var(--danger);font-size:18px;line-height:1">×</button>
    </div>
  `).join('') + '<div style="margin-bottom:14px"></div>';
    document.getElementById('bill-totals').style.display = 'block';
    updateBillTotals();
}

function updateItemQty(i, val) {
    const qty = parseInt(val) || 1;
    const p = products.find(x => x.id === billItems[i].pid);
    if (p && qty > p.stock) { toast('Not enough stock'); billItems[i].qty = p.stock; }
    else billItems[i].qty = qty;
    renderBillSummary();
}

function removeItem(i) { billItems.splice(i, 1); renderBillSummary(); }

function updateBillTotals() {
    const subtotal = billItems.reduce((s, it) => s + (it.price * it.qty), 0);
    const discount = parseFloat(document.getElementById('bill-discount').value) || 0;
    const discounted = subtotal * (1 - discount / 100);
    const tax = discounted * 0.05;
    const total = discounted + tax;
    document.getElementById('bill-subtotal').textContent = '₹' + fmt(subtotal);
    document.getElementById('bill-tax').textContent = '₹' + fmt(tax);
    document.getElementById('bill-grand').textContent = '₹' + fmt(total);
}

function clearBill() { billItems = []; document.getElementById('bill-discount').value = 0; renderBillSummary(); }

function generateBill() {
    if (!billItems.length) { toast('Add items to the bill'); return; }
    const customer = document.getElementById('bill-customer').value.trim() || 'Walk-in';
    const phone = document.getElementById('bill-phone').value.trim();
    const subtotal = billItems.reduce((s, it) => s + (it.price * it.qty), 0);
    const discount = parseFloat(document.getElementById('bill-discount').value) || 0;
    const discounted = subtotal * (1 - discount / 100);
    const tax = discounted * 0.05;
    const total = discounted + tax;
    const num = billCounter++;
    const now = Date.now();
    // Deduct stock
    billItems.forEach(it => {
        const p = products.find(x => x.id === it.pid);
        if (p) p.stock = Math.max(0, p.stock - it.qty);
    });
    const bill = { id: 'b' + now, num, date: now, customer, phone, items: [...billItems], subtotal, discount, tax, total };
    bills.unshift(bill);
    saveData();
    // Show receipt
    document.getElementById('receipt-content').innerHTML = buildReceipt(bill);
    openModal('receipt-modal');
    billItems = []; document.getElementById('bill-discount').value = 0;
    document.getElementById('bill-customer').value = '';
    document.getElementById('bill-phone').value = '';
    renderBillSummary(); populateBillingProducts(); checkLowStock();
    toast('Bill #' + num + ' generated!');
}

function buildReceipt(bill) {
    const line = (l, r) => `<div style="display:flex;justify-content:space-between"><span>${l}</span><span>${r}</span></div>`;
    return `
    <div style="text-align:center;margin-bottom:10px">
      <div style="font-size:15px;font-weight:600">🛒 FreshMart</div>
      <div style="font-size:11px;color:var(--text3)">GST Bill · Thank you for shopping!</div>
    </div>
    <div class="receipt-divider"></div>
    ${line('Bill #', bill.num)}
    ${line('Date', new Date(bill.date).toLocaleString('en-IN'))}
    ${line('Customer', bill.customer)}
    ${bill.phone ? line('Phone', bill.phone) : ''}
    <div class="receipt-divider"></div>
    ${bill.items.map(it => line(`${it.name} × ${it.qty} ${it.unit}`, '₹' + fmt(it.price * it.qty))).join('')}
    <div class="receipt-divider"></div>
    ${line('Subtotal', '₹' + fmt(bill.subtotal))}
    ${bill.discount ? line('Discount (' + bill.discount + '%)', '−₹' + fmt(bill.subtotal * bill.discount / 100)) : ''}
    ${line('GST (5%)', '₹' + fmt(bill.tax))}
    <div class="receipt-divider"></div>
    <div style="display:flex;justify-content:space-between;font-weight:600;font-size:14px">${line('TOTAL', '₹' + fmt(bill.total))}</div>
    <div class="receipt-divider"></div>
    <div style="text-align:center;font-size:11px;color:var(--text3);margin-top:8px">Visit again! · FreshMart</div>
  `;
}

function printBill() { window.print(); }

// ──────────────────────────────────────────────
// BILLS HISTORY
// ──────────────────────────────────────────────
function renderBills() {
    const q = (document.getElementById('bill-search').value || '').toLowerCase();
    let list = bills.filter(b => !q || b.customer.toLowerCase().includes(q) || String(b.num).includes(q));
    list = [...list].sort((a, b) => b.date - a.date);
    document.getElementById('bills-total-display').textContent = `${list.length} bill(s) · ₹${fmt(list.reduce((s, b) => s + b.total, 0))} total`;
    const tbody = document.getElementById('bills-table');
    if (!list.length) { tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state">No bills found</div></td></tr>'; return; }
    tbody.innerHTML = list.map(b => `
    <tr>
      <td><span style="font-family:var(--mono);font-weight:500">#${b.num}</span></td>
      <td>${new Date(b.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
      <td>${b.customer}${b.phone ? `<br><span style="font-size:11px;color:var(--text3)">${b.phone}</span>` : ''}</td>
      <td>${b.items.length} item(s)</td>
      <td style="font-family:var(--mono);font-weight:500">₹${fmt(b.total)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewBill('${b.id}')">View</button>
        <button class="btn btn-sm" style="border:1px solid var(--danger-light);color:var(--danger);background:transparent;margin-left:4px" onclick="deleteBill('${b.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function viewBill(id) {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;
    document.getElementById('bill-detail-title').textContent = 'Bill #' + bill.num;
    document.getElementById('bill-detail-content').innerHTML = buildReceipt(bill);
    openModal('bill-detail-modal');
}
function deleteBill(id) {
    if (!confirm('Delete this bill?')) return;
    bills = bills.filter(b => b.id !== id);
    saveData(); renderBills(); toast('Bill deleted');
}
function printBillDetail() { window.print(); }

// ──────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────
function renderCategories() {
    const tbody = document.getElementById('categories-table');
    if (!categories.length) { tbody.innerHTML = '<tr><td colspan="3"><div class="empty-state">No categories yet</div></td></tr>'; return; }
    tbody.innerHTML = categories.map(c => {
        const count = products.filter(p => p.cat === c.id).length;
        return `<tr>
      <td><strong>${c.name}</strong></td>
      <td>${count} product(s)</td>
      <td>
        <button class="btn btn-sm" style="border:1px solid var(--danger-light);color:var(--danger);background:transparent" onclick="deleteCategory('${c.id}')">Delete</button>
      </td>
    </tr>`;
    }).join('');
}

function saveCategory() {
    const name = document.getElementById('cat-name').value.trim();
    if (!name) { toast('Enter a category name'); return; }
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) { toast('Category already exists'); return; }
    categories.push({ id: 'c' + Date.now(), name });
    saveData(); closeModal('category-modal');
    document.getElementById('cat-name').value = '';
    renderCategories(); populateCategoryFilter();
    toast('Category added');
}

function deleteCategory(id) {
    if (products.find(p => p.cat === id)) { toast('Remove all products in this category first'); return; }
    if (!confirm('Delete this category?')) return;
    categories = categories.filter(c => c.id !== id);
    saveData(); renderCategories(); populateCategoryFilter();
    toast('Category deleted');
}

// ──────────────────────────────────────────────
// LOW STOCK CHECK
// ──────────────────────────────────────────────
function checkLowStock() {
    const low = products.filter(p => p.stock <= p.lowStock);
    const badge = document.getElementById('low-stock-count');
    const alert = document.getElementById('low-stock-alert');
    const msg = document.getElementById('low-stock-msg');
    if (low.length) {
        badge.style.display = 'inline-block'; badge.textContent = low.length;
        alert.style.display = 'flex';
        msg.textContent = `${low.length} item(s) are running low on stock`;
    } else {
        badge.style.display = 'none'; alert.style.display = 'none';
    }
}

// ──────────────────────────────────────────────
// UTILS
// ──────────────────────────────────────────────
function fmt(n) { return parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// Open product modal → populate cats
document.querySelector('[onclick="openModal(\'product-modal\')"]').addEventListener('click', () => {
    editingProductId = null;
    populateProductCatSelect();
    document.getElementById('product-modal-title').textContent = 'Add Product';
    ['p-name', 'p-price', 'p-stock', 'p-sku'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('p-lowstock').value = '5';
});

// Set date in topbar
document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

// INIT
checkLowStock();
renderDashboard();
populateCategoryFilter();

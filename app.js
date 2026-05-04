// ═══════════════════════════════════════════════════
// ArchitexIQ — app.js
// Core App Logic: Navigation, Calculator, Labour, Planner, Stats
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════
const S = {
  tab: 'calc',
  mixRatio: '1:2:4',
  selectedTemplate: null,
  calcResult: null,
  labourWorkers: [
    { role: 'Fundi (Mason)',  rate: 1800, qty: 2 },
    { role: 'Carpenter',      rate: 2000, qty: 1 },
    { role: 'Labourer',       rate: 800,  qty: 4 },
    { role: 'Plumber',        rate: 2500, qty: 1 },
    { role: 'Electrician',    rate: 2500, qty: 1 },
    { role: 'Painter',        rate: 1500, qty: 2 },
  ],
  labourDays: 30,
  planResult: null,
  scanResult: null,
  chatMessages: [],
  chatLoading: false,
};

// ═══════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════
function fmt(n)    { return Number(n || 0).toLocaleString('en-KE'); }
function fmtKES(n) { return 'KES ' + fmt(n); }
function getDefaultPrices() {
  const settings = JSON.parse(localStorage.getItem('aiq_settings') || '{}');
  return settings.defaultPrices || {
    cement: 750, sand: 2500, ballast: 3000,
    stone: 25, steel: 800, brc: 3500
  };
}

// ═══════════════════════════════════════════════════
// STATUS TIME
// ═══════════════════════════════════════════════════
function updateTime() {
  const now = new Date();
  const el = document.getElementById('statusTime');
  if (el) el.textContent =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');
}
updateTime();
setInterval(updateTime, 10000);

// ═══════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════
function navigate(tab) {
  S.tab = tab;

  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeBtn = document.getElementById('nav-' + tab);
  if (activeBtn) activeBtn.classList.add('active');

  // Scroll to top
  const scrollArea = document.getElementById('scrollArea');
  if (scrollArea) scrollArea.scrollTop = 0;

  render();
}

// ═══════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════
function render() {
  const c = document.getElementById('pageContent');
  if (!c) return;

  c.className = 'page-content fade-up';
  void c.offsetWidth; // Force reflow for animation

  switch (S.tab) {
    case 'calc':     c.innerHTML = renderCalc();     break;
    case 'labour':   c.innerHTML = renderLabour();   break;
    case 'planner':  c.innerHTML = renderPlanner();  break;
    case 'learn':    c.innerHTML = renderLearn();    break;
    case 'stats':    c.innerHTML = renderStats();    break;
    case 'settings': c.innerHTML = renderSettings(); break;
    case 'scan':     c.innerHTML = renderScanner();  break;
    default:         c.innerHTML = renderCalc();
  }

  // Draw charts after render
  setTimeout(() => {
    if (S.tab === 'calc' && S.calcResult)  { drawPieChart(); drawBarChart(); }
    if (S.tab === 'labour')                { drawLabourChart(); }
    if (S.tab === 'stats')                 { drawScoreChart(); }
    if (S.tab === 'settings') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const toggle = document.getElementById('themeToggle');
      if (toggle) toggle.classList.toggle('on', isDark);
    }
  }, 50);
}

// ═══════════════════════════════════════════════════
// CALCULATOR — Input Helpers
// ═══════════════════════════════════════════════════
const TEMPLATES = {
  room:       { l: 4,  w: 3,   t: 3,    type: 'wall',       qty: 1 },
  '2bed':     { l: 10, w: 8,   t: 3,    type: 'wall',       qty: 1 },
  perimeter:  { l: 30, w: 0.15,t: 2,    type: 'wall',       qty: 1 },
  slab:       { l: 5,  w: 4,   t: 0.15, type: 'slab',       qty: 1 },
  foundation: { l: 20, w: 0.6, t: 0.9,  type: 'foundation', qty: 1 },
  column:     { l: 0.3,w: 0.3, t: 3,    type: 'column',     qty: 8 },
};

const TMPL_LIST = [
  ['room',       '🏠', 'Single Room',    '4×3×3m'],
  ['2bed',       '🏡', '2-Bedroom',      '10×8×3m'],
  ['perimeter',  '🧱', 'Perimeter',      '30m×2m'],
  ['slab',       '⬛', 'Floor Slab',     '5×4×0.15m'],
  ['foundation', '🏗️', 'Foundation',    '20×0.6×0.9m'],
  ['column',     '🏛️', 'Columns ×8',   '0.3×0.3×3m'],
];

function loadTemplate(key) {
  const t = TEMPLATES[key];
  if (!t) return;
  S.selectedTemplate = key;

  // Set form values
  setVal('inL', t.l);
  setVal('inW', t.w);
  setVal('inT', t.t);
  setVal('inQty', t.qty);
  const sel = document.getElementById('structType');
  if (sel) sel.value = t.type;

  showToast('✅ Template loaded!');
  // Re-render template buttons only
  document.querySelectorAll('.template-card').forEach(el => {
    el.classList.toggle('active', el.dataset.key === key);
  });
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function setMix(m) {
  S.mixRatio = m;
  document.querySelectorAll('.mix-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.mix === m);
  });
}

// ═══════════════════════════════════════════════════
// CALCULATOR — Validation
// ═══════════════════════════════════════════════════
function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? parseFloat(el.value) : 0;
}

function validateInputs(L, W, T, qty) {
  const errors = [];

  if (!L || L <= 0)    errors.push('Length must be greater than 0');
  if (!W || W <= 0)    errors.push('Width must be greater than 0');
  if (!T || T <= 0)    errors.push('Thickness must be greater than 0');
  if (!qty || qty < 1) errors.push('Quantity must be at least 1');
  if (L > 500)         errors.push('Length seems too large (max 500m)');
  if (W > 500)         errors.push('Width seems too large (max 500m)');
  if (T > 10)          errors.push('Thickness seems too large (max 10m)');

  return errors;
}

// ═══════════════════════════════════════════════════
// CALCULATOR — Core Calculation
// ═══════════════════════════════════════════════════
function getInputs() {
  return {
    L:    getInputValue('inL'),
    W:    getInputValue('inW'),
    T:    getInputValue('inT'),
    qty:  parseInt(document.getElementById('inQty')?.value) || 1,
    type: document.getElementById('structType')?.value || 'slab',
  };
}

function getPriceInputs() {
  return {
    cement: getInputValue('pC') || 750,
    sand:   getInputValue('pS') || 2500,
    ballast:getInputValue('pB') || 3000,
    stone:  getInputValue('pSt')|| 25,
    steel:  getInputValue('pSteel') || 800,
    brc:    getInputValue('pBRC')   || 3500,
  };
}

function calculateMaterials(L, W, T, qty, mix, type) {
  const parts = mix.split(':').map(Number);
  const [c, s, b] = parts;
  const total = c + s + b;

  const wetVol = L * W * T * qty;
  const dryVol = wetVol * 1.54;

  // Safety factor: 1.05 for standard, 1.10 for structural
  const safetyFactor = (type === 'column' || type === 'ring') ? 1.10 : 1.05;

  const cementBags = Math.ceil((c / total) * dryVol / 0.035 * safetyFactor);
  const sandM3     = parseFloat(((s / total) * dryVol * safetyFactor).toFixed(2));
  const ballastM3  = parseFloat(((b / total) * dryVol * safetyFactor).toFixed(2));

  // Steel reinforcement (improved formulas)
  let steelBars = 0;
  if (type === 'slab') {
    // Y12 bars at 200mm spacing both ways
    steelBars = Math.ceil((L * W * qty * 2) / (0.2 * 12) * 1.1);
  } else if (type === 'foundation') {
    // 4 bars per trench + links
    steelBars = Math.ceil(L * qty * 6 / 12);
  } else if (type === 'column') {
    // 4-8 bars per column
    steelBars = Math.ceil(T * qty * 6 / 12);
  } else if (type === 'ring') {
    steelBars = Math.ceil((L + W) * 2 * qty * 0.5 / 12);
  }

  // BRC mesh for slabs
  const brcSheets = type === 'slab'
    ? Math.ceil((L * W * qty) / (2.4 * 4.8) * 1.1)
    : 0;

  // Machine-cut stones for walls
  const stones = type === 'wall'
    ? Math.ceil(L * T * qty * 12.5 * 1.08) // 8% wastage
    : 0;

  return { cementBags, sandM3, ballastM3, steelBars, brcSheets, stones, wetVol, dryVol };
}

function calculateCosts(mats, prices) {
  const costC     = mats.cementBags * prices.cement;
  const costS     = mats.sandM3     * prices.sand;
  const costB     = mats.ballastM3  * prices.ballast;
  const costSteel = mats.steelBars  * prices.steel;
  const costBRC   = mats.brcSheets  * prices.brc;
  const costStn   = mats.stones     * prices.stone;
  const subTotal  = costC + costS + costB + costSteel + costBRC + costStn;
  const wastage   = Math.ceil(subTotal * 0.10);
  const total     = subTotal + wastage;
  return { costC, costS, costB, costSteel, costBRC, costStn, wastage, total };
}

function doCalculate() {
  const { L, W, T, qty, type } = getInputs();
  const prices = getPriceInputs();

  // Validate
  const errors = validateInputs(L, W, T, qty);
  if (errors.length > 0) {
    showToast('⚠️ ' + errors[0]);
    return;
  }

  const mats  = calculateMaterials(L, W, T, qty, S.mixRatio, type);
  const costs = calculateCosts(mats, prices);

  S.calcResult = {
    L, W, T, qty, type, mix: S.mixRatio,
    ...mats, ...costs, prices,
    date: new Date().toLocaleDateString('en-KE'),
  };

  // Save calc count
  const calcs = parseInt(localStorage.getItem('jp_calcs') || '0') + 1;
  localStorage.setItem('jp_calcs', calcs);

  render();
  setTimeout(() => {
    const el = document.querySelector('.total-box');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function saveProject() {
  if (!S.calcResult) return;
  const name = prompt('Project name:', 'Project ' + (getProjects().length + 1));
  if (!name) return;
  const projects = getProjects();
  projects.unshift({ ...S.calcResult, name });
  if (projects.length > 15) projects.pop();
  localStorage.setItem('jp_proj', JSON.stringify(projects));
  showToast('✅ Project saved!');
  render();
}

function getProjects() {
  return JSON.parse(localStorage.getItem('jp_proj') || '[]');
}

function shareWA() {
  if (!S.calcResult) return;
  const r = S.calcResult;
  const msg = `*ArchitexIQ Estimate* 🏗️\n\nStructure: ${r.type.toUpperCase()}\nDimensions: ${r.L}×${r.W}×${r.T}m (×${r.qty})\nMix Ratio: ${r.mix}\n\n*TOTAL COST: ${fmtKES(r.total)}*\n\n_ArchitexIQ — Calculate. Learn. Build. 🇰🇪_`;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// ═══════════════════════════════════════════════════
// CALCULATOR — Render
// ═══════════════════════════════════════════════════
function renderCalc() {
  const r = S.calcResult;
  const prices = getDefaultPrices();

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">🇰🇪 Kenya Construction</div>
    <h1 class="hero-title">Material <span class="gold">Estimator</span></h1>
    <p class="hero-sub">Accurate quantities & costs — Calculate. Learn. Build.</p>
  </div>

  <!-- SCAN PLAN -->
  <div class="card card-gold" style="cursor:pointer;margin-bottom:12px;" onclick="S.tab='scan';render()">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="font-size:2rem;">📸</div>
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:var(--gold3);">Scan Building Plan</div>
        <div style="font-size:0.72rem;color:var(--muted2);">Upload a plan → AI auto-estimates materials</div>
      </div>
      <div style="margin-left:auto;color:var(--gold);font-size:1.2rem;">›</div>
    </div>
  </div>

  <!-- TEMPLATES -->
  <div class="section-header">Quick Templates</div>
  <div class="template-scroll">
    ${TMPL_LIST.map(([key, icon, name, size]) => `
      <div class="template-card ${S.selectedTemplate === key ? 'active' : ''}" data-key="${key}" onclick="loadTemplate('${key}')">
        <div class="t-icon">${icon}</div>
        <div class="t-name">${name}</div>
        <div class="t-size">${size}</div>
      </div>`).join('')}
  </div>

  <!-- FORM -->
  <div class="card">
    <div class="card-title"><div class="card-icon">🔢</div>Calculate Materials</div>
    <div class="form-group">
      <label class="form-label">Structure Type</label>
      <select id="structType">
        <option value="slab">Floor Slab</option>
        <option value="wall">Wall (Machine-cut Stones)</option>
        <option value="column">Columns / Beams</option>
        <option value="foundation">Strip Foundation</option>
        <option value="ring">Ring Beam</option>
      </select>
    </div>
    <div class="grid3">
      <div class="form-group">
        <label class="form-label">Length (m)</label>
        <input type="number" id="inL" value="${r ? r.L : 5}" step="0.1" min="0.1" max="500">
        <div class="field-error" id="err-L"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Width (m)</label>
        <input type="number" id="inW" value="${r ? r.W : 4}" step="0.1" min="0.1" max="500">
        <div class="field-error" id="err-W"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Thick (m)</label>
        <input type="number" id="inT" value="${r ? r.T : 0.15}" step="0.01" min="0.01" max="10">
        <div class="field-error" id="err-T"></div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Quantity</label>
      <input type="number" id="inQty" value="${r ? r.qty : 1}" min="1" max="1000">
    </div>
    <div class="form-group">
      <label class="form-label">Mix Ratio</label>
      <div class="mix-pills">
        ${['1:2:4', '1:3:6', '1:1.5:3', '1:4:8'].map(m => `
          <div class="mix-pill ${S.mixRatio === m ? 'active' : ''}" data-mix="${m}" onclick="setMix('${m}')">${m}</div>`).join('')}
      </div>
    </div>
    <div class="section-header">Market Prices (KES)</div>
    <div class="grid2">
      <div class="form-group"><label class="form-label">Cement /bag</label><input type="number" id="pC" value="${prices.cement}" min="1"></div>
      <div class="form-group"><label class="form-label">Sand /m³</label><input type="number" id="pS" value="${prices.sand}" min="1"></div>
      <div class="form-group"><label class="form-label">Ballast /m³</label><input type="number" id="pB" value="${prices.ballast}" min="1"></div>
      <div class="form-group"><label class="form-label">Stones /pc</label><input type="number" id="pSt" value="${prices.stone}" min="1"></div>
      <div class="form-group"><label class="form-label">Steel Y12 /bar</label><input type="number" id="pSteel" value="${prices.steel}" min="1"></div>
      <div class="form-group"><label class="form-label">BRC /sheet</label><input type="number" id="pBRC" value="${prices.brc}" min="1"></div>
    </div>
    <button class="btn btn-gold" onclick="doCalculate()" style="margin-top:6px;">⚡ Calculate Now</button>
  </div>

  ${r ? renderResults(r) : ''}

  <div class="section-header">Saved Projects</div>
  ${renderSavedProjects()}
  `;
}

function renderResults(r) {
  const items = [
    ['🏗️', 'Cement',  r.cementBags, 'bags'],
    ['🟡', 'Sand',    r.sandM3,     'm³'],
    ['⚫', 'Ballast', r.ballastM3,  'm³'],
    ...(r.stones    > 0 ? [['🧱', 'Stones', r.stones,    'pcs']]   : []),
    ...(r.steelBars > 0 ? [['🔩', 'Steel',  r.steelBars, 'bars']]  : []),
    ...(r.brcSheets > 0 ? [['🕸️', 'BRC',   r.brcSheets, 'sheets']] : []),
  ];

  const boqRows = [
    ['🏗️ Cement (50kg)', r.cementBags, 'bags',   r.prices.cement, r.costC],
    ['🟡 Quarry Sand',   r.sandM3,     'm³',     r.prices.sand,   r.costS],
    ['⚫ Ballast',        r.ballastM3,  'm³',     r.prices.ballast,r.costB],
    ...(r.stones    > 0 ? [['🧱 M/C Stones', r.stones,    'pcs',    r.prices.stone, r.costStn]]   : []),
    ...(r.steelBars > 0 ? [['🔩 Steel Y12',  r.steelBars, 'bars',   r.prices.steel, r.costSteel]] : []),
    ...(r.brcSheets > 0 ? [['🕸️ BRC Mesh',  r.brcSheets, 'sheets', r.prices.brc,   r.costBRC]]   : []),
    ['⚠️ Wastage (10%)', '', '', '', r.wastage],
  ];

  return `
  <div class="section-header">Results</div>
  <div class="total-box">
    <div class="total-label">Total Estimated Cost</div>
    <div class="total-amount">${fmtKES(r.total)}</div>
    <div class="total-sub">Volume: ${r.wetVol.toFixed(3)} m³ · Mix: ${r.mix} · Safety factor included</div>
  </div>

  <div class="result-grid">
    ${items.map(([icon, lbl, val, unit]) => `
      <div class="result-item">
        <div class="result-val">${val}</div>
        <div class="result-unit">${unit}</div>
        <div class="result-lbl">${icon} ${lbl}</div>
      </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">📊</div>Cost Breakdown</div>
    <div class="chart-wrap"><canvas id="pieChart" height="200"></canvas></div>
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">📈</div>Material Quantities</div>
    <div class="chart-wrap"><canvas id="barChart" height="150"></canvas></div>
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">📄</div>BOQ Breakdown</div>
    <div style="overflow-x:auto;">
      <table class="boq-table">
        <thead><tr><th>Material</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          ${boqRows.map(([m, q, u, up, cost]) => `
            <tr>
              <td>${m}</td>
              <td>${q} ${u}</td>
              <td>${up ? fmtKES(up) : ''}</td>
              <td class="amt">${fmtKES(cost)}</td>
            </tr>`).join('')}
          <tr>
            <td colspan="3" style="font-weight:700;color:var(--text);">TOTAL</td>
            <td class="amt" style="font-size:1rem;">${fmtKES(r.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="btn-row" style="margin-bottom:8px;">
    <button class="btn btn-ghost" onclick="saveProject()">💾 Save Project</button>
    <button class="btn btn-outline" onclick="shareWA()">📱 WhatsApp</button>
  </div>
  <button class="btn btn-outline" onclick="S.calcResult=null;render()">🔄 New Calculation</button>
  `;
}

function renderSavedProjects() {
  const projects = getProjects();
  if (!projects.length) return '<div class="empty"><div class="e-icon">📁</div><p>No saved projects yet</p></div>';
  return projects.map(p => `
    <div class="project-row">
      <div>
        <div class="pr-name">${p.name}</div>
        <div class="pr-meta">${p.type} · ${p.date}</div>
      </div>
      <div class="pr-amount">${fmtKES(p.total)}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════
// LABOUR
// ═══════════════════════════════════════════════════
function changeWorkerQty(i, d) {
  S.labourWorkers[i].qty = Math.max(0, S.labourWorkers[i].qty + d);
  // Update just the display without full re-render
  const qtyEl = document.getElementById('wqty_' + i);
  const infoEl = document.getElementById('winfo_' + i);
  if (qtyEl) qtyEl.textContent = S.labourWorkers[i].qty;
  const w = S.labourWorkers[i];
  if (infoEl) infoEl.textContent = w.qty > 0
    ? fmtKES(w.rate * w.qty * S.labourDays) + ' total'
    : 'Not included';
  updateLabourTotal();
}

function updateLabourTotal() {
  const active = S.labourWorkers.filter(w => w.qty > 0);
  const total  = active.reduce((a, w) => a + w.rate * w.qty * S.labourDays, 0);
  const el = document.getElementById('labourTotalAmount');
  if (el) el.textContent = fmtKES(total);
  drawLabourChart();
}

function addCustomWorker() {
  const role = document.getElementById('cwRole')?.value.trim();
  const rate = parseFloat(document.getElementById('cwRate')?.value) || 0;
  if (!role) { showToast('⚠️ Enter worker role'); return; }
  if (!rate || rate <= 0) { showToast('⚠️ Enter valid daily rate'); return; }
  if (rate > 50000) { showToast('⚠️ Rate seems too high'); return; }
  S.labourWorkers.push({ role, rate, qty: 1 });
  showToast('✅ Worker added!');
  render();
}

function shareLabourWA() {
  const active = S.labourWorkers.filter(w => w.qty > 0);
  const total  = active.reduce((a, w) => a + w.rate * w.qty * S.labourDays, 0);
  const lines  = active.map(w => `- ${w.role} ×${w.qty}: ${fmtKES(w.rate * w.qty * S.labourDays)}`).join('\n');
  const msg = `*ArchitexIQ Labour Estimate* 👷\n\nDuration: ${S.labourDays} days\n${lines}\n\n*TOTAL LABOUR: ${fmtKES(total)}*\n_ArchitexIQ Kenya 🇰🇪_`;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function renderLabour() {
  const active = S.labourWorkers.filter(w => w.qty > 0);
  const total  = active.reduce((a, w) => a + w.rate * w.qty * S.labourDays, 0);

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">Project Costs</div>
    <h1 class="hero-title">Labour <span class="gold">Calculator</span></h1>
    <p class="hero-sub">Estimate worker costs in Kenya Shillings</p>
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">⚙️</div>Project Settings</div>
    <div class="grid2">
      <div class="form-group">
        <label class="form-label">Duration (Days)</label>
        <input type="number" id="labDays" value="${S.labourDays}" min="1" max="3650"
          onchange="if(this.value>0 && this.value<=3650){S.labourDays=parseInt(this.value);updateLabourTotal();}">
      </div>
      <div class="form-group">
        <label class="form-label">Hours/Day</label>
        <input type="number" value="8" min="1" max="16">
      </div>
    </div>
  </div>

  <div class="section-header">Workers & Rates</div>
  ${S.labourWorkers.map((w, i) => `
    <div class="worker-card">
      <div class="worker-header">
        <div class="worker-role">👷 ${w.role}</div>
        <div class="worker-rate">${fmtKES(w.rate)}/day</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:0.75rem;color:var(--muted2);" id="winfo_${i}">
          ${w.qty > 0 ? fmtKES(w.rate * w.qty * S.labourDays) + ' total' : 'Not included'}
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeWorkerQty(${i}, -1)">−</button>
          <div class="qty-val" id="wqty_${i}">${w.qty}</div>
          <button class="qty-btn" onclick="changeWorkerQty(${i}, 1)">+</button>
        </div>
      </div>
    </div>`).join('')}

  <div class="card" style="margin-top:4px;">
    <div class="card-title"><div class="card-icon">➕</div>Add Custom Worker</div>
    <div class="grid2" style="margin-bottom:10px;">
      <div class="form-group">
        <label class="form-label">Role</label>
        <input id="cwRole" placeholder="e.g. Plumber">
      </div>
      <div class="form-group">
        <label class="form-label">Daily Rate (KES)</label>
        <input type="number" id="cwRate" placeholder="1500" min="100">
      </div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="addCustomWorker()">+ Add Worker</button>
  </div>

  <div class="total-box" style="margin-top:8px;">
    <div class="total-label">Total Labour Cost</div>
    <div class="total-amount" id="labourTotalAmount">${fmtKES(total)}</div>
    <div class="total-sub">${S.labourDays} days · ${active.length} active roles</div>
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">📊</div>Labour Breakdown</div>
    <div class="chart-wrap"><canvas id="labourChart" height="200"></canvas></div>
  </div>

  <button class="btn btn-outline" onclick="shareLabourWA()">📱 Share via WhatsApp</button>
  `;
}

// ═══════════════════════════════════════════════════
// PLANNER
// ═══════════════════════════════════════════════════
const PLAN_PHASES = {
  '1bed': [
    { name: 'Site Preparation', weeks: 1,  pct: 3,  color: '#4a9eff', tasks: ['Clear & level site', 'Set out building lines', 'Excavate topsoil'] },
    { name: 'Foundation',       weeks: 2,  pct: 15, color: '#c9a84c', tasks: ['Excavate trenches', 'Blinding concrete', 'Foundation walling'] },
    { name: 'Ground Slab',      weeks: 1,  pct: 10, color: '#9b59b6', tasks: ['DPC installation', 'BRC mesh laying', 'Concrete pour & cure'] },
    { name: 'Walling',          weeks: 3,  pct: 25, color: '#2ecc71', tasks: ['Stone laying', 'Lintels over openings', 'Ring beam'] },
    { name: 'Roofing',          weeks: 2,  pct: 20, color: '#e74c3c', tasks: ['Timber trusses', 'Roofing sheets', 'Gutters & downpipes'] },
    { name: 'Finishes',         weeks: 3,  pct: 27, color: '#f39c12', tasks: ['Plaster', 'Floor screed', 'Tiles', 'Paint', 'Doors & windows'] },
  ],
  '2bed': [
    { name: 'Site Preparation', weeks: 1,  pct: 2,  color: '#4a9eff', tasks: ['Clear site', 'Set out', 'Topsoil removal'] },
    { name: 'Foundation',       weeks: 3,  pct: 12, color: '#c9a84c', tasks: ['Deep excavation', 'Mass concrete', 'Foundation walls'] },
    { name: 'Ground Slab',      weeks: 2,  pct: 10, color: '#9b59b6', tasks: ['DPC & blinding', 'BRC reinforcement', 'Pour & 7-day cure'] },
    { name: 'Walling',          weeks: 5,  pct: 22, color: '#2ecc71', tasks: ['Stone laying', 'Lintels', 'Ring beam', 'Columns'] },
    { name: 'Roof Structure',   weeks: 3,  pct: 18, color: '#e74c3c', tasks: ['Trusses', 'Roofing sheets', 'Ridge & gutters'] },
    { name: 'Finishes & MEP',   weeks: 6,  pct: 36, color: '#f39c12', tasks: ['Plumbing', 'Electrical', 'Plaster', 'Tiles', 'Paint'] },
  ],
  '3bed': [
    { name: 'Site Prep',  weeks: 1, pct: 2,  color: '#4a9eff', tasks: ['Site clearing', 'Setting out'] },
    { name: 'Foundation', weeks: 4, pct: 12, color: '#c9a84c', tasks: ['Excavation', 'Concrete works'] },
    { name: 'Ground Slab',weeks: 2, pct: 8,  color: '#9b59b6', tasks: ['DPC', 'Reinforcement', 'Pour'] },
    { name: 'Walling',    weeks: 7, pct: 20, color: '#2ecc71', tasks: ['Stone laying', 'Ring beam'] },
    { name: 'Roof',       weeks: 4, pct: 16, color: '#e74c3c', tasks: ['Trusses', 'Sheeting'] },
    { name: 'Finishes',   weeks: 8, pct: 42, color: '#f39c12', tasks: ['MEP', 'Plaster', 'Tiles', 'Paint'] },
  ],
  perimeter: [
    { name: 'Setting Out', weeks: 1, pct: 5,  color: '#4a9eff', tasks: ['Survey', 'Mark boundary'] },
    { name: 'Foundation',  weeks: 2, pct: 25, color: '#c9a84c', tasks: ['Excavate trench', 'Foundation concrete'] },
    { name: 'Walling',     weeks: 4, pct: 55, color: '#2ecc71', tasks: ['Stone laying', 'Coping stones'] },
    { name: 'Finishing',   weeks: 1, pct: 15, color: '#f39c12', tasks: ['Render', 'Paint', 'Gate installation'] },
  ],
};

function generatePlan() {
  const name   = document.getElementById('planName')?.value || 'My Project';
  const type   = document.getElementById('planType')?.value || '2bed';
  const budget = parseFloat(document.getElementById('planBudget')?.value) || 500000;
  const startStr = document.getElementById('planStart')?.value;

  if (!budget || budget <= 0) { showToast('⚠️ Enter a valid budget'); return; }

  const phases = PLAN_PHASES[type];
  const totalWeeks = phases.reduce((a, p) => a + p.weeks, 0);
  const start = startStr ? new Date(startStr) : new Date();
  let weekCursor = 0;

  const detailed = phases.map(p => {
    const ps = new Date(start);
    ps.setDate(ps.getDate() + weekCursor * 7);
    const pe = new Date(ps);
    pe.setDate(pe.getDate() + p.weeks * 7);
    weekCursor += p.weeks;
    return { ...p, startDate: ps.toLocaleDateString('en-KE'), endDate: pe.toLocaleDateString('en-KE'), phBudget: Math.round(budget * p.pct / 100) };
  });

  S.planResult = { name, phases: detailed, totalWeeks, budget };
  render();
}

function sharePlanWA() {
  if (!S.planResult) return;
  const { name, phases, totalWeeks, budget } = S.planResult;
  const lines = phases.map(p => `- ${p.name}: ${p.weeks}w (${fmtKES(p.phBudget)})`).join('\n');
  const msg = `*${name} — Construction Plan* 🏗️\n\n${lines}\n\n*Total: ${totalWeeks} weeks | Budget: ${fmtKES(budget)}*\n_ArchitexIQ Kenya 🇰🇪_`;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function renderPlanner() {
  if (S.planResult) return renderPlanOutput();

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">Timeline</div>
    <h1 class="hero-title">Project <span class="gold">Planner</span></h1>
    <p class="hero-sub">Generate a full construction schedule & budget split</p>
  </div>
  <div class="card">
    <div class="card-title"><div class="card-icon">🏗️</div>Project Details</div>
    <div class="form-group">
      <label class="form-label">Project Name</label>
      <input id="planName" placeholder="e.g. My Dream Home" maxlength="100">
    </div>
    <div class="grid2">
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" id="planStart" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label class="form-label">Project Type</label>
        <select id="planType">
          <option value="1bed">Single Room</option>
          <option value="2bed" selected>2-Bedroom</option>
          <option value="3bed">3-Bedroom</option>
          <option value="perimeter">Perimeter Wall</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Total Budget (KES)</label>
      <input type="number" id="planBudget" value="500000" min="10000">
    </div>
    <button class="btn btn-gold" onclick="generatePlan()">🗺️ Generate Timeline</button>
  </div>
  `;
}

function renderPlanOutput() {
  const { name, phases, totalWeeks, budget } = S.planResult;
  const icons = ['📐', '🏗️', '⬛', '🧱', '🏠', '🎨', '🔧', '⚡'];

  return `
  <button class="back-btn" onclick="S.planResult=null;render()">← New Plan</button>
  <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:var(--gold3);margin-bottom:4px;">${name}</div>
  <div style="font-size:0.75rem;color:var(--muted2);margin-bottom:16px;">${totalWeeks} weeks · Budget: ${fmtKES(budget)}</div>

  <div class="section-header">Gantt Chart</div>
  <div class="gantt-wrap">
    <div class="gantt">
      ${phases.map((p, i) => {
        const offset = phases.slice(0, i).reduce((a, pp) => a + pp.weeks, 0);
        const left  = (offset / totalWeeks) * 100;
        const width = (p.weeks / totalWeeks) * 100;
        return `<div class="gantt-row">
          <div class="gantt-lbl">${p.name}</div>
          <div class="gantt-track">
            <div class="gantt-fill" style="left:${left}%;width:${width}%;background:${p.color};">${p.weeks}w</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="section-header">Phase Details</div>
  ${phases.map((p, i) => `
    <div class="phase-card" style="border-color:${p.color};">
      <div class="phase-header">
        <div class="phase-name">${icons[i] || '🔧'} ${p.name}</div>
        <div class="phase-badge">${p.weeks} week${p.weeks > 1 ? 's' : ''}</div>
      </div>
      <div style="font-size:0.68rem;color:var(--muted);margin-bottom:6px;">${p.startDate} → ${p.endDate}</div>
      <ul class="phase-tasks">
        ${p.tasks.map(t => `<li><span style="color:${p.color}">›</span>${t}</li>`).join('')}
      </ul>
      <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.72rem;">
        <span style="color:var(--muted);">Budget allocation</span>
        <span style="color:${p.color};font-weight:600;">${fmtKES(p.phBudget)} (${p.pct}%)</span>
      </div>
      <div style="height:4px;background:var(--card2);border-radius:4px;margin-top:6px;overflow:hidden;">
        <div style="height:100%;width:${p.pct}%;background:${p.color};border-radius:4px;"></div>
      </div>
    </div>`).join('')}

  <div class="btn-row" style="margin-top:4px;">
    <button class="btn btn-gold" onclick="sharePlanWA()">📱 Share Plan</button>
    <button class="btn btn-outline" onclick="S.planResult=null;render()">🔄 New Plan</button>
  </div>
  `;
}

// ═══════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════
function renderStats() {
  const progress = JSON.parse(localStorage.getItem('jp_prog')    || '{}');
  const scores   = JSON.parse(localStorage.getItem('jp_scores')  || '[]');
  const projects = getProjects();
  const calcs    = parseInt(localStorage.getItem('jp_calcs')     || '0');

  const lessons      = Object.keys(progress).filter(k => k.startsWith('m_')).length;
  const quizzesPassed= Object.keys(progress).filter(k => k.startsWith('q_') && progress[k] >= 60).length;
  const avg          = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const badges = [
    { icon: '🏗️', name: 'Builder',   earn: calcs >= 1 },
    { icon: '📐', name: 'Estimator', earn: calcs >= 5 },
    { icon: '📚', name: 'Student',   earn: lessons >= 1 },
    { icon: '🎯', name: 'Quiz Pro',  earn: quizzesPassed >= 1 },
    { icon: '🇰🇪', name: 'Kenyan',  earn: projects.length >= 1 },
    { icon: '⭐', name: 'Perfect',   earn: scores.includes(100) },
    { icon: '🐍', name: 'Pythonist', earn: progress['m_py7'] === 100 },
    { icon: '🔥', name: 'On Fire',   earn: scores.filter(s => s >= 80).length >= 3 },
    { icon: '💰', name: 'Saver',     earn: projects.length >= 3 },
    { icon: '🏆', name: 'Master',    earn: calcs >= 10 && lessons >= 5 },
  ];

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">Dashboard</div>
    <h1 class="hero-title">Your <span class="gold">Progress</span></h1>
  </div>

  <div class="stats-grid">
    <div class="stat-card"><div class="stat-val">${lessons}</div><div class="stat-lbl">Lessons Done</div></div>
    <div class="stat-card"><div class="stat-val">${quizzesPassed}</div><div class="stat-lbl">Quizzes Passed</div></div>
    <div class="stat-card"><div class="stat-val">${calcs}</div><div class="stat-lbl">Calculations</div></div>
    <div class="stat-card"><div class="stat-val">${avg}%</div><div class="stat-lbl">Avg Score</div></div>
  </div>

  <div class="card">
    <div class="card-title"><div class="card-icon">📈</div>Quiz Score History</div>
    <div class="chart-wrap"><canvas id="scoreChart" height="150"></canvas></div>
  </div>

  <div class="section-header">Achievements</div>
  <div class="badge-grid">
    ${badges.map(b => `
      <div class="badge-item ${b.earn ? 'earned' : ''}">
        ${b.icon}
        <div class="b-lbl">${b.name}</div>
      </div>`).join('')}
  </div>

  <div class="section-header" style="margin-top:16px;">Recent Projects</div>
  ${projects.length === 0
    ? '<div class="empty"><div class="e-icon">📐</div><p>No calculations yet</p></div>'
    : projects.slice(0, 5).map(p => `
      <div class="project-row">
        <div><div class="pr-name">${p.name}</div><div class="pr-meta">${p.type} · ${p.date}</div></div>
        <div class="pr-amount">${fmtKES(p.total)}</div>
      </div>`).join('')}
  `;
}

// ═══════════════════════════════════════════════════
// SCANNER
// ═══════════════════════════════════════════════════
function renderScanner() {
  return `
  <button class="back-btn" onclick="S.tab='calc';render()">← Back to Calculator</button>
  <div class="hero">
    <div class="hero-eyebrow">AI Powered</div>
    <h1 class="hero-title">Plan <span class="gold">Scanner</span></h1>
    <p class="hero-sub">Upload a building plan — AI reads & estimates materials automatically</p>
  </div>

  <div class="scanner-zone" id="scannerZone"
    onclick="document.getElementById('planFile').click()"
    ondragover="event.preventDefault();this.classList.add('drag')"
    ondragleave="this.classList.remove('drag')"
    ondrop="handleDrop(event)">
    <div class="scanner-icon">📐</div>
    <div class="scanner-title">Upload Building Plan</div>
    <div class="scanner-sub">Tap to choose image or drag & drop<br>Supports JPG, PNG</div>
  </div>
  <input type="file" id="planFile" accept="image/*" style="display:none" onchange="handleFileSelect(event)">

  <div class="card">
    <div class="card-title"><div class="card-icon">💡</div>Tips for Best Results</div>
    <div style="font-size:0.78rem;color:var(--muted2);line-height:1.8;">
      ✓ Use clear, well-lit photos of plans<br>
      ✓ Ensure dimensions are visible<br>
      ✓ Architectural drawings work best<br>
      ✓ Avoid blurry or angled shots
    </div>
  </div>

  ${S.scanResult ? renderScanResult() : ''}
  `;
}

function renderScanResult() {
  return `
  <div class="card">
    <div class="card-title"><div class="card-icon">📋</div>AI Scan Results</div>
    ${S.scanResult.items.map(i => `
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border2);font-size:0.8rem;">
        <span style="color:var(--muted2);">${i.label}</span>
        <span style="color:var(--gold);font-weight:600;">${i.value}</span>
      </div>`).join('')}
  </div>
  <button class="btn btn-gold" onclick="S.tab='calc';S.scanResult=null;render()">→ Go to Calculator</button>
  `;
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('scannerZone').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

async function processFile(file) {
  const zone = document.getElementById('scannerZone');
  zone.innerHTML = `
    <div class="loading">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
    <div style="text-align:center;font-size:0.78rem;color:var(--muted2);margin-top:8px;">AI is reading your plan...</div>`;

  const reader = new FileReader();
  reader.onload = async function(ev) {
    const base64 = ev.target.result.split(',')[1];
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: file.type || 'image/jpeg', data: base64 } },
              { type: 'text', text: `You are a Kenyan quantity surveyor. Analyze this building plan image. Respond ONLY with a JSON array (no markdown):
[{"label":"Structure Type","value":"2-Bedroom House"},{"label":"Est. Length","value":"10m"},{"label":"Est. Width","value":"8m"},{"label":"Est. Height","value":"3m"},{"label":"Floor Area","value":"~80 m²"},{"label":"Recommended Mix","value":"1:2:4"},{"label":"Est. Cement","value":"~120 bags"},{"label":"Est. Stones","value":"~1200 pcs"},{"label":"Est. Total Cost","value":"KES 280,000 - 350,000"}]` }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content.map(c => c.text || '').join('');
      let items;
      try {
        items = JSON.parse(text.replace(/```json|```/g, '').trim());
      } catch {
        items = [{ label: 'Note', value: 'Could not read plan clearly' }, { label: 'Tip', value: 'Try a clearer image' }];
      }
      S.scanResult = { items };
    } catch {
      S.scanResult = { items: [{ label: 'Error', value: 'Check your connection' }] };
    }
    render();
  };
  reader.readAsDataURL(file);
}

// ═══════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════
function drawPieChart() {
  const r = S.calcResult;
  if (!r) return;
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 200;

  const data   = [r.costC, r.costS, r.costB, r.costStn, r.costSteel, r.costBRC, r.wastage].filter(v => v > 0);
  const colors = ['#c9a84c', '#2ecc71', '#4a9eff', '#9b59b6', '#e74c3c', '#f39c12', '#95a5a6'];
  const total  = data.reduce((a, b) => a + b, 0);
  const cx = canvas.width / 2, cy = 95, R = 78;
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  data.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, start, start + slice); ctx.closePath();
    ctx.fillStyle = colors[i % colors.length]; ctx.fill();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#fff';
    ctx.lineWidth = 2; ctx.stroke();
    start += slice;
  });

  // Center hole
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card') || '#fff';
  ctx.fill();

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--gold') || '#c9a84c';
  ctx.font = 'bold 11px Cormorant Garamond,serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmtKES(r.total), cx, cy + 4);
}

function drawBarChart() {
  const r = S.calcResult;
  if (!r) return;
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 150;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const items  = [
    ['Cement', r.cementBags], ['Sand', r.sandM3], ['Ballast', r.ballastM3],
    ...(r.stones    > 0 ? [['Stones', r.stones]]    : []),
    ...(r.steelBars > 0 ? [['Steel',  r.steelBars]] : []),
  ];
  const colors = ['#c9a84c', '#2ecc71', '#4a9eff', '#9b59b6', '#e74c3c'];
  const maxV   = Math.max(...items.map(i => i[1]));
  const bW     = (canvas.width - 40) / (items.length * 2);

  items.forEach(([lbl, val], i) => {
    const x  = 20 + i * bW * 2 + bW * 0.3;
    const bH = (val / maxV) * 110;
    const y  = 125 - bH;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath(); ctx.roundRect(x, y, bW * 1.4, bH, 4); ctx.fill();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#888';
    ctx.font = '8px DM Sans'; ctx.textAlign = 'center';
    ctx.fillText(lbl, x + bW * 0.7, 142);
    ctx.fillStyle = colors[i % colors.length]; ctx.font = 'bold 9px DM Sans';
    ctx.fillText(val, x + bW * 0.7, y - 4);
  });
}

function drawLabourChart() {
  const canvas = document.getElementById('labourChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 200;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const active = S.labourWorkers.filter(w => w.qty > 0);
  if (!active.length) return;

  const values = active.map(w => w.rate * w.qty * S.labourDays);
  const maxV   = Math.max(...values);
  const colors = ['#c9a84c', '#2ecc71', '#4a9eff', '#9b59b6', '#e74c3c', '#f39c12'];
  const lW = 100, barH = 22, gap = 8;

  active.forEach((w, i) => {
    const y  = i * (barH + gap) + 10;
    ctx.fillStyle = '#00000020';
    ctx.fillRect(lW, y, canvas.width - lW - 10, barH);
    const bW = ((values[i] / maxV) * (canvas.width - lW - 10));
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath(); ctx.roundRect(lW, y, bW, barH, 4); ctx.fill();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted2') || '#888';
    ctx.font = '9px DM Sans'; ctx.textAlign = 'right';
    ctx.fillText(w.role.split('(')[0].trim(), lW - 5, y + 15);
    if (bW > 50) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 9px DM Sans'; ctx.textAlign = 'left';
      ctx.fillText(fmtKES(values[i]), lW + 5, y + 15);
    }
  });
}

function drawScoreChart() {
  const canvas = document.getElementById('scoreChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 150;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const vals = JSON.parse(localStorage.getItem('jp_scores') || '[]');
  if (vals.length < 2) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#888';
    ctx.font = '12px DM Sans'; ctx.textAlign = 'center';
    ctx.fillText('Complete quizzes to see your progress', canvas.width / 2, 75);
    return;
  }

  const pad = 20, w = canvas.width - pad * 2, h = canvas.height - pad * 2;
  const grad = ctx.createLinearGradient(0, pad, 0, pad + h);
  grad.addColorStop(0, 'rgba(201,168,76,0.25)');
  grad.addColorStop(1, 'rgba(201,168,76,0)');

  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad + (i / (vals.length - 1)) * w;
    const y = pad + h - (v / 100) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad + w, pad + h); ctx.lineTo(pad, pad + h);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath(); ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = 2.5;
  vals.forEach((v, i) => {
    const x = pad + (i / (vals.length - 1)) * w;
    const y = pad + h - (v / 100) * h;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  vals.forEach((v, i) => {
    const x = pad + (i / (vals.length - 1)) * w;
    const y = pad + h - (v / 100) * h;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#c9a84c'; ctx.fill();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#fff';
    ctx.font = 'bold 9px DM Sans'; ctx.textAlign = 'center';
    ctx.fillText(v + '%', x, y - 8);
  });
}

// ═══════════════════════════════════════════════════
// AI CHAT
// ═══════════════════════════════════════════════════
const SUGGESTIONS = [
  'How much cement for a 3-bed?',
  'Best foundation for black cotton soil?',
  'Estimate perimeter wall cost',
  'What causes concrete cracks?',
  'Labour cost for 2-bedroom?',
];

function openChat() {
  document.getElementById('chatOverlay').style.display = 'flex';
  document.getElementById('chatFab').style.display = 'none';
  if (!S.chatMessages.length) {
    S.chatMessages = [{
      role: 'assistant',
      text: "Habari! Mimi ni ArchitexIQ AI 🏗️\n\nI specialise in Kenya construction — materials, costs, calculations and planning. Niulize chochote!\n\n(Ask me anything about construction!)",
      time: getTime()
    }];
  }
  renderChat();
}

function closeChat() {
  document.getElementById('chatOverlay').style.display = 'none';
  document.getElementById('chatFab').style.display = 'flex';
}

function getTime() {
  const n = new Date();
  return n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0');
}

function renderChat() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  msgs.innerHTML = S.chatMessages.map(m => `
    <div class="msg msg-${m.role === 'assistant' ? 'ai' : 'user'}">
      <div class="msg-bubble">${m.text.replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${m.time}</div>
    </div>`).join('');

  if (S.chatLoading) {
    msgs.innerHTML += `
      <div class="msg msg-ai">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;

  const sugg = document.getElementById('chatSuggestions');
  if (sugg) {
    sugg.innerHTML = S.chatMessages.length <= 2
      ? SUGGESTIONS.map(s => `<div class="chat-sugg" onclick="useSuggestion('${s}')">${s}</div>`).join('')
      : '';
  }
}

function useSuggestion(s) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = s; sendMessage(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 80) + 'px';
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input?.value.trim();
  if (!text || S.chatLoading) return;

  input.value = '';
  if (input.style) input.style.height = 'auto';

  S.chatMessages.push({ role: 'user', text, time: getTime() });
  S.chatLoading = true;
  renderChat();

  try {
    const history = S.chatMessages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are ArchitexIQ AI, a friendly and expert construction assistant for Kenya. You help with:
- Material calculations (cement, sand, ballast, stones) in Kenyan context
- Cost estimation in Kenya Shillings (KES)
- Construction techniques for Kenyan conditions (black cotton soil, Nairobi, etc.)
- Site management and labour rates
- Building regulations in Kenya (NCA, OSHA 2007)
- Mix ratios and concrete work
- BOQ preparation

Keep responses concise (max 150 words), practical and Kenya-specific. Use KES for all prices. Be friendly. You can use occasional Swahili phrases. Always give specific numbers when asked about costs.`,
        messages: history,
      })
    });

    const data  = await response.json();
    const reply = data.content?.map(c => c.text || '').join('');

    S.chatMessages.push({
      role: 'assistant',
      text: reply || 'Samahani, I had trouble connecting. Please try again.',
      time: getTime()
    });
  } catch {
    S.chatMessages.push({
      role: 'assistant',
      text: 'Samahani! Connection error. Please check your internet and try again. 🙏',
      time: getTime()
    });
  }

  S.chatLoading = false;
  renderChat();
}

// ═══════════════════════════════════════════════════
// INIT — Do NOT call render() here
// auth.js handles the initial render after login check
// ═══════════════════════════════════════════════════

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
const S = {
  tab: 'calc',
  mixRatio: '1:2:4',
  selectedTemplate: null,
  calcResult: null,
  labourWorkers: [
    {role:'Fundi (Mason)',rate:1800,qty:2},
    {role:'Carpenter',rate:2000,qty:1},
    {role:'Labourer',rate:800,qty:4},
    {role:'Plumber',rate:2500,qty:1},
    {role:'Electrician',rate:2500,qty:1},
    {role:'Painter',rate:1500,qty:2},
  ],
  labourDays: 30,
  planResult: null,
  currentModule: null,
  currentLesson: 0,
  currentQuiz: null,
  currentQ: 0,
  quizScore: 0,
  quizAnswered: false,
  learnView: 'list',
  chatMessages: [],
  chatLoading: false,
  scanResult: null,
  progress: JSON.parse(localStorage.getItem('jp_prog')||'{}'),
  savedProjects: JSON.parse(localStorage.getItem('jp_proj')||'[]'),
  scores: JSON.parse(localStorage.getItem('jp_scores')||'[]'),
  totalCalcs: parseInt(localStorage.getItem('jp_calcs')||'0'),
};

function persist(){
  localStorage.setItem('jp_prog', JSON.stringify(S.progress));
  localStorage.setItem('jp_proj', JSON.stringify(S.savedProjects));
  localStorage.setItem('jp_scores', JSON.stringify(S.scores));
  localStorage.setItem('jp_calcs', S.totalCalcs);
}

function fmt(n){ return Number(n||0).toLocaleString('en-KE'); }
function fmtKES(n){ return 'KES ' + fmt(n); }

// ════════════════════════════════════════
// STATUS TIME
// ════════════════════════════════════════
function updateTime(){
  const now = new Date();
  document.getElementById('statusTime').textContent =
    now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
}
updateTime(); setInterval(updateTime, 10000);

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
function navigate(tab){
  S.tab = tab;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('nav-'+tab).classList.add('active');
  document.getElementById('scrollArea').scrollTop = 0;
  render();
}

function render(){
  const c = document.getElementById('pageContent');
  c.className = 'page-content fade-up';
  void c.offsetWidth;
  if(S.tab==='calc') c.innerHTML = renderCalc();
  else if(S.tab==='labour') c.innerHTML = renderLabour();
  else if(S.tab==='planner') c.innerHTML = renderPlanner();
  else if(S.tab==='learn') c.innerHTML = renderLearn();
  else if(S.tab==='stats') c.innerHTML = renderStats();
  bindEvents();
  if(S.tab==='stats') drawScoreChart();
  if(S.tab==='labour') drawLabourChart();
  if(S.calcResult && S.tab==='calc') { drawPieChart(); drawBarChart(); }
}

// ════════════════════════════════════════
// CALCULATOR
// ════════════════════════════════════════
const TEMPLATES = {
  room:{l:4,w:3,t:3,type:'wall',qty:1},
  '2bed':{l:10,w:8,t:3,type:'wall',qty:1},
  perimeter:{l:30,w:0.15,t:2,type:'wall',qty:1},
  slab:{l:5,w:4,t:0.15,type:'slab',qty:1},
  foundation:{l:20,w:0.6,t:0.9,type:'foundation',qty:1},
  column:{l:0.3,w:0.3,t:3,type:'column',qty:8},
};

const TMPL_LIST = [
  ['room','🏠','Single Room','4×3×3m'],
  ['2bed','🏡','2-Bedroom','10×8×3m'],
  ['perimeter','🧱','Perimeter','30m×2m'],
  ['slab','⬛','Floor Slab','5×4×0.15m'],
  ['foundation','🏗️','Foundation','20×0.6×0.9m'],
  ['column','🏛️','Columns ×8','0.3×0.3×3m'],
];

function renderCalc(){
  const r = S.calcResult;
  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">🇰🇪 Kenya Construction</div>
    <h1 class="hero-title">Material <span class="gold">Estimator</span></h1>
    <p class="hero-sub">Accurate material quantities & costs</p>
  </div>

  <!-- SCANNER BUTTON -->
  <div class="card card-gold" style="margin-bottom:12px;cursor:pointer;" onclick="navigate('scan_view')">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="font-size:2rem;">📸</div>
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;color:var(--gold3);">Scan Building Plan</div>
        <div style="font-size:0.72rem;color:var(--muted2);">Upload a plan image → AI auto-estimates materials</div>
      </div>
      <div style="margin-left:auto;color:var(--gold);font-size:1.2rem;">›</div>
    </div>
  </div>

  <!-- TEMPLATES -->
  <div class="section-header">Quick Templates</div>
  <div class="template-scroll">
    ${TMPL_LIST.map(([k,icon,name,size])=>`
      <div class="template-card ${S.selectedTemplate===k?'active':''}" onclick="loadTemplate('${k}')">
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
      <div class="form-group"><label class="form-label">Length (m)</label><input type="number" id="inL" value="${r?r.L:5}" step="0.1"></div>
      <div class="form-group"><label class="form-label">Width (m)</label><input type="number" id="inW" value="${r?r.W:4}" step="0.1"></div>
      <div class="form-group"><label class="form-label" id="thickLbl">Thick (m)</label><input type="number" id="inT" value="${r?r.T:0.15}" step="0.01"></div>
    </div>
    <div class="form-group"><label class="form-label">Quantity</label><input type="number" id="inQty" value="${r?r.qty:1}" min="1"></div>
    <div class="form-group">
      <label class="form-label">Mix Ratio</label>
      <div class="mix-pills">
        ${['1:2:4','1:3:6','1:1.5:3','1:4:8'].map(m=>`<div class="mix-pill ${S.mixRatio===m?'active':''}" onclick="setMix('${m}')">${m}</div>`).join('')}
      </div>
    </div>
    <div class="section-header">Prices (KES)</div>
    <div class="grid2">
      <div class="form-group"><label class="form-label">Cement /bag</label><input type="number" id="pC" value="750"></div>
      <div class="form-group"><label class="form-label">Sand /m³</label><input type="number" id="pS" value="2500"></div>
      <div class="form-group"><label class="form-label">Ballast /m³</label><input type="number" id="pB" value="3000"></div>
      <div class="form-group"><label class="form-label">Stones /pc</label><input type="number" id="pSt" value="25"></div>
      <div class="form-group"><label class="form-label">Steel Y12 /bar</label><input type="number" id="pSteel" value="800"></div>
      <div class="form-group"><label class="form-label">BRC /sheet</label><input type="number" id="pBRC" value="3500"></div>
    </div>
    <button class="btn btn-gold" onclick="doCalculate()">⚡ Calculate Now</button>
  </div>

  ${r ? renderCalcResults(r) : ''}

  <div class="section-header">Saved Projects</div>
  ${renderSavedProjects()}
  `;
}

function renderCalcResults(r){
  const items = [
    ['🏗️','Cement',r.cBags,'bags'],
    ['🟡','Sand',r.sand,'m³'],
    ['⚫','Ballast',r.ballast,'m³'],
    ...(r.stones>0?[['🧱','Stones',r.stones,'pcs']]:[]),
    ...(r.steel>0?[['🔩','Steel',r.steel,'bars']]:[]),
    ...(r.brc>0?[['🕸️','BRC',r.brc,'sheets']]:[]),
  ];
  return `
  <div class="section-header">Results</div>
  <div class="total-box">
    <div class="total-label">Total Estimated Cost</div>
    <div class="total-amount">${fmtKES(r.total)}</div>
    <div class="total-sub">Volume: ${r.vol.toFixed(3)} m³ · Mix: ${r.mix} · +10% wastage</div>
  </div>
  <div class="result-grid">
    ${items.map(([icon,lbl,val,unit])=>`
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
          ${[
            ['🏗️ Cement',r.cBags,'bags',r.prices.c,r.costC],
            ['🟡 Sand',r.sand,'m³',r.prices.s,r.costS],
            ['⚫ Ballast',r.ballast,'m³',r.prices.b,r.costB],
            ...(r.stones>0?[['🧱 Stones',r.stones,'pcs',r.prices.st,r.costStn]]:[] ),
            ...(r.steel>0?[['🔩 Steel Y12',r.steel,'bars',r.prices.steel,r.costSteel]]:[]),
            ...(r.brc>0?[['🕸️ BRC Mesh',r.brc,'sheets',r.prices.brc,r.costBRC]]:[]),
            ['⚠️ Wastage (10%)','','','',r.wastage],
          ].map(([m,q,u,up,cost])=>`<tr><td>${m}</td><td>${q} ${u}</td><td>${up?fmtKES(up):''}</td><td class="amt">${fmtKES(cost)}</td></tr>`).join('')}
          <tr style="font-weight:700;font-size:0.9rem;"><td colspan="3" style="color:var(--text);">TOTAL</td><td class="amt" style="font-size:1rem;">${fmtKES(r.total)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="btn-row" style="margin-bottom:8px;">
    <button class="btn btn-ghost" onclick="saveProject()">💾 Save Project</button>
    <button class="btn btn-outline" onclick="shareWA()">📱 WhatsApp</button>
  </div>
  <button class="btn btn-outline" onclick="S.calcResult=null;render();">🔄 New Calculation</button>
  `;
}

function renderSavedProjects(){
  if(!S.savedProjects.length) return '<div class="empty"><div class="e-icon">📁</div><p>No saved projects yet</p></div>';
  return S.savedProjects.map(p=>`
    <div class="project-row">
      <div><div class="pr-name">${p.name}</div><div class="pr-meta">${p.type} · ${p.date}</div></div>
      <div class="pr-amount">${fmtKES(p.total)}</div>
    </div>`).join('');
}

function setMix(m){ S.mixRatio=m; render(); }

function loadTemplate(k){
  const t = TEMPLATES[k]; if(!t) return;
  S.selectedTemplate = k;
  render();
  setTimeout(()=>{
    document.getElementById('inL').value=t.l;
    document.getElementById('inW').value=t.w;
    document.getElementById('inT').value=t.t;
    document.getElementById('structType').value=t.type;
    document.getElementById('inQty').value=t.qty;
  },50);
  showToast('✅ Template loaded');
}

function doCalculate(){
  const L=parseFloat(document.getElementById('inL').value)||0;
  const W=parseFloat(document.getElementById('inW').value)||0;
  const T=parseFloat(document.getElementById('inT').value)||0;
  const qty=parseInt(document.getElementById('inQty').value)||1;
  const type=document.getElementById('structType').value;
  const pC=parseFloat(document.getElementById('pC').value)||750;
  const pS=parseFloat(document.getElementById('pS').value)||2500;
  const pB=parseFloat(document.getElementById('pB').value)||3000;
  const pSt=parseFloat(document.getElementById('pSt').value)||25;
  const pSteel=parseFloat(document.getElementById('pSteel').value)||800;
  const pBRC=parseFloat(document.getElementById('pBRC').value)||3500;
  if(!L||!W||!T){showToast('⚠️ Fill all dimensions');return;}
  const [c,s,b]=S.mixRatio.split(':').map(Number);
  const total=c+s+b;
  const V=L*W*T*qty;
  const dryV=V*1.54;
  const cBags=Math.ceil((c/total)*dryV/0.035);
  const sand=parseFloat(((s/total)*dryV).toFixed(2));
  const ballast=parseFloat(((b/total)*dryV).toFixed(2));
  const steel=type==='slab'?Math.ceil(L*W*qty/0.2*2/12):type==='foundation'?Math.ceil(L*qty*4/12):type==='column'?Math.ceil(T*qty*4/12):0;
  const brc=type==='slab'?Math.ceil(L*W*qty/(2.4*4.8)):0;
  const stones=type==='wall'?Math.ceil(L*T*qty*12.5):0;
  const costC=cBags*pC,costS=sand*pS,costB=ballast*pB;
  const costSteel=steel*pSteel,costBRC=brc*pBRC,costStn=stones*pSt;
  const sub=costC+costS+costB+costSteel+costBRC+costStn;
  const wastage=Math.ceil(sub*0.1);
  const tot=sub+wastage;
  S.calcResult={L,W,T,qty,type,mix:S.mixRatio,vol:V,cBags,sand,ballast,steel,brc,stones,costC,costS,costB:costB,costSteel,costBRC,costStn,wastage,total:tot,prices:{c:pC,s:pS,b:pB,st:pSt,steel:pSteel,brc:pBRC},date:new Date().toLocaleDateString('en-KE')};
  S.totalCalcs++;persist();
  render();
  setTimeout(()=>{ const el=document.querySelector('.total-box'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); },100);
}

function saveProject(){
  const name=prompt('Project name:','Project '+(S.savedProjects.length+1));
  if(!name||!S.calcResult)return;
  S.savedProjects.unshift({...S.calcResult,name});
  if(S.savedProjects.length>15)S.savedProjects.pop();
  persist();showToast('✅ Project saved!');render();
}

function shareWA(){
  if(!S.calcResult)return;
  const r=S.calcResult;
  const msg=`*ArchitexIQ Estimate* 🏗️\n\nStructure: ${r.type.toUpperCase()}\nDimensions: ${r.L}×${r.W}×${r.T}m (×${r.qty})\nMix Ratio: ${r.mix}\n\n*TOTAL COST: ${fmtKES(r.total)}*\n\n_ArchitexIQ Kenya 🇰🇪_`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

// ════════════════════════════════════════
// PLAN SCANNER
// ════════════════════════════════════════
function renderScanner(){
  return `
  <button class="back-btn" onclick="navigate('calc')">← Back to Calculator</button>
  <div class="hero">
    <div class="hero-eyebrow">AI Powered</div>
    <h1 class="hero-title">Plan <span class="gold">Scanner</span></h1>
    <p class="hero-sub">Upload a building plan image — AI reads & estimates materials automatically</p>
  </div>
  <div class="scanner-zone" id="scannerZone" onclick="document.getElementById('planFile').click()"
    ondragover="event.preventDefault();this.classList.add('drag')"
    ondragleave="this.classList.remove('drag')"
    ondrop="handleDrop(event)">
    <div class="scanner-icon">📐</div>
    <div class="scanner-title">Upload Building Plan</div>
    <div class="scanner-sub">Tap to choose image or drag & drop<br>Supports JPG, PNG, PDF</div>
  </div>
  <input type="file" id="planFile" accept="image/*" style="display:none" onchange="handleFileSelect(event)">
  <div class="card" style="margin-bottom:12px;">
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

function renderScanResult(){
  const r = S.scanResult;
  return `
  <div class="scan-result">
    <div class="scan-result-title">📋 AI Scan Results</div>
    ${r.items.map(i=>`<div class="scan-item"><span class="si-label">${i.label}</span><span class="si-val">${i.value}</span></div>`).join('')}
  </div>
  <button class="btn btn-gold" onclick="applyScanToCalc()">→ Apply to Calculator</button>
  `;
}

function handleDrop(e){
  e.preventDefault();
  document.getElementById('scannerZone').classList.remove('drag');
  const file=e.dataTransfer.files[0];
  if(file) processFile(file);
}

function handleFileSelect(e){ const file=e.target.files[0]; if(file) processFile(file); }

async function processFile(file){
  const zone=document.getElementById('scannerZone');
  zone.innerHTML='<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div><div style="text-align:center;font-size:0.78rem;color:var(--muted2);margin-top:8px;">AI is reading your plan...</div>';

  // Convert to base64
  const reader = new FileReader();
  reader.onload = async function(ev){
    const base64 = ev.target.result.split(',')[1];
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{
            role:'user',
            content:[
              {type:'image',source:{type:'base64',media_type:file.type||'image/jpeg',data:base64}},
              {type:'text',text:`You are a Kenyan quantity surveyor. Analyze this building plan image and extract key information. Respond ONLY with a JSON array like this (no markdown, no backticks):
[{"label":"Structure Type","value":"2-Bedroom House"},{"label":"Est. Length","value":"10m"},{"label":"Est. Width","value":"8m"},{"label":"Est. Height","value":"3m"},{"label":"Wall Area","value":"~96 m²"},{"label":"Floor Area","value":"~80 m²"},{"label":"Recommended Mix","value":"1:2:4"},{"label":"Est. Cement","value":"~120 bags"},{"label":"Est. Stones","value":"~1200 pcs"},{"label":"Est. Total Cost","value":"KES 280,000 - 350,000"}]
If you cannot read the plan clearly, still provide reasonable estimates based on what you can see. Always respond with valid JSON only.`}
            ]
          }]
        })
      });
      const data=await response.json();
      const text=data.content.map(i=>i.text||'').join('');
      let items;
      try{ items=JSON.parse(text.replace(/```json|```/g,'').trim()); }
      catch{ items=[{label:'Note',value:'Could not parse plan — try a clearer image'},{label:'Tip',value:'Make sure dimensions are visible'},{label:'Est. Mix',value:'1:2:4 Standard'},{label:'Est. Total',value:'KES 200,000+'}]; }
      S.scanResult={items};
      navigate('scan_view');
    } catch(err){
      S.scanResult={items:[{label:'Error',value:'Please check your connection'},{label:'Tip',value:'Try again with a clearer image'}]};
      navigate('scan_view');
    }
  };
  reader.readAsDataURL(file);
}

function applyScanToCalc(){
  showToast('✅ Scan applied! Adjust values as needed.');
  navigate('calc');
}

// ════════════════════════════════════════
// LABOUR
// ════════════════════════════════════════
function renderLabour(){
  const active=S.labourWorkers.filter(w=>w.qty>0);
  const total=active.reduce((a,w)=>a+w.rate*w.qty*S.labourDays,0);
  return `
  <div class="hero">
    <div class="hero-eyebrow">Project Costs</div>
    <h1 class="hero-title">Labour <span class="gold">Calculator</span></h1>
    <p class="hero-sub">Estimate worker costs in Kenya Shillings</p>
  </div>
  <div class="card">
    <div class="card-title"><div class="card-icon">⚙️</div>Project Settings</div>
    <div class="grid2">
      <div class="form-group"><label class="form-label">Duration (Days)</label><input type="number" id="labDays" value="${S.labourDays}" min="1" onchange="S.labourDays=parseInt(this.value)||30;renderLabourUpdate()"></div>
      <div class="form-group"><label class="form-label">Hours/Day</label><input type="number" value="8" min="1" max="12"></div>
    </div>
  </div>
  <div class="section-header">Workers & Rates</div>
  ${S.labourWorkers.map((w,i)=>`
    <div class="worker-card">
      <div class="worker-header">
        <div class="worker-role">👷 ${w.role}</div>
        <div class="worker-rate">${fmtKES(w.rate)}/day</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:0.75rem;color:var(--muted2);">${w.qty>0?fmtKES(w.rate*w.qty*S.labourDays)+' total':'Not included'}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeWorkerQty(${i},-1)">−</button>
          <div class="qty-val">${w.qty}</div>
          <button class="qty-btn" onclick="changeWorkerQty(${i},1)">+</button>
        </div>
      </div>
    </div>`).join('')}
  <div class="card" style="margin-top:4px;">
    <div class="card-title"><div class="card-icon">➕</div>Add Custom Worker</div>
    <div class="grid2" style="margin-bottom:10px;">
      <div class="form-group"><label class="form-label">Role</label><input id="cwRole" placeholder="e.g. Plumber"></div>
      <div class="form-group"><label class="form-label">Daily Rate (KES)</label><input type="number" id="cwRate" placeholder="1500"></div>
    </div>
    <button class="btn btn-outline btn-sm" onclick="addCustomWorker()">+ Add Worker</button>
  </div>
  <div class="total-box" style="margin-top:8px;">
    <div class="total-label">Total Labour Cost</div>
    <div class="total-amount">${fmtKES(total)}</div>
    <div class="total-sub">${S.labourDays} days · ${active.length} active roles</div>
  </div>
  <div class="card">
    <div class="card-title"><div class="card-icon">📊</div>Labour Breakdown</div>
    <div class="chart-wrap"><canvas id="labourChart" height="180"></canvas></div>
  </div>
  <button class="btn btn-outline" onclick="shareLabourWA()">📱 Share via WhatsApp</button>
  `;
}

function changeWorkerQty(i,d){ S.labourWorkers[i].qty=Math.max(0,S.labourWorkers[i].qty+d); render(); }

function addCustomWorker(){
  const role=document.getElementById('cwRole').value.trim();
  const rate=parseFloat(document.getElementById('cwRate').value)||0;
  if(!role||!rate){showToast('⚠️ Enter role and rate');return;}
  S.labourWorkers.push({role,rate,qty:1});
  showToast('✅ Worker added!');render();
}

function shareLabourWA(){
  const active=S.labourWorkers.filter(w=>w.qty>0);
  const total=active.reduce((a,w)=>a+w.rate*w.qty*S.labourDays,0);
  const lines=active.map(w=>`- ${w.role} ×${w.qty}: ${fmtKES(w.rate*w.qty*S.labourDays)}`).join('\n');
  const msg=`*ArchitexIQ Labour Estimate* 👷\n\nDuration: ${S.labourDays} days\n${lines}\n\n*TOTAL LABOUR: ${fmtKES(total)}*\n_ArchitexIQ Kenya 🇰🇪_`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

// ════════════════════════════════════════
// PLANNER
// ════════════════════════════════════════
const PLAN_PHASES = {
  '1bed':[{name:'Site Prep',weeks:1,pct:3,color:'#4a9eff',tasks:['Clear site','Set out lines','Excavate topsoil']},{name:'Foundation',weeks:2,pct:15,color:'#c9a84c',tasks:['Excavate trenches','Blinding concrete','Foundation walling']},{name:'Ground Slab',weeks:1,pct:10,color:'#9b59b6',tasks:['DPC installation','BRC mesh','Concrete pour']},{name:'Walling',weeks:3,pct:25,color:'#2ecc71',tasks:['Stone laying','Lintels','Ring beam']},{name:'Roofing',weeks:2,pct:20,color:'#e74c3c',tasks:['Trusses','Roofing sheets','Gutters']},{name:'Finishes',weeks:3,pct:27,color:'#f39c12',tasks:['Plaster','Screed','Tiles','Paint']}],
  '2bed':[{name:'Site Prep',weeks:1,pct:2,color:'#4a9eff',tasks:['Clear & level','Set out','Topsoil']},{name:'Foundation',weeks:3,pct:12,color:'#c9a84c',tasks:['Deep excavation','Mass concrete','Foundation walls']},{name:'Ground Slab',weeks:2,pct:10,color:'#9b59b6',tasks:['DPC & blinding','BRC reinforcement','Pour & cure']},{name:'Walling',weeks:5,pct:22,color:'#2ecc71',tasks:['Stone laying','Lintels','Ring beam','Columns']},{name:'Roof',weeks:3,pct:18,color:'#e74c3c',tasks:['Trusses','Roofing','Ridge capping','Gutters']},{name:'Finishes & MEP',weeks:6,pct:36,color:'#f39c12',tasks:['Plumbing','Electrical','Plaster','Tiles','Paint']}],
  '3bed':[{name:'Site Prep',weeks:1,pct:2,color:'#4a9eff',tasks:['Site clearing','Setting out']},{name:'Foundation',weeks:4,pct:12,color:'#c9a84c',tasks:['Excavation','Concrete works']},{name:'Ground Slab',weeks:2,pct:8,color:'#9b59b6',tasks:['DPC','Reinforcement','Pour']},{name:'Walling',weeks:7,pct:20,color:'#2ecc71',tasks:['Stone laying','Ring beam']},{name:'Roof',weeks:4,pct:16,color:'#e74c3c',tasks:['Trusses','Sheeting']},{name:'Finishes',weeks:8,pct:42,color:'#f39c12',tasks:['MEP','Plaster','Tiles','Paint']}],
  perimeter:[{name:'Setting Out',weeks:1,pct:5,color:'#4a9eff',tasks:['Survey','Mark boundary']},{name:'Foundation',weeks:2,pct:25,color:'#c9a84c',tasks:['Excavate trench','Foundation concrete']},{name:'Walling',weeks:4,pct:55,color:'#2ecc71',tasks:['Stone laying','Coping stones']},{name:'Finishing',weeks:1,pct:15,color:'#f39c12',tasks:['Render','Paint','Gate']}],
};

function renderPlanner(){
  if(S.planResult) return renderPlanOutput();
  return `
  <div class="hero">
    <div class="hero-eyebrow">Timeline</div>
    <h1 class="hero-title">Project <span class="gold">Planner</span></h1>
    <p class="hero-sub">Generate a full construction schedule & budget split</p>
  </div>
  <div class="card">
    <div class="card-title"><div class="card-icon">🏗️</div>Project Details</div>
    <div class="form-group"><label class="form-label">Project Name</label><input id="planName" placeholder="e.g. My Dream Home"></div>
    <div class="grid2">
      <div class="form-group"><label class="form-label">Start Date</label><input type="date" id="planStart" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label class="form-label">Project Type</label>
        <select id="planType">
          <option value="1bed">Single Room</option>
          <option value="2bed" selected>2-Bedroom</option>
          <option value="3bed">3-Bedroom</option>
          <option value="perimeter">Perimeter Wall</option>
        </select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Total Budget (KES)</label><input type="number" id="planBudget" value="500000"></div>
    <button class="btn btn-gold" onclick="generatePlan()">🗺️ Generate Timeline</button>
  </div>
  `;
}

function generatePlan(){
  const name=document.getElementById('planName').value||'My Project';
  const type=document.getElementById('planType').value;
  const budget=parseFloat(document.getElementById('planBudget').value)||500000;
  const startStr=document.getElementById('planStart').value;
  const phases=PLAN_PHASES[type];
  const totalWeeks=phases.reduce((a,p)=>a+p.weeks,0);
  const start=new Date(startStr);
  let wk=0;
  const detailed=phases.map(p=>{
    const ps=new Date(start);ps.setDate(ps.getDate()+wk*7);
    const pe=new Date(ps);pe.setDate(pe.getDate()+p.weeks*7);
    wk+=p.weeks;
    return{...p,startDate:ps.toLocaleDateString('en-KE'),endDate:pe.toLocaleDateString('en-KE'),phBudget:Math.round(budget*p.pct/100)};
  });
  S.planResult={name,phases:detailed,totalWeeks,budget};
  render();
}

function renderPlanOutput(){
  const{name,phases,totalWeeks,budget}=S.planResult;
  const icons=['📐','🏗️','⬛','🧱','🏠','🎨','🔧'];
  return `
  <button class="back-btn" onclick="S.planResult=null;render()">← New Plan</button>
  <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:var(--gold3);margin-bottom:4px;">${name}</div>
  <div style="font-size:0.75rem;color:var(--muted2);margin-bottom:16px;">${totalWeeks} weeks total · Budget: ${fmtKES(budget)}</div>
  <div class="section-header">Gantt Chart</div>
  <div class="gantt-wrap">
    <div class="gantt">
      ${phases.map((p,i)=>{
        const offset=phases.slice(0,i).reduce((a,pp)=>a+pp.weeks,0);
        const left=(offset/totalWeeks)*100;
        const width=(p.weeks/totalWeeks)*100;
        return `<div class="gantt-row"><div class="gantt-lbl">${p.name}</div><div class="gantt-track"><div class="gantt-fill" style="left:${left}%;width:${width}%;background:${p.color};">${p.weeks}w</div></div></div>`;
      }).join('')}
    </div>
  </div>
  <div class="section-header">Phase Details</div>
  ${phases.map((p,i)=>`
    <div class="phase-card" style="border-color:${p.color};">
      <div class="phase-header">
        <div class="phase-name">${icons[i]||'🔧'} ${p.name}</div>
        <div class="phase-badge">${p.weeks} week${p.weeks>1?'s':''}</div>
      </div>
      <div style="font-size:0.68rem;color:var(--muted);margin-bottom:6px;">${p.startDate} → ${p.endDate}</div>
      <ul class="phase-tasks">${p.tasks.map(t=>`<li><span style="color:${p.color}">›</span>${t}</li>`).join('')}</ul>
      <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.72rem;">
        <span style="color:var(--muted);">Budget allocation</span>
        <span style="color:${p.color};font-weight:600;">${fmtKES(p.phBudget)} (${p.pct}%)</span>
      </div>
      <div style="height:4px;background:var(--card);border-radius:4px;margin-top:6px;overflow:hidden;"><div style="height:100%;width:${p.pct}%;background:${p.color};border-radius:4px;"></div></div>
    </div>`).join('')}
  <div class="btn-row" style="margin-top:4px;">
    <button class="btn btn-gold" onclick="sharePlanWA()">📱 Share Plan</button>
    <button class="btn btn-outline" onclick="S.planResult=null;render()">🔄 New Plan</button>
  </div>
  `;
}

function sharePlanWA(){
  if(!S.planResult)return;
  const{name,phases,totalWeeks,budget}=S.planResult;
  const lines=phases.map(p=>`- ${p.name}: ${p.weeks}w (${fmtKES(p.phBudget)})`).join('\n');
  const msg=`*${name} — Construction Plan* 🏗️\n\n${lines}\n\n*Total: ${totalWeeks} weeks | Budget: ${fmtKES(budget)}*\n_ArchitexIQ Kenya 🇰🇪_`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

// ════════════════════════════════════════
// LEARNING DATA
// ════════════════════════════════════════
const MODULES=[
  {id:'cm1',type:'con',icon:'🏗️',color:'#c9a84c',title:'Material Estimation',desc:'Mix ratios, volumes & quantities',lessons:[
    {title:'Concrete Mix Ratios',content:`<h2>Concrete Mix Ratios</h2><p>A mix ratio tells you the proportion of cement, sand, and ballast.</p><div class="hl">Most common: <strong>1:2:4</strong> — 1 cement : 2 sand : 4 ballast</div><div class="fbox">1:1.5:3 → High Strength (columns)<br>1:2:4 → Standard (slabs)<br>1:3:6 → Mass Concrete<br>1:4:8 → Blinding</div>`},
    {title:'Volume Calculation',content:`<h2>Volume Calculation</h2><div class="fbox">Volume = Length × Width × Thickness<br>Dry Volume = Wet × 1.54</div><div class="hl">Always multiply by 1.54 — concrete compacts when mixed!</div>`},
    {title:'Cement Bags',content:`<h2>Cement Bags</h2><p>One 50kg bag = 0.035 m³</p><div class="fbox">Bags = ((c/total) × DryVol) ÷ 0.035</div><div class="hl">Always round UP — never buy less than needed!</div>`},
  ]},
  {id:'cm2',type:'con',icon:'🧱',color:'#2ecc71',title:'Walling & Masonry',desc:'Machine-cut stones & mortar',lessons:[
    {title:'Machine-Cut Stones',content:`<h2>Machine-Cut Stones</h2><p>Standard: <strong>390mm × 190mm × 190mm</strong></p><div class="fbox">12.5 stones per m² of wall</div><div class="hl">Add 5-10% for wastage!</div>`},
  ]},
  {id:'cm3',type:'con',icon:'📋',color:'#4a9eff',title:'BOQ Preparation',desc:'Professional bill of quantities',lessons:[
    {title:'What is a BOQ?',content:`<h2>Bill of Quantities</h2><p>Lists all materials, labour and costs for a project.</p><div class="fbox">1. Preliminaries<br>2. Substructure<br>3. Superstructure<br>4. Roof<br>5. Finishes</div>`},
  ]},
  {id:'cm4',type:'con',icon:'👷',color:'#9b59b6',title:'Site Management',desc:'Workers, safety & timelines',lessons:[
    {title:'Site Safety',content:`<h2>Safety on Site</h2><p>Governed by OSHA 2007 in Kenya.</p><div class="hl">PPE: Hard hat, boots, vest, gloves</div>`},
    {title:'Worker Rates',content:`<h2>Kenyan Worker Rates</h2><div class="fbox">Fundi → KES 1,500–2,500/day<br>Labourer → KES 700–1,000/day<br>Foreman → KES 2,500–4,000/day</div>`},
  ]},
  {id:'code1',type:'code',icon:'🐍',color:'#3776ab',title:'Python Basics',desc:'Variables, loops & functions',lessons:[
    {title:'Python Introduction',content:`<h2>Python</h2><div class="fbox">bags = 50<br>price = 750<br>total = bags * price<br>print(total)  # 37500</div>`},
    {title:'Python Loops',content:`<h2>Loops</h2><div class="fbox">for i in range(5):<br>    print("Day", i+1)</div>`},
    {title:'Python Functions',content:`<h2>Functions</h2><div class="fbox">def calc_bags(vol):<br>    return round((vol*1.54/7)/0.035)<br><br>print(calc_bags(3.0))  # 19</div>`},
  ]},
  {id:'code2',type:'code',icon:'⚛️',color:'#61dafb',title:'React Framework',desc:'Components, state & hooks',lessons:[
    {title:'React Components',content:`<h2>React Components</h2><div class="fbox">function Card({ title }) {<br>  return &lt;div&gt;{title}&lt;/div&gt;;<br>}</div><div class="hl">💡 JengaApp v3 is built entirely with React!</div>`},
    {title:'useState Hook',content:`<h2>useState</h2><div class="fbox">const [bags, setBags] = useState(0);<br><br>// Update state:<br>setBags(50);</div><div class="hl">State changes cause the component to re-render automatically!</div>`},
  ]},
];

const QUIZZES=[
  {id:'q1',title:'Mix Ratios',tag:'con',mid:'cm1',questions:[
    {q:'What does 1:2:4 mean?',opts:['1 cement:2 ballast:4 sand','1 cement:2 sand:4 ballast','1 sand:2 cement:4 ballast','Other'],ans:1,explain:'Order: Cement:Sand:Ballast'},
    {q:'Strongest mix?',opts:['1:4:8','1:3:6','1:2:4','1:1.5:3'],ans:3,explain:'More cement = stronger concrete'},
    {q:'Why multiply by 1.54?',opts:['Water content','Units','Dry materials compress','Safety'],ans:2,explain:'Dry volume factor accounts for compaction'},
    {q:'Slab 6×5×0.15m volume?',opts:['4.5 m³','4.0 m³','5.5 m³','3.0 m³'],ans:0,explain:'6×5×0.15 = 4.5 m³'},
  ]},
  {id:'q2',title:'Masonry',tag:'con',mid:'cm2',questions:[
    {q:'Stones per m² of wall?',opts:['10','12.5','15','8'],ans:1,explain:'12.5 standard 390×190mm stones per m²'},
    {q:'Wall 15m×3m — stones?',opts:['450','563','600','500'],ans:1,explain:'45 m² × 12.5 = 562.5 → 563'},
    {q:'Standard stone size?',opts:['200×100×100mm','390×190×190mm','300×150mm','450×200mm'],ans:1,explain:'Standard = 390×190×190mm'},
  ]},
  {id:'q3',title:'Python',tag:'code',mid:'code1',questions:[
    {q:'print("Hello") does what?',opts:['Saves to file','Sends email','Shows on screen','Deletes'],ans:2,explain:'print() displays on screen'},
    {q:'Python multiply symbol?',opts:['×','x','*','•'],ans:2,explain:'Python uses * for multiplication'},
    {q:'Loop syntax?',opts:['loop i in 5:','for i in range(5):','repeat 5:','loop 5:'],ans:1,explain:'"for i in range(n):" is correct Python syntax'},
  ]},
  {id:'q4',title:'React',tag:'code',mid:'code2',questions:[
    {q:'React state hook?',opts:['useData','useState','createState','setState'],ans:1,explain:'useState is the React hook for state management'},
    {q:'What is a React component?',opts:['A CSS file','A database','A reusable UI function','A server'],ans:2,explain:'Components are reusable UI building blocks'},
  ]},
];

function renderLearn(){
  if(S.learnView==='lesson') return renderLessonView();
  if(S.learnView==='quiz') return renderQuizView();
  return `
  <div class="hero">
    <div class="hero-eyebrow">Education</div>
    <h1 class="hero-title">Learn & <span class="gold">Master</span></h1>
    <p class="hero-sub">Construction & coding from beginner to professional</p>
  </div>
  <div class="section-header">Construction</div>
  ${MODULES.filter(m=>m.type==='con').map(m=>moduleCard(m)).join('')}
  <div class="section-header">Coding</div>
  ${MODULES.filter(m=>m.type==='code').map(m=>moduleCard(m)).join('')}
  <div class="section-header">Practice Quizzes</div>
  ${QUIZZES.map(q=>`
    <div class="project-row" style="cursor:pointer;" onclick="startQuiz('${q.id}')">
      <div><div class="pr-name">${q.title}</div><div class="pr-meta">${q.questions.length} questions</div></div>
      <div style="color:${S.progress['q_'+q.id]?'var(--green)':'var(--gold)'};font-weight:600;font-size:0.82rem;">${S.progress['q_'+q.id]?'✅ '+S.progress['q_'+q.id]+'%':'▶ Start'}</div>
    </div>`).join('')}
  `;
}

function moduleCard(m){
  const prog=S.progress['m_'+m.id]||0;
  return `<div class="module-card" onclick="openModule('${m.id}')">
    <div class="mod-header">
      <div class="mod-icon" style="background:${m.color}20;">${m.icon}</div>
      <div class="mod-info"><h3>${m.title}</h3><p>${m.desc}</p></div>
    </div>
    <div class="prog-bar"><div class="prog-fill" style="width:${prog}%;background:${m.color};"></div></div>
    <div class="prog-labels"><span>${m.lessons.length} lessons</span><span>${prog}% done</span></div>
  </div>`;
}

function openModule(id){
  S.currentModule=MODULES.find(m=>m.id===id);
  S.currentLesson=0;S.learnView='lesson';
  S.progress['m_'+id]=Math.max(S.progress['m_'+id]||0,30);
  persist();render();
}

function renderLessonView(){
  const mod=S.currentModule;const lesson=mod.lessons[S.currentLesson];
  const hasMore=S.currentLesson<mod.lessons.length-1;
  const relQuiz=QUIZZES.find(q=>q.mid===mod.id);
  return `
  <button class="back-btn" onclick="S.learnView='list';render()">← Back</button>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
    <div style="font-size:1.3rem;">${mod.icon}</div>
    <div><div style="font-size:0.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">${mod.title}</div>
    <div style="font-size:0.8rem;font-weight:600;">Lesson ${S.currentLesson+1} of ${mod.lessons.length}</div></div>
  </div>
  <div class="card lesson-content">${lesson.content}</div>
  ${hasMore?`<button class="btn btn-outline" style="margin-bottom:8px;" onclick="S.currentLesson++;S.progress['m_${mod.id}']=100;persist();render()">Next Lesson →</button>`:''}
  ${relQuiz?`<button class="btn btn-gold" onclick="startQuiz('${relQuiz.id}')">🎯 Take Quiz</button>`:''}
  `;
}

function startQuiz(qId){
  S.currentQuiz=QUIZZES.find(q=>q.id===qId);
  S.currentQ=0;S.quizScore=0;S.quizAnswered=false;
  S.learnView='quiz';render();
}

function renderQuizView(){
  const quiz=S.currentQuiz;
  if(S.currentQ>=quiz.questions.length){
    const pct=S.progress['q_'+quiz.id]||0;const passed=pct>=60;
    return `
    <button class="back-btn" onclick="S.learnView='list';render()">← Back</button>
    <div class="card" style="text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:10px;">${passed?'🏆':'📚'}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:var(--gold3);">${passed?'Excellent!':'Keep Studying'}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:700;color:${passed?'var(--green)':'var(--red)'};margin:14px 0;">${pct}%</div>
      <div style="color:var(--muted2);font-size:0.84rem;margin-bottom:20px;">${S.quizScore} of ${quiz.questions.length} correct</div>
      <button class="btn btn-gold" style="margin-bottom:8px;" onclick="startQuiz('${quiz.id}')">🔄 Retry Quiz</button>
      <button class="btn btn-outline" onclick="S.learnView='list';render()">← Modules</button>
    </div>`;
  }
  const q=quiz.questions[S.currentQ];
  const pct=Math.round((S.currentQ/quiz.questions.length)*100);
  return `
  <button class="back-btn" onclick="S.learnView='list';render()">← Back</button>
  <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--muted);margin-bottom:6px;">
    <span>Q${S.currentQ+1}/${quiz.questions.length}</span>
    <span style="color:var(--green);">Score: ${S.quizScore}/${S.currentQ}</span>
  </div>
  <div style="height:3px;background:var(--surface);border-radius:2px;overflow:hidden;margin-bottom:14px;">
    <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:2px;transition:width 0.3s;"></div>
  </div>
  <div class="card">
    <div style="font-size:0.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Question ${S.currentQ+1}</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600;margin-bottom:14px;color:var(--gold3);line-height:1.4;">${q.q}</div>
    ${q.opts.map((o,i)=>`<div class="option" id="opt${i}" onclick="answerQuiz(${i})"><div class="opt-letter">${'ABCD'[i]}</div>${o}</div>`).join('')}
    <div id="quizFeedback"></div>
  </div>`;
}

function answerQuiz(i){
  if(S.quizAnswered)return;S.quizAnswered=true;
  const q=S.currentQuiz.questions[S.currentQ];const correct=i===q.ans;
  if(correct)S.quizScore++;
  document.getElementById('opt'+i).classList.add(correct?'correct':'wrong');
  document.getElementById('opt'+q.ans).classList.add('correct');
  const fb=document.getElementById('quizFeedback');
  fb.innerHTML=`<div style="padding:10px 14px;border-radius:10px;font-size:0.78rem;margin-top:7px;background:${correct?'rgba(46,204,113,0.08)':'rgba(231,76,60,0.08)'};color:${correct?'var(--green)':'var(--red)'};border:1px solid ${correct?'rgba(46,204,113,0.3)':'rgba(231,76,60,0.3)'};">${correct?'✅ Correct! ':'❌ Wrong. '}${q.explain}</div>`;
  setTimeout(()=>{
    const total=S.currentQuiz.questions.length;
    const newScore=S.quizScore;
    S.currentQ++;S.quizAnswered=false;
    if(S.currentQ>=total){
      const pct=Math.round((newScore/total)*100);
      S.progress['q_'+S.currentQuiz.id]=pct;
      S.scores.push(pct);persist();
    }
    render();
  },2000);
}

// ════════════════════════════════════════
// STATS
// ════════════════════════════════════════
function renderStats(){
  const lessons=Object.keys(S.progress).filter(k=>k.startsWith('m_')).length;
  const passed=Object.keys(S.progress).filter(k=>k.startsWith('q_')&&S.progress[k]>=60).length;
  const avg=S.scores.length?Math.round(S.scores.reduce((a,b)=>a+b,0)/S.scores.length):0;
  const badges=[
    {i:'🏗️',n:'Builder',e:S.totalCalcs>=1},{i:'📐',n:'Estimator',e:S.totalCalcs>=5},
    {i:'📚',n:'Student',e:lessons>=1},{i:'🎯',n:'Quiz Pro',e:passed>=1},
    {i:'🇰🇪',n:'Kenyan',e:S.savedProjects.length>=1},{i:'⭐',n:'Perfect',e:S.scores.includes(100)},
    {i:'🐍',n:'Python',e:S.progress['m_code1']===100},{i:'⚛️',n:'React',e:S.progress['m_code2']===100},
    {i:'🔥',n:'On Fire',e:S.scores.filter(s=>s>=80).length>=3},{i:'🏆',n:'Master',e:S.totalCalcs>=10&&lessons>=4},
  ];
  return `
  <div class="hero">
    <div class="hero-eyebrow">Dashboard</div>
    <h1 class="hero-title">Your <span class="gold">Progress</span></h1>
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-val">${lessons}</div><div class="stat-lbl">Lessons Done</div></div>
    <div class="stat-card"><div class="stat-val">${passed}</div><div class="stat-lbl">Quizzes Passed</div></div>
    <div class="stat-card"><div class="stat-val">${S.totalCalcs}</div><div class="stat-lbl">Calculations</div></div>
    <div class="stat-card"><div class="stat-val">${avg}%</div><div class="stat-lbl">Avg Score</div></div>
  </div>
  <div class="card">
    <div class="card-title"><div class="card-icon">📈</div>Quiz Score History</div>
    <div class="chart-wrap"><canvas id="scoreChart" height="150"></canvas></div>
  </div>
  <div class="section-header">Achievements</div>
  <div class="badge-grid">
    ${badges.map(b=>`<div class="badge-item ${b.e?'earned':''}">${b.i}<div class="b-lbl">${b.n}</div></div>`).join('')}
  </div>
  <div class="section-header">Module Progress</div>
  ${MODULES.map(m=>`
    <div style="background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:12px;margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:0.82rem;font-weight:600;">${m.icon} ${m.title}<span style="color:var(--muted2);font-size:0.7rem;">${S.progress['m_'+m.id]||0}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${S.progress['m_'+m.id]||0}%;background:${m.color};"></div></div>
    </div>`).join('')}
  <div class="section-header">Recent Projects</div>
  ${!S.savedProjects.length?'<div class="empty"><div class="e-icon">📐</div><p>No calculations yet</p></div>':S.savedProjects.slice(0,5).map(p=>`<div class="project-row"><div><div class="pr-name">${p.name}</div><div class="pr-meta">${p.type} · ${p.date}</div></div><div class="pr-amount">${fmtKES(p.total)}</div></div>`).join('')}
  `;
}

// ════════════════════════════════════════
// CHARTS
// ════════════════════════════════════════
function drawPieChart(){
  const r=S.calcResult;if(!r)return;
  const canvas=document.getElementById('pieChart');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.offsetWidth;canvas.height=200;
  const data=[r.costC,r.costS,r.costB,r.costStn,r.costSteel,r.costBRC,r.wastage].filter(v=>v>0);
  const colors=['#c9a84c','#2ecc71','#4a9eff','#9b59b6','#e74c3c','#f39c12','#636e72'];
  const total=data.reduce((a,b)=>a+b,0);
  const cx=canvas.width/2,cy=90,R=75;
  let start=-Math.PI/2;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  data.forEach((v,i)=>{
    const slice=(v/total)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,start,start+slice);ctx.closePath();
    ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.strokeStyle='#070709';ctx.lineWidth=2;ctx.stroke();
    start+=slice;
  });
  ctx.beginPath();ctx.arc(cx,cy,R*0.52,0,Math.PI*2);ctx.fillStyle='#111117';ctx.fill();
  ctx.fillStyle='#c9a84c';ctx.font='bold 11px Cormorant Garamond,serif';ctx.textAlign='center';
  ctx.fillText(fmtKES(r.total),cx,cy+4);
}

function drawBarChart(){
  const r=S.calcResult;if(!r)return;
  const canvas=document.getElementById('barChart');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.offsetWidth;canvas.height=150;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const items=[['Cement',r.cBags],['Sand',r.sand],['Ballast',r.ballast],...(r.stones>0?[['Stones',r.stones]]:[]),...(r.steel>0?[['Steel',r.steel]]:[])];
  const colors=['#c9a84c','#2ecc71','#4a9eff','#9b59b6','#e74c3c'];
  const maxV=Math.max(...items.map(i=>i[1]));
  const bW=(canvas.width-40)/(items.length*2);
  items.forEach(([lbl,val],i)=>{
    const x=20+i*bW*2+bW*0.3;
    const bH=(val/maxV)*110;const y=125-bH;
    ctx.fillStyle=colors[i%colors.length];
    ctx.beginPath();ctx.roundRect(x,y,bW*1.4,bH,4);ctx.fill();
    ctx.fillStyle='#6b6454';ctx.font='8px DM Sans';ctx.textAlign='center';
    ctx.fillText(lbl,x+bW*0.7,142);
    ctx.fillStyle=colors[i%colors.length];ctx.font='bold 9px Syne,sans-serif';
    ctx.fillText(val,x+bW*0.7,y-4);
  });
}

function drawLabourChart(){
  const canvas=document.getElementById('labourChart');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.offsetWidth;canvas.height=180;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const active=S.labourWorkers.filter(w=>w.qty>0);if(!active.length)return;
  const values=active.map(w=>w.rate*w.qty*S.labourDays);
  const maxV=Math.max(...values);
  const colors=['#c9a84c','#2ecc71','#4a9eff','#9b59b6','#e74c3c','#f39c12'];
  const lW=90,barH=20,gap=7;
  active.forEach((w,i)=>{
    const y=i*(barH+gap)+10;
    ctx.fillStyle='#16161e';ctx.fillRect(lW,y,canvas.width-lW-10,barH);
    const bW=((values[i]/maxV)*(canvas.width-lW-10));
    ctx.fillStyle=colors[i%colors.length];
    ctx.beginPath();ctx.roundRect(lW,y,bW,barH,4);ctx.fill();
    ctx.fillStyle='#6b6454';ctx.font='9px DM Sans';ctx.textAlign='right';
    ctx.fillText(w.role.split('(')[0].trim(),lW-5,y+14);
    if(bW>50){ctx.fillStyle='#000';ctx.font='bold 9px DM Sans';ctx.textAlign='left';ctx.fillText(fmtKES(values[i]),lW+5,y+14);}
  });
}

function drawScoreChart(){
  const canvas=document.getElementById('scoreChart');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.offsetWidth;canvas.height=150;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const vals=S.scores;
  if(vals.length<2){ctx.fillStyle='#6b6454';ctx.font='12px DM Sans';ctx.textAlign='center';ctx.fillText('Complete quizzes to see your progress',canvas.width/2,75);return;}
  const pad=20,w=canvas.width-pad*2,h=canvas.height-pad*2;
  const grad=ctx.createLinearGradient(0,pad,0,pad+h);
  grad.addColorStop(0,'rgba(244,124,32,0.25)');grad.addColorStop(1,'rgba(244,124,32,0)');
  ctx.beginPath();
  vals.forEach((v,i)=>{const x=pad+(i/(vals.length-1))*w,y=pad+h-(v/100)*h;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.lineTo(pad+w,pad+h);ctx.lineTo(pad,pad+h);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();ctx.strokeStyle='#c9a84c';ctx.lineWidth=2;
  vals.forEach((v,i)=>{const x=pad+(i/(vals.length-1))*w,y=pad+h-(v/100)*h;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
  ctx.stroke();
  vals.forEach((v,i)=>{
    const x=pad+(i/(vals.length-1))*w,y=pad+h-(v/100)*h;
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#c9a84c';ctx.fill();
    ctx.fillStyle='#f0ead8';ctx.font='bold 9px DM Sans';ctx.textAlign='center';ctx.fillText(v+'%',x,y-8);
  });
}

// ════════════════════════════════════════
// AI CHAT
// ════════════════════════════════════════
const SUGGESTIONS=['How much cement for a 3-bed?','Best foundation for black cotton soil?','Estimate perimeter wall cost','What causes concrete cracks?','Labour cost for 2-bedroom?'];

function openChat(){
  document.getElementById('chatOverlay').style.display='flex';
  document.getElementById('chatFab').style.display='none';
  if(!S.chatMessages.length){
    S.chatMessages=[{role:'assistant',text:"Habari! I'm your ArchitexIQ AI Assistant 🏗️\n\nI specialise in Kenya construction — materials, costs, techniques and planning. How can I help you today?",time:getTime()}];
  }
  renderChat();
}

function closeChat(){
  document.getElementById('chatOverlay').style.display='none';
  document.getElementById('chatFab').style.display='flex';
}

function getTime(){
  const n=new Date();return n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0');
}

function renderChat(){
  const msgs=document.getElementById('chatMessages');
  msgs.innerHTML=S.chatMessages.map(m=>`
    <div class="msg msg-${m.role==='assistant'?'ai':'user'}">
      <div class="msg-bubble">${m.text.replace(/\n/g,'<br>')}</div>
      <div class="msg-time">${m.time}</div>
    </div>`).join('');
  if(S.chatLoading) msgs.innerHTML+=`<div class="msg msg-ai"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  msgs.scrollTop=msgs.scrollHeight;
  const sugg=document.getElementById('chatSuggestions');
  sugg.innerHTML=S.chatMessages.length<=2?SUGGESTIONS.map(s=>`<div class="chat-sugg" onclick="useSuggestion('${s}')">${s}</div>`).join(''):'';
}

function useSuggestion(s){
  document.getElementById('chatInput').value=s;
  sendMessage();
}

function autoResize(el){
  el.style.height='auto';
  el.style.height=Math.min(el.scrollHeight,80)+'px';
}

function handleChatKey(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}
}

async function sendMessage(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();if(!text||S.chatLoading)return;
  input.value='';input.style.height='auto';
  S.chatMessages.push({role:'user',text,time:getTime()});
  S.chatLoading=true;renderChat();
  try{
    const history=S.chatMessages.slice(-10).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:`You are ArchitexIQ AI, a friendly construction expert assistant specialising in Kenya construction. You help with:
- Material calculations (cement, sand, ballast, stones)
- Cost estimation in Kenya Shillings (KES)
- Construction techniques for Kenyan conditions
- Site management and labour
- Building regulations in Kenya
- Mix ratios and concrete work
Keep responses concise, practical and Kenya-specific. Use KES for prices. Be friendly and use occasional Swahili greetings.`,
        messages:history,
      })
    });
    const data=await response.json();
    const reply=data.content.map(c=>c.text||'').join('');
    S.chatMessages.push({role:'assistant',text:reply||'Samahani, I had trouble connecting. Please try again.',time:getTime()});
  }catch(err){
    S.chatMessages.push({role:'assistant',text:'Samahani! Connection error. Please check your internet and try again. 🙏',time:getTime()});
  }
  S.chatLoading=false;renderChat();
}

// ════════════════════════════════════════
// BIND EVENTS & SPECIAL ROUTES
// ════════════════════════════════════════
function bindEvents(){}

// Override navigate for scanner
const origNavigate=navigate;
window.navigate=function(tab){
  if(tab==='scan_view'){
    S.tab='scan_view';
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.getElementById('scrollArea').scrollTop=0;
    const c=document.getElementById('pageContent');
    c.className='page-content fade-up';void c.offsetWidth;
    c.innerHTML=renderScanner();
    return;
  }
  origNavigate(tab);
};

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
render();
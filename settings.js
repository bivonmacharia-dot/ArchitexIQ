// ═══════════════════════════════════════════════════
// ArchitexIQ — settings.js
// Settings: Theme, Profile, Prices, Language
// ═══════════════════════════════════════════════════

// ── Get settings from storage ──
function getSettings() {
  return JSON.parse(localStorage.getItem('aiq_settings') || JSON.stringify({
    theme: 'light',
    defaultPrices: {
      cement: 750, sand: 2500, ballast: 3000,
      stone: 25, steel: 800, brc: 3500
    },
    notifications: true,
    language: 'en',
  }));
}

// ── Save settings ──
function saveSettings(settings) {
  localStorage.setItem('aiq_settings', JSON.stringify(settings));
}

// ── Apply theme on load ──
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('aiq_theme', theme);
}

// ── Toggle theme ──
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  const settings = getSettings();
  settings.theme = next;
  saveSettings(settings);
  // Update toggle button
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.classList.toggle('on', next === 'dark');
  }
  showToast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  render();
}

// ── Init theme on page load ──
function initTheme() {
  const saved = localStorage.getItem('aiq_theme') || 'light';
  applyTheme(saved);
}

// ── RENDER SETTINGS PAGE ──
function renderSettings() {
  const settings = getSettings();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const user = getCurrentUser();

  return `
  <div class="hero fade-up">
    <div class="hero-eyebrow">⚙️ Preferences</div>
    <h1 class="hero-title">App <span class="gold">Settings</span></h1>
    <p class="hero-sub">Customize your ArchitexIQ experience</p>
  </div>

  <!-- PROFILE CARD -->
  <div class="profile-card">
    <div class="profile-avatar">👷</div>
    <div class="profile-name">${user ? user.fullname : 'Guest'}</div>
    <div class="profile-username">@${user ? user.username : 'guest'}</div>
    <div class="profile-badge">${user && user.role === 'admin' ? '👑 Admin' : '👤 User'}</div>
    <div style="margin-top:14px;">
      <button class="btn btn-outline btn-sm" onclick="showChangePassword()" style="margin-right:8px;">🔐 Change Password</button>
    </div>
  </div>

  <!-- APPEARANCE -->
  <div class="settings-section">
    <div class="settings-title">Appearance</div>

    <div class="settings-item" onclick="toggleTheme()">
      <div class="settings-item-left">
        <div class="settings-item-icon">${isDark ? '🌙' : '☀️'}</div>
        <div class="settings-item-info">
          <h4>Theme</h4>
          <p>${isDark ? 'Dark mode is on' : 'Light mode is on'}</p>
        </div>
      </div>
      <button class="toggle ${isDark ? 'on' : ''}" id="themeToggle"></button>
    </div>
  </div>

  <!-- DEFAULT PRICES -->
  <div class="settings-section">
    <div class="settings-title">Default Market Prices (KES)</div>
    <div class="card">
      <div class="card-title"><div class="card-icon">💰</div>Kenyan Market Prices</div>
      <div class="grid2">
        <div class="form-group">
          <label class="form-label">Cement /bag</label>
          <input type="number" id="sp_cement" value="${settings.defaultPrices.cement}" onchange="updateDefaultPrice('cement', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Sand /m³</label>
          <input type="number" id="sp_sand" value="${settings.defaultPrices.sand}" onchange="updateDefaultPrice('sand', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Ballast /m³</label>
          <input type="number" id="sp_ballast" value="${settings.defaultPrices.ballast}" onchange="updateDefaultPrice('ballast', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Stones /pc</label>
          <input type="number" id="sp_stone" value="${settings.defaultPrices.stone}" onchange="updateDefaultPrice('stone', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Steel Y12 /bar</label>
          <input type="number" id="sp_steel" value="${settings.defaultPrices.steel}" onchange="updateDefaultPrice('steel', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">BRC /sheet</label>
          <input type="number" id="sp_brc" value="${settings.defaultPrices.brc}" onchange="updateDefaultPrice('brc', this.value)">
        </div>
      </div>
      <button class="btn btn-gold btn-sm" onclick="savePrices()">💾 Save Prices</button>
    </div>
  </div>

  <!-- APP INFO -->
  <div class="settings-section">
    <div class="settings-title">App Information</div>

    <div class="settings-item">
      <div class="settings-item-left">
        <div class="settings-item-icon">📱</div>
        <div class="settings-item-info">
          <h4>Version</h4>
          <p>ArchitexIQ v3.0 Premium</p>
        </div>
      </div>
      <div class="settings-item-right">v3.0</div>
    </div>

    <div class="settings-item">
      <div class="settings-item-left">
        <div class="settings-item-icon">🇰🇪</div>
        <div class="settings-item-info">
          <h4>Region</h4>
          <p>Kenya — KES Currency</p>
        </div>
      </div>
      <div class="settings-item-right">🇰🇪</div>
    </div>

    <div class="settings-item">
      <div class="settings-item-left">
        <div class="settings-item-icon">💾</div>
        <div class="settings-item-info">
          <h4>Saved Projects</h4>
          <p>${JSON.parse(localStorage.getItem('jp_proj') || '[]').length} projects stored locally</p>
        </div>
      </div>
    </div>
  </div>

  <!-- DATA -->
  <div class="settings-section">
    <div class="settings-title">Data Management</div>

    <div class="settings-item" onclick="clearProjects()">
      <div class="settings-item-left">
        <div class="settings-item-icon">🗑️</div>
        <div class="settings-item-info">
          <h4>Clear Saved Projects</h4>
          <p>Delete all saved calculations</p>
        </div>
      </div>
      <div class="settings-item-right" style="color:var(--red);">›</div>
    </div>

    <div class="settings-item" onclick="clearProgress()">
      <div class="settings-item-left">
        <div class="settings-item-icon">📚</div>
        <div class="settings-item-info">
          <h4>Reset Learning Progress</h4>
          <p>Clear all quiz scores and lessons</p>
        </div>
      </div>
      <div class="settings-item-right" style="color:var(--red);">›</div>
    </div>
  </div>

  <!-- LOGOUT -->
  <button class="btn btn-danger" onclick="logoutUser()" style="margin-bottom:30px;">
    🚪 Sign Out
  </button>

  <!-- CREDITS -->
  <div style="text-align:center;font-size:0.65rem;color:var(--muted);padding-bottom:20px;">
    ArchitexIQ — Calculate. Learn. Build. 🇰🇪<br>
    Built with ❤️ for Kenyan Construction
  </div>
  `;
}

// ── Update default price ──
function updateDefaultPrice(key, value) {
  const settings = getSettings();
  settings.defaultPrices[key] = parseFloat(value) || 0;
  saveSettings(settings);
}

// ── Save prices ──
function savePrices() {
  showToast('✅ Prices saved!');
}

// ── Clear projects ──
function clearProjects() {
  if (confirm('Clear all saved projects? This cannot be undone.')) {
    localStorage.removeItem('jp_proj');
    localStorage.removeItem('jp_calcs');
    showToast('🗑️ Projects cleared');
    render();
  }
}

// ── Clear progress ──
function clearProgress() {
  if (confirm('Reset all learning progress? This cannot be undone.')) {
    localStorage.removeItem('jp_prog');
    localStorage.removeItem('jp_scores');
    showToast('📚 Progress reset');
    render();
  }
}

// ── Show change password form ──
function showChangePassword() {
  const overlay = document.createElement('div');
  overlay.id = 'pwdOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:80;
    background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);
    display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  overlay.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;width:100%;max-width:340px;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700;color:var(--gold3);margin-bottom:16px;">Change Password</div>
      <div class="form-group">
        <label class="form-label">Current Password</label>
        <input type="password" id="pwdCurrent" placeholder="Enter current password">
      </div>
      <div class="form-group">
        <label class="form-label">New Password</label>
        <input type="password" id="pwdNew" placeholder="Min 6 characters">
      </div>
      <div class="form-group" style="margin-bottom:16px;">
        <label class="form-label">Confirm New Password</label>
        <input type="password" id="pwdConfirm" placeholder="Repeat new password">
      </div>
      <div id="pwdError" style="display:none;background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.3);border-radius:8px;padding:10px;font-size:0.78rem;color:var(--red);margin-bottom:12px;"></div>
      <div class="btn-row">
        <button class="btn btn-outline" onclick="document.getElementById('pwdOverlay').remove()">Cancel</button>
        <button class="btn btn-gold" onclick="doChangePassword()">Update</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── Change password logic ──
async function doChangePassword() {
  const current = document.getElementById('pwdCurrent').value;
  const newPwd = document.getElementById('pwdNew').value;
  const confirm = document.getElementById('pwdConfirm').value;
  const errorEl = document.getElementById('pwdError');

  if (!current || !newPwd || !confirm) {
    errorEl.textContent = '❌ All fields required'; errorEl.style.display = 'block'; return;
  }
  if (newPwd.length < 6) {
    errorEl.textContent = '❌ Password must be at least 6 characters'; errorEl.style.display = 'block'; return;
  }
  if (newPwd !== confirm) {
    errorEl.textContent = '❌ Passwords do not match'; errorEl.style.display = 'block'; return;
  }

  const user = getCurrentUser();
  const hashedCurrent = await hashPassword(current);
  if (user.password !== hashedCurrent) {
    errorEl.textContent = '❌ Current password incorrect'; errorEl.style.display = 'block'; return;
  }

  const users = getUsers();
  const idx = users.findIndex(u => u.username === user.username);
  users[idx].password = await hashPassword(newPwd);
  saveUsers(users);
  document.getElementById('pwdOverlay').remove();
  showToast('✅ Password updated!');
}

// ── Init theme when page loads ──
initTheme();

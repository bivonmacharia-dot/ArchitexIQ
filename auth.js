// ═══════════════════════════════════════════════════
// ArchitexIQ — AUTH SYSTEM (auth.js)
// Security: Register, Login, Sessions, Logout
// ═══════════════════════════════════════════════════

// ── Simple hash function for passwords ──
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password + 'architexiq_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Get all users from storage ──
function getUsers() {
  return JSON.parse(localStorage.getItem('aiq_users') || '[]');
}

// ── Save users to storage ──
function saveUsers(users) {
  localStorage.setItem('aiq_users', JSON.stringify(users));
}

// ── Get current session ──
function getSession() {
  const session = JSON.parse(localStorage.getItem('aiq_session') || 'null');
  if (!session) return null;
  // Session expires after 7 days
  const now = new Date().getTime();
  if (now - session.loginTime > 7 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem('aiq_session');
    return null;
  }
  return session;
}

// ── Check if user is logged in ──
function isLoggedIn() {
  return getSession() !== null;
}

// ── Get current user ──
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.username === session.username) || null;
}

// ── REGISTER new user ──
async function registerUser(fullname, username, password, confirmPassword) {
  // Validations
  if (!fullname || !username || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }
  if (username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }

  const users = getUsers();

  // Check username taken
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Username already taken' };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = {
    id: Date.now().toString(),
    fullname,
    username: username.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toLocaleDateString('en-KE'),
    role: users.length === 0 ? 'admin' : 'user', // First user is admin
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: newUser };
}

// ── LOGIN user ──
async function loginUser(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Enter username and password' };
  }

  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return { success: false, error: 'Username not found' };
  }

  const hashedPassword = await hashPassword(password);

  if (user.password !== hashedPassword) {
    return { success: false, error: 'Incorrect password' };
  }

  // Create session
  const session = {
    username: user.username,
    fullname: user.fullname,
    role: user.role,
    loginTime: new Date().getTime(),
  };
  localStorage.setItem('aiq_session', JSON.stringify(session));

  return { success: true, user };
}

// ── LOGOUT ──
function logoutUser() {
  localStorage.removeItem('aiq_session');
  showAuthScreen('login');
}

// ═══════════════════════════════════════════════════
// AUTH UI — Screens
// ═══════════════════════════════════════════════════
function showAuthScreen(view = 'login') {
  // Hide main app
  document.getElementById('statusBar').style.display = 'none';
  document.getElementById('appHeader').style.display = 'none';
  document.getElementById('scrollArea').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('chatFab').style.display = 'none';

  // Show auth overlay
  let overlay = document.getElementById('authOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  overlay.innerHTML = view === 'login' ? renderLoginScreen() : renderRegisterScreen();
}

function showMainApp() {
  // Hide auth
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.style.display = 'none';

  // Show main app
  document.getElementById('statusBar').style.display = 'flex';
  document.getElementById('appHeader').style.display = 'flex';
  document.getElementById('scrollArea').style.display = 'flex';
  document.getElementById('bottomNav').style.display = 'flex';

  // Update header with user info
  const user = getCurrentUser();
  if (user) {
    const logo = document.getElementById('appLogo');
    if (logo) logo.title = `Logged in as ${user.fullname}`;
  }

  // Initialize app
  render();
}

function renderLoginScreen() {
  return `
  <div style="
    min-height:100vh;width:100%;
    background:var(--bg);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:24px;
    background:radial-gradient(ellipse at 50% 0%,rgba(244,124,32,0.1) 0%,var(--bg) 60%);
  ">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:var(--gold2);letter-spacing:2px;">
        Architex<span style="color:var(--text);">IQ</span>
      </div>
      <div style="font-size:0.65rem;letter-spacing:4px;text-transform:uppercase;color:var(--muted2);margin-top:4px;">
        Calculate · Learn · Build
      </div>
    </div>

    <!-- Card -->
    <div style="
      width:100%;max-width:360px;
      background:var(--card);
      border:1px solid var(--border);
      border-radius:20px;padding:28px;
    ">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;margin-bottom:4px;color:var(--gold3);">Welcome Back</div>
      <div style="font-size:0.78rem;color:var(--muted2);margin-bottom:24px;">Sign in to your ArchitexIQ account</div>

      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Username</label>
        <input type="text" id="loginUsername" placeholder="Enter your username" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;" onkeydown="if(event.key==='Enter')doLogin()">
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Password</label>
        <div style="position:relative;">
          <input type="password" id="loginPassword" placeholder="Enter your password" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;" onkeydown="if(event.key==='Enter')doLogin()">
          <span onclick="togglePwd('loginPassword')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:1rem;">👁️</span>
        </div>
      </div>

      <!-- Error message -->
      <div id="loginError" style="display:none;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:8px;padding:10px 14px;font-size:0.78rem;color:var(--red);margin-bottom:14px;"></div>

      <button onclick="doLogin()" style="width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;margin-bottom:14px;">
        Sign In →
      </button>

      <div style="text-align:center;font-size:0.78rem;color:var(--muted2);">
        Don't have an account? 
        <span onclick="showAuthScreen('register')" style="color:var(--gold);cursor:pointer;font-weight:600;">Create one</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;font-size:0.65rem;color:var(--muted);text-align:center;">
      🔐 Secured by ArchitexIQ · Kenya 🇰🇪
    </div>
  </div>`;
}

function renderRegisterScreen() {
  return `
  <div style="
    min-height:100vh;width:100%;
    background:var(--bg);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:24px;
    background:radial-gradient(ellipse at 50% 0%,rgba(244,124,32,0.1) 0%,var(--bg) 60%);
    overflow-y:auto;
  ">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--gold2);">
        Architex<span style="color:var(--text);">IQ</span>
      </div>
    </div>

    <!-- Card -->
    <div style="
      width:100%;max-width:360px;
      background:var(--card);
      border:1px solid var(--border);
      border-radius:20px;padding:28px;
    ">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;margin-bottom:4px;color:var(--gold3);">Create Account</div>
      <div style="font-size:0.78rem;color:var(--muted2);margin-bottom:24px;">Join ArchitexIQ today — it's free</div>

      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Full Name</label>
        <input type="text" id="regFullname" placeholder="e.g. John Kamau" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;">
      </div>

      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Username</label>
        <input type="text" id="regUsername" placeholder="Choose a username" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;">
      </div>

      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Password</label>
        <div style="position:relative;">
          <input type="password" id="regPassword" placeholder="Min 6 characters" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;">
          <span onclick="togglePwd('regPassword')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:1rem;">👁️</span>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;font-size:0.68rem;font-weight:600;color:var(--muted2);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Confirm Password</label>
        <input type="password" id="regConfirm" placeholder="Repeat your password" style="width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;" onkeydown="if(event.key==='Enter')doRegister()">
      </div>

      <!-- Error -->
      <div id="regError" style="display:none;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:8px;padding:10px 14px;font-size:0.78rem;color:var(--red);margin-bottom:14px;"></div>

      <!-- Success -->
      <div id="regSuccess" style="display:none;background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:8px;padding:10px 14px;font-size:0.78rem;color:var(--green);margin-bottom:14px;"></div>

      <button onclick="doRegister()" style="width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;margin-bottom:14px;">
        Create Account →
      </button>

      <div style="text-align:center;font-size:0.78rem;color:var(--muted2);">
        Already have an account? 
        <span onclick="showAuthScreen('login')" style="color:var(--gold);cursor:pointer;font-weight:600;">Sign in</span>
      </div>
    </div>

    <div style="margin-top:24px;font-size:0.65rem;color:var(--muted);text-align:center;">
      🔐 Secured by ArchitexIQ · Kenya 🇰🇪
    </div>
  </div>`;
}

// ── Toggle password visibility ──
function togglePwd(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ── Handle Login button ──
async function doLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  // Show loading
  errorEl.style.display = 'none';

  const result = await loginUser(username, password);

  if (result.success) {
    showMainApp();
  } else {
    errorEl.textContent = '❌ ' + result.error;
    errorEl.style.display = 'block';
  }
}

// ── Handle Register button ──
async function doRegister() {
  const fullname = document.getElementById('regFullname').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const errorEl = document.getElementById('regError');
  const successEl = document.getElementById('regSuccess');

  errorEl.style.display = 'none';
  successEl.style.display = 'none';

  const result = await registerUser(fullname, username, password, confirm);

  if (result.success) {
    successEl.textContent = '✅ Account created! Signing you in...';
    successEl.style.display = 'block';
    // Auto login after register
    setTimeout(async () => {
      await loginUser(username, password);
      showMainApp();
    }, 1500);
  } else {
    errorEl.textContent = '❌ ' + result.error;
    errorEl.style.display = 'block';
  }
}

// ═══════════════════════════════════════════════════
// INIT — Check login on page load
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showMainApp();
  } else {
    showAuthScreen('login');
  }
});

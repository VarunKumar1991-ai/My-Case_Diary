const STORAGE_KEY = 'mcd_cases_v2';
const USER_KEY = 'mcd_users_v2';
const SESSION_KEY = 'mcd_session_v2';
const THEME_KEY = 'mcd_theme_v2';
const WRITING_MODE_KEY = 'mcd_writing_mode_v2';

// --- Theme Management ---
function initTheme() {
    const theme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.innerText = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

function initWritingMode() {
    const select = document.getElementById('writingModeSelect');
    const textarea = document.getElementById('description');
    if (!select || !textarea) return;

    const savedMode = localStorage.getItem(WRITING_MODE_KEY) || 'default';
    select.value = savedMode;
    applyWritingMode(savedMode, textarea);

    select.addEventListener('change', (e) => {
        const mode = e.target.value;
        applyWritingMode(mode, textarea);
        localStorage.setItem(WRITING_MODE_KEY, mode);
    });
}

function applyWritingMode(mode, textarea) {
    // Remove existing mode classes
    textarea.classList.remove('writing-mode-default', 'writing-mode-dark', 'writing-mode-terminal', 'writing-mode-comfort');
    // Add the selected one
    textarea.classList.add('writing-mode-' + mode);
}

// --- Auth Management ---
function signup(e) {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    if (users[mobile]) {
        alert("User already exists!");
        return;
    }
    
    users[mobile] = { password };
    localStorage.setItem(USER_KEY, JSON.stringify(users));
    alert("Signup successful! Please sign in.");
    window.location.href = 'index.html';
}

function signin(e) {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    
    if (users[mobile] && users[mobile].password === password) {
        localStorage.setItem(SESSION_KEY, mobile);
        window.location.href = 'dashboard.html';
    } else {
        alert("Invalid credentials!");
    }
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}

// --- Case Management ---
function saveCase(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const number = document.getElementById('number').value;
    const description = document.getElementById('description').value;

    const newCase = {
        id: Date.now().toString(),
        title,
        number,
        description,
        date: new Date().toLocaleDateString()
    };

    let cases = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    cases.push(newCase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));

    alert("Case saved successfully!");
    document.getElementById('caseForm').reset();
}

function loadCases() {
    const caseList = document.getElementById('caseList');
    if (!caseList) return;

    const cases = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    if (cases.length === 0) {
        caseList.innerHTML = "<p>No cases found.</p>";
        return;
    }

    cases.sort((a,b) => b.id - a.id);

    caseList.innerHTML = cases.map(c => `
        <div class="case-card">
            <div class="flex-between">
                <h3>${c.title} (#${c.number})</h3>
                <button class="btn btn-danger" onclick="deleteCase('${c.id}')">Delete</button>
            </div>
            <p><strong>Date:</strong> ${c.date}</p>
            <p style="white-space: pre-wrap; margin-bottom: 0;">${c.description}</p>
        </div>
    `).join('');
}

function deleteCase(id) {
    if(confirm("Are you sure you want to delete this case?")) {
        let cases = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        cases = cases.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
        loadCases();
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Auth Check
    if(window.location.pathname.endsWith('.html') || window.location.pathname === '/' || window.location.pathname === '') {
        const session = localStorage.getItem(SESSION_KEY);
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isAuthPage = currentPage === 'index.html' || currentPage === 'signup.html' || currentPage === '';
        
        if (!session && !isAuthPage) {
            window.location.href = 'index.html';
        } else if (session && isAuthPage) {
            window.location.href = 'dashboard.html';
        }
    }

    if (document.getElementById('signinForm')) {
        document.getElementById('signinForm').addEventListener('submit', signin);
    }
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', signup);
    }
    if (document.getElementById('caseForm')) {
        document.getElementById('caseForm').addEventListener('submit', saveCase);
    }
    
    initWritingMode();
    loadCases();
});

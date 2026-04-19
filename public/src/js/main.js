/**
 * main.js
 * NextRole Common JavaScript Logic
 */

// Theme Management
const initTheme = () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
};

const initGlobalStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --primary: #1e40af;
            --primary-light: #3b82f6;
        }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .dark .text-primary { color: var(--primary-light); }
        .dark .bg-primary { background-color: var(--primary-light); }
        .dark .border-primary { border-color: var(--primary-light); }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #cbd5e1;
            transition: .4s;
            border-radius: 24px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input:checked + .toggle-slider {
            background-color: var(--primary);
        }
        input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }
        .profile-dropdown {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 1rem;
            width: 18rem;
            background-color: white;
            border: 1px solid #f1f5f9;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border-radius: 1.5rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(0.5rem);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            overflow: hidden;
        }
        .dark .profile-dropdown {
            background-color: #0f172a;
            border-color: #1e293b;
        }
        .profile-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
};

// Scroll Reveal Animations
const initScrollReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// Language Management
let currentLang = localStorage.getItem('language') || 'en';

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updateContent();
};

const updateContent = () => {
    const langData = window.translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            if (el.placeholder !== undefined) {
                el.placeholder = langData[key];
            } else {
                el.innerHTML = langData[key];
            }
        }
    });

    // Update language indicator text
    const langIndicator = document.getElementById('lang-indicator');
    if (langIndicator) {
        langIndicator.innerText = currentLang === 'en' ? 'EN/ខ្មែរ' : 'ខ្មែរ/EN';
    }

    document.documentElement.lang = currentLang;
};

const initNavigation = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const navItems = [
        { key: 'nav-home', url: 'index.html' },
        {
            key: 'nav-jobs', url: 'jobs.html', dropdown: [
                { key: 'jobs-browse', url: 'jobs.html' },
                { key: 'jobs-reviews', url: 'reviews.html' },
                { key: 'jobs-salary', url: 'salary.html' }
            ]
        },
        {
            key: 'nav-media', url: 'media.html', dropdown: [
                { key: 'nav-media-news', url: 'media.html#news' },
                { key: 'nav-media-blog', url: 'media.html#blog' },
                { key: 'nav-media-videos', url: 'media.html#videos' }
            ]
        },
        {
            key: 'nav-cv-builder', url: 'cv-builder.html', dropdown: [
                { key: 'nav-cv-build', url: 'cv-builder.html' },
                { key: 'nav-cv-templates', url: 'cv-builder.html#templates' }
            ]
        },
        { key: 'nav-about', url: 'about.html' },
        { key: 'nav-contact', url: 'contact.html' }
    ];

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navHtml = navItems.map(item => {
        const isParentActive = item.dropdown ? item.dropdown.some(sub => currentPath === sub.url) : false;
        const isActive = currentPath === item.url || isParentActive;
        const activeClass = isActive ? 'text-primary' : '';
        const borderClass = isActive ? 'w-full' : 'w-0 group-hover:w-full';

        if (item.dropdown) {
            return `
                <div class="relative group flex flex-col items-center">
                    <button class="flex items-center gap-1 hover:text-primary pb-3 transition-colors group ${activeClass}" onclick="window.location.href='${item.url}'">
                        <span data-i18n="${item.key}"></span>
                        <span class="material-symbols-outlined text-lg transition-transform group-hover:rotate-180">expand_more</span>
                    </button>
                    <div class="absolute bottom-0 left-0 ${borderClass} h-0.5 bg-primary rounded-full transition-all duration-300"></div>
                    <div class="absolute left-0 mt-10 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                        <div class="p-2">
                            ${item.dropdown.map(sub => `
                                <a href="${sub.url}" class="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium" data-i18n="${sub.key}"></a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="relative group flex flex-col items-center">
                <a href="${item.url}" class="hover:text-primary pb-3 transition-all ${activeClass}" data-i18n="${item.key}"></a>
                <div class="absolute bottom-0 left-0 ${borderClass} h-0.5 bg-primary rounded-full transition-all duration-300"></div>
            </div>
        `;
    }).join('');

    nav.innerHTML = navHtml;
    updateContent(); // Re-run to translate the newly injected nav
};

// Search & Filtering Logic
// Search & Filtering Logic
const handleHPSearch = () => {
    const query = document.getElementById('hp-search-query').value;
    const location = document.getElementById('hp-search-location').value;
    window.location.href = `jobs.html?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
};

const handleCategorySearch = (category) => {
    window.location.href = `jobs.html?q=${encodeURIComponent(category)}`;
};

const handleJobsSearch = () => {
    const query = document.getElementById('jobs-search-query')?.value || "";
    const location = document.getElementById('jobs-search-location')?.value || "";
    applyFilters(query, location);
};

const handleFilterChange = () => {
    handleJobsSearch();
};

const applyFilters = (query = "", location = "") => {
    const jobCards = document.querySelectorAll('.job-card');

    // Get selected job types
    const selectedTypes = [];
    if (document.getElementById('filter-fulltime')?.checked) selectedTypes.push('Full-time');
    if (document.getElementById('filter-contract')?.checked) selectedTypes.push('Contract');
    if (document.getElementById('filter-remote')?.checked) selectedTypes.push('Remote');

    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);

    jobCards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase();
        const companyText = card.querySelector('.flex.items-center.gap-2').innerText.toLowerCase();
        const cardType = card.getAttribute('data-type');
        const cardCategory = card.getAttribute('data-category');

        // Extract location from card
        const infoItems = card.querySelectorAll('.flex.items-center.gap-2');
        let jobLoc = "";
        infoItems.forEach(item => {
            if (item.querySelector('.material-symbols-outlined')?.textContent === 'location_on') {
                jobLoc = item.textContent.replace('location_on', '').trim();
            }
        });

        const matchesQuery = !query || title.includes(query.toLowerCase()) || companyText.includes(query.toLowerCase());
        const matchesLocation = !location || jobLoc.toLowerCase().includes(location.toLowerCase());
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(cardType);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(cardCategory);

        if (matchesQuery && matchesLocation && matchesType && matchesCategory) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
};

// Check for URL params on jobs page
const checkUrlParams = () => {
    if (window.location.pathname.includes('jobs.html')) {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const l = params.get('l');

        if (q || l) {
            setTimeout(() => {
                if (document.getElementById('jobs-search-query')) document.getElementById('jobs-search-query').value = q || "";
                if (document.getElementById('jobs-search-location')) document.getElementById('jobs-search-location').value = l || "";

                // If q matches a category, we might want to check that box
                if (q) {
                    const categoryCheckbox = document.querySelector(`input[name="category"][value="${q}"]`);
                    if (categoryCheckbox) {
                        categoryCheckbox.checked = true;
                    }
                }

                applyFilters(q, l);
            }, 300);
        } else {
            // Run initial filter if no params (to respect default checkboxes)
            setTimeout(() => applyFilters(), 300);
        }
    }
};

// Authentication Simulation
const checkAuth = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

const showApplyModal = (jobTitle) => {
    const langData = window.translations[currentLang];
    const modalId = 'applyModal';

    // Remove existing modal if any
    document.getElementById(modalId)?.remove();

    const modalHtml = `
        <div id="${modalId}" class="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
            <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-100 dark:border-slate-800 reveal active">
                <!-- Header -->
                <div class="bg-gradient-to-r from-primary to-primary-light p-8 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <h3 class="text-2xl font-extrabold mb-1">${langData['apply-modal-title']}</h3>
                            <p class="text-white/80 font-bold text-sm tracking-wide uppercase">${jobTitle}</p>
                        </div>
                        <button onclick="this.closest('#${modalId}').remove()" class="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <!-- Form -->
                <form id="applyForm" class="p-8 space-y-6">
                    <div>
                        <label class="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">${langData['apply-major-label']}</label>
                        <div class="relative group">
                            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">school</span>
                            <input type="text" required placeholder="${langData['apply-major-placeholder']}" class="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium text-sm">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">${langData['apply-cv-label']}</label>
                        <div class="relative group">
                            <input type="file" id="cvUpload" class="hidden" accept=".pdf,.doc,.docx" required>
                            <label for="cvUpload" class="flex items-center gap-4 w-full px-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary dark:hover:border-primary transition-all cursor-pointer group/upload">
                                <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover/upload:text-primary group-hover/upload:scale-110 transition-all shadow-sm">
                                    <span class="material-symbols-outlined">cloud_upload</span>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-bold text-slate-700 dark:text-slate-200" id="fileName">${langData['apply-cv-placeholder']}</p>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF, DOCX (Max 5MB)</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-gradient-to-r from-primary to-primary-light text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1 transition-all mt-4">
                        ${langData['apply-submit']}
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // File input preview
    document.getElementById('cvUpload')?.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name || langData['apply-cv-placeholder'];
        document.getElementById('fileName').textContent = fileName;
        document.getElementById('fileName').classList.add('text-primary');
    });

    // Handle submit
    document.getElementById('applyForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span>`;

        setTimeout(() => {
            alert(langData['apply-success']);
            document.getElementById(modalId).remove();
        }, 1500);
    });
};

const showPasswordModal = () => {
    const langData = window.translations[currentLang];
    const modalId = 'passwordModal';

    document.getElementById(modalId)?.remove();

    const modalHtml = `
        <div id="${modalId}" class="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
            <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-100 dark:border-slate-800 reveal active">
                <div class="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <h3 class="text-2xl font-extrabold mb-1" data-i18n="profile-password">${langData['profile-password']}</h3>
                        </div>
                        <button onclick="this.closest('#${modalId}').remove()" class="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <form id="passwordForm" class="p-8 space-y-6">
                    <div>
                        <label class="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">Current Password</label>
                        <input type="password" required class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-3 ml-1 uppercase tracking-wider">New Password</label>
                        <input type="password" required class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all">
                    </div>
                    <button type="submit" class="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all mt-4">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('passwordForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span>`;

        setTimeout(() => {
            alert("Password updated successfully!");
            document.getElementById(modalId).remove();
        }, 1500);
    });
};

const handleApplyNow = (jobTitle) => {
    if (checkAuth()) {
        showApplyModal(jobTitle);
    } else {
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `login.html?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
};

const initAuthUI = () => {
    const loginBtn = document.querySelector('button[data-i18n="login-btn"]');
    if (!loginBtn) return;

    if (checkAuth()) {
        const langData = window.translations[currentLang];
        const container = loginBtn.parentElement;

        // Hide original login button
        loginBtn.style.display = 'none';

        // Check if profile is already there
        if (document.getElementById('user-profile-nav')) return;

        const profileHtml = `
            <div id="user-profile-nav" class="flex items-center gap-3 relative">
                <!-- Notifications Bell -->
                <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group">
                    <span class="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">notifications</span>
                    <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                <!-- Profile Trigger -->
                <button id="profileTrigger" class="flex items-center gap-2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-2 border-primary shadow-sm hover:scale-105 active:scale-95">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                        <img src="https://ui-avatars.com/api/?name=P&background=1e40af&color=fff&bold=true" alt="Profile" class="w-full h-full object-cover">
                    </div>
                </button>

                <!-- Dropdown Menu -->
                <div id="profileDropdown" class="profile-dropdown">
                    <!-- User Info Section -->
                    <div class="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-primary">
                            <img src="https://ui-avatars.com/api/?name=P&background=1e40af&color=fff&bold=true" alt="Profile" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-extrabold text-slate-900 dark:text-white" data-i18n="profile-name">${langData['profile-name']}</h4>
                        </div>
                    </div>

                    <!-- Notification Toggle -->
                    <div class="px-6 py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <span class="text-sm font-bold text-slate-600 dark:text-slate-400" data-i18n="profile-notify">${langData['profile-notify']}</span>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Menu List -->
                    <div class="p-2">
                        <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group/item">
                            <span class="material-symbols-outlined text-slate-400 group-hover/item:text-primary transition-colors">grid_view</span>
                            <span data-i18n="profile-dashboard">${langData['profile-dashboard']}</span>
                        </a>
                        <a href="cv-builder.html" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group/item">
                            <span class="material-symbols-outlined text-slate-400 group-hover/item:text-primary transition-colors">description</span>
                            <span data-i18n="profile-cv">${langData['profile-cv']}</span>
                        </a>
                        <a href="saved-jobs.html" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group/item">
                            <span class="material-symbols-outlined text-slate-400 group-hover/item:text-primary transition-colors">work_update</span>
                            <span data-i18n="profile-saved">${langData['profile-saved']}</span>
                        </a>
                        <button id="changePassBtn" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-slate-700 dark:bg-slate-800 rounded-xl transition-all shadow-lg text-left">
                            <span class="material-symbols-outlined">password</span>
                            <span data-i18n="profile-password">${langData['profile-password']}</span>
                        </button>
                        <button id="signOutBtn" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all group/item mt-1">
                            <span class="material-symbols-outlined text-rose-400 group-hover/item:text-rose-500 transition-colors">logout</span>
                            <span data-i18n="profile-signout">${langData['profile-signout']}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', profileHtml);

        // Toggle Logic
        const trigger = document.getElementById('profileTrigger');
        const dropdown = document.getElementById('profileDropdown');

        trigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown?.contains(e.target) && !trigger?.contains(e.target)) {
                dropdown?.classList.remove('active');
            }
        });

        // Sign Out Logic
        document.getElementById('signOutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
        });

        // Change Password Logic
        document.getElementById('changePassBtn')?.addEventListener('click', () => {
            showPasswordModal();
            dropdown?.classList.remove('active');
        });

    } else {
        loginBtn.style.display = 'block';
        loginBtn.onclick = () => window.location.href = 'login.html';
    }
};

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initGlobalStyles();
    initTheme();
    initNavigation();
    initScrollReveal();
    updateContent();
    checkUrlParams();
    initAuthUI();
});

// Export functions to window
window.toggleTheme = toggleTheme;
window.setLanguage = setLanguage;
window.getCurrentLang = () => currentLang;
window.handleHPSearch = handleHPSearch;
window.handleJobsSearch = handleJobsSearch;
window.handleCategorySearch = handleCategorySearch;
window.handleFilterChange = handleFilterChange;
window.handleApplyNow = handleApplyNow;
window.checkAuth = checkAuth;

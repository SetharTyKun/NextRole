(function () {
    // ── Elements ────────────────────────────────────────────────────────────
    const searchQuery      = document.getElementById('jobs-search-query');
    const searchLocation   = document.getElementById('jobs-search-location');
    const filterFulltime   = document.getElementById('filter-fulltime');
    const filterContract   = document.getElementById('filter-contract');
    const filterRemote     = document.getElementById('filter-remote');
    const categoryBoxes    = document.querySelectorAll('input[name="category"]');
    const salarySlider     = document.querySelector('input[type="range"]');
    const salaryMaxLabel   = document.getElementById('salary-max-label');
    const experienceSelect = document.getElementById('filter-experience');
    const cards            = document.querySelectorAll('.job-card');
    const cardFeed         = cards.length ? cards[0].parentElement : null;

    const SALARY_MAX = 20000;

    // ── Helpers ─────────────────────────────────────────────────────────────
    function iconSibling(card, iconName) {
        for (const icon of card.querySelectorAll('.material-symbols-outlined')) {
            if (icon.textContent.trim() === iconName) {
                return icon.nextElementSibling?.textContent.trim() || '';
            }
        }
        return '';
    }

    function parseMaxSalary(card) {
        const text = iconSibling(card, 'currency_exchange');
        const nums = text.match(/\d[\d,]*/g);
        if (!nums) return SALARY_MAX;
        const values = nums.map(n => parseInt(n.replace(/,/g, ''), 10));
        return Math.max(...values);
    }

    function formatSalary(val) {
        return val >= SALARY_MAX ? '$20k+' : '$' + val.toLocaleString();
    }

    // ── Empty state ──────────────────────────────────────────────────────────
    function getOrCreateEmptyState() {
        let el = document.getElementById('jobs-empty-state');
        if (!el && cardFeed) {
            el = document.createElement('div');
            el.id = 'jobs-empty-state';
            el.className = 'hidden col-span-full py-20 text-center';
            el.innerHTML = `
                <span class="material-symbols-outlined text-muted" style="font-size:3rem;">search_off</span>
                <p class="text-lg font-extrabold mt-4">No jobs match your filters.</p>
                <p class="text-sm text-muted mt-1">Try adjusting your search or clearing some filters.</p>
                <button onclick="window.handleClearFilters()"
                    class="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-all cursor-pointer">
                    Clear Filters
                </button>`;
            cardFeed.appendChild(el);
        }
        return el;
    }

    // ── Core filter logic ────────────────────────────────────────────────────
    function applyFilters() {
        const query    = searchQuery?.value.toLowerCase().trim() || '';
        const location = searchLocation?.value || '';

        // Collect active job-type checks (OR within type)
        const activeTypes = [];
        if (filterFulltime?.checked) activeTypes.push('full-time');
        if (filterContract?.checked) activeTypes.push('contract');
        if (filterRemote?.checked)   activeTypes.push('remote');

        // Collect active category checks (OR within category)
        const activeCategories = Array.from(categoryBoxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        const maxSalary    = salarySlider    ? parseInt(salarySlider.value)    : SALARY_MAX;
        const expFilter    = experienceSelect ? experienceSelect.value         : 'All Levels';

        let visibleCount = 0;

        cards.forEach(card => {
            const cardType       = (card.dataset.type       || '').toLowerCase();
            const cardCategory   = (card.dataset.category   || '').toLowerCase();
            const cardExperience = (card.dataset.experience || '').toLowerCase();
            const cardTitle      = (card.querySelector('h4')?.textContent || '').toLowerCase();
            const cardCompany    = iconSibling(card, 'apartment').toLowerCase();
            const cardLocation   = iconSibling(card, 'location_on');
            const cardSalaryMax  = parseMaxSalary(card);

            // 1. Keyword: matches title or company name
            if (query && !cardTitle.includes(query) && !cardCompany.includes(query)) {
                return hide(card);
            }

            // 2. Location: "Remote" matches "Remote, Global"; province matches exactly
            if (location) {
                const loc = location.toLowerCase();
                if (!cardLocation.toLowerCase().includes(loc)) return hide(card);
            }

            // 3. Job type (skip if no box checked — show all)
            if (activeTypes.length > 0 && !activeTypes.includes(cardType)) {
                return hide(card);
            }

            // 4. Category (skip if no box checked — show all)
            if (activeCategories.length > 0 && !activeCategories.includes(cardCategory)) {
                return hide(card);
            }

            // 5. Salary max
            if (maxSalary < SALARY_MAX && cardSalaryMax > maxSalary) {
                return hide(card);
            }

            // 6. Experience level
            if (expFilter !== 'All Levels' && cardExperience) {
                if (!cardExperience.includes(expFilter.toLowerCase())) return hide(card);
            }

            show(card);
            visibleCount++;
        });

        const emptyState = getOrCreateEmptyState();
        if (emptyState) {
            emptyState.classList.toggle('hidden', visibleCount > 0);
        }
    }

    function hide(card) {
        card.style.display = 'none';
    }

    function show(card) {
        card.style.display = '';
    }

    // ── Salary slider label ──────────────────────────────────────────────────
    function initSalarySlider() {
        if (!salarySlider) return;
        salarySlider.min   = 0;
        salarySlider.max   = SALARY_MAX;
        salarySlider.value = SALARY_MAX;
        if (salaryMaxLabel) salaryMaxLabel.textContent = '$20k+';

        salarySlider.addEventListener('input', function () {
            const val = parseInt(this.value);
            if (salaryMaxLabel) salaryMaxLabel.textContent = formatSalary(val);
            applyFilters();
        });
    }

    // ── Clear all filters ────────────────────────────────────────────────────
    window.handleClearFilters = function () {
        if (searchQuery)    searchQuery.value    = '';
        if (searchLocation) searchLocation.value = '';
        if (filterFulltime) filterFulltime.checked = true;
        if (filterContract) filterContract.checked = false;
        if (filterRemote)   filterRemote.checked   = false;
        categoryBoxes.forEach(cb => cb.checked = false);
        if (salarySlider)     { salarySlider.value = SALARY_MAX; }
        if (salaryMaxLabel)   { salaryMaxLabel.textContent = '$20k+'; }
        if (experienceSelect) { experienceSelect.value = 'All Levels'; }
        applyFilters();
    };

    // ── Apply Now ────────────────────────────────────────────────────────────
    window.handleApplyNow = function (jobTitle) {
        alert('Applying for: ' + jobTitle + '\n\nThis feature is coming soon!');
    };

    // ── Expose to inline handlers ────────────────────────────────────────────
    window.handleJobsSearch    = applyFilters;
    window.handleFilterChange  = applyFilters;

    // ── Wire up experience select ────────────────────────────────────────────
    if (experienceSelect) {
        experienceSelect.addEventListener('change', applyFilters);
    }

    // ── Read URL params (coming from home page search) ───────────────────────
    function readUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const q   = params.get('q');
        const loc = params.get('location');
        if (q   && searchQuery)    searchQuery.value    = q;
        if (loc && searchLocation) searchLocation.value = loc;
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    initSalarySlider();
    readUrlParams();
    applyFilters();
})();

(function () {
    const input    = document.getElementById('hero-search-query');
    const location = document.getElementById('hero-search-location');
    const btn      = document.getElementById('hero-search-btn');

    function doSearch() {
        const params = new URLSearchParams();
        const q   = input?.value.trim()  || '';
        const loc = location?.value      || '';
        if (q)   params.set('q', q);
        if (loc) params.set('location', loc);
        const qs = params.toString();
        window.location.href = '/pages/job.html' + (qs ? '?' + qs : '');
    }

    btn?.addEventListener('click', doSearch);
    input?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doSearch();
    });
})();

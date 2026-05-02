(function () {
  var overlay = document.createElement('div');
  overlay.id = 'heroLightbox';
  overlay.style.cssText = [
    'display:none',
    'position:fixed',
    'inset:0',
    'z-index:9999',
    'background:rgba(0,0,0,0.82)',
    'align-items:center',
    'justify-content:center',
    'cursor:zoom-out',
    'backdrop-filter:blur(6px)',
    '-webkit-backdrop-filter:blur(6px)',
    'padding:24px',
    'animation:none',
  ].join(';');

  var img = document.createElement('img');
  img.style.cssText = [
    'max-width:90vw',
    'max-height:88vh',
    'object-fit:contain',
    'border-radius:14px',
    'box-shadow:0 32px 80px rgba(0,0,0,0.65)',
    'cursor:default',
    'transition:transform 0.25s ease',
  ].join(';');

  var closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.style.cssText = [
    'position:fixed',
    'top:20px',
    'right:24px',
    'width:44px',
    'height:44px',
    'border-radius:50%',
    'background:rgba(255,255,255,0.15)',
    'border:none',
    'color:white',
    'font-size:28px',
    'line-height:1',
    'cursor:pointer',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'transition:background 0.2s',
  ].join(';');

  closeBtn.onmouseenter = function () { this.style.background = 'rgba(255,255,255,0.28)'; };
  closeBtn.onmouseleave = function () { this.style.background = 'rgba(255,255,255,0.15)'; };

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    img.src = '';
  }

  overlay.addEventListener('click', function (e) {
    if (e.target !== img) close();
  });

  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  function attachHandlers() {
    var carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    carousel.querySelectorAll('.hero-slide').forEach(function (slide) {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', function () {
        open(slide.src, slide.alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    attachHandlers();
  }
})();

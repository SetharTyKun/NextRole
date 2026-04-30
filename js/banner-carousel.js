(function () {
  const track = document.getElementById('banner-track');
  const SPEED = 0.8; // px per frame
  let x = window.innerWidth; // start fully off-screen right
  let loopWidth = 0;

  function tick() {
    x -= SPEED;
    if (x <= -loopWidth) x += loopWidth; // seamless reset
    track.style.transform = 'translateX(' + x + 'px)';
    requestAnimationFrame(tick);
  }

  window.addEventListener('load', function () {
    // Full scrollWidth = one loop unit (no duplicate set in HTML, so clone to fill)
    loopWidth = track.scrollWidth;

    // Clone items until track is at least 3× the viewport wide
    const originals = Array.from(track.children);
    while (track.scrollWidth < window.innerWidth * 3) {
      originals.forEach(function (item) {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }

    requestAnimationFrame(tick);
  });
})();

(function () {
  const track = document.getElementById('featured-track');
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
    // Width of one logo set (first 6 logos) = the loop unit
    loopWidth = track.scrollWidth / 2;

    // Clone logo items until the track is at least 3× the viewport wide,
    // ensuring logos always flow in from the right with no visible gap
    const originals = Array.from(track.children).slice(0, track.children.length / 2);
    while (track.scrollWidth < window.innerWidth * 3) {
      originals.forEach(function (item) {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }

    requestAnimationFrame(tick);
  });
})();

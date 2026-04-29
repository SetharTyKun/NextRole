(function () {
  var carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  var slides  = Array.from(carousel.querySelectorAll('.hero-slide'));
  var dots    = Array.from(carousel.querySelectorAll('.hero-dot'));
  var current = 0;
  var busy    = false;

  var DOT_ACTIVE   = ['bg-white', 'w-5'];
  var DOT_INACTIVE = ['bg-white/40', 'w-2'];

  slides[0].style.zIndex = '2';

  function goTo(next, dir) {
    if (busy || next === current) return;
    busy = true;
    var prev = current;

    slides[next].style.transition = 'none';
    slides[next].style.transform  = dir > 0 ? 'translateX(100%)' : 'translateX(-100%)';
    slides[next].style.zIndex     = '3';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        slides[next].style.transition = 'transform 0.42s ease';
        slides[next].style.transform  = 'translateX(0)';

        dots[prev].classList.remove.apply(dots[prev].classList, DOT_ACTIVE);
        dots[prev].classList.add.apply(dots[prev].classList, DOT_INACTIVE);
        dots[next].classList.remove.apply(dots[next].classList, DOT_INACTIVE);
        dots[next].classList.add.apply(dots[next].classList, DOT_ACTIVE);

        current = next;

        setTimeout(function () {
          slides[prev].style.zIndex    = '1';
          slides[next].style.zIndex    = '2';
          slides[next].style.transition = '';
          busy = false;
        }, 440);
      });
    });
  }

  carousel.querySelector('.hero-prev').addEventListener('click', function () {
    goTo((current - 1 + slides.length) % slides.length, -1);
  });
  carousel.querySelector('.hero-next').addEventListener('click', function () {
    goTo((current + 1) % slides.length, 1);
  });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i, i > current ? 1 : -1); });
  });

  setInterval(function () { goTo((current + 1) % slides.length, 1); }, 3500);
})();

// navbar.js
async function loadNavbar() {
  const res = await fetch('/components/navbar.html');
  const html = await res.text();

  const placeholder = document.getElementById('navbar');
  placeholder.innerHTML = html;

  // Highlight the active link
  const links = placeholder.querySelectorAll('a[href]');
  links.forEach(link => {
    const isActive = window.location.pathname === new URL(link.href).pathname;
    if (isActive) {
      link.classList.add('text-primary', 'bg-violet-light');
      link.classList.remove('text-muted');
    } else {
      link.classList.remove('text-primary', 'bg-violet-light');
      link.classList.add('text-muted');
    }
  });
}

loadNavbar();
// /components/footer.js
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-secondary text-white/80 px-20 pt-12 pb-6">
        <div class="grid grid-cols-[2fr_1fr_1fr] gap-12 mb-10">

          <div>
            <div class="flex items-center gap-2 text-[18px] font-extrabold text-white mb-3.5">
              <img src="/asset/logo.svg" alt="NextRole" width="28" height="28" class="w-7 h-7"/>
              NextRole
            </div>
            <div class="text-[13px] text-white/55 leading-[1.7] max-w-[280px]">
              Connecting students and job seekers to the right opportunities. Your next career move starts here.
            </div>
            <div class="flex gap-4 mt-5">
              <img src="/asset/twitter-x.svg" alt="x" class="cursor-pointer">
              <img src="/asset/facebook.svg" alt="facebook" class="cursor-pointer">
              <img src="/asset/instagram.svg" alt="instagram" class="cursor-pointer">
              <img src="/asset/linkedin.svg" alt="linkedin" class="cursor-pointer">
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold text-white mb-4">Explore</h4>
            <a href="/pages/about.html" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">About Us</a>
            <a href="/pages/job.html" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Jobs</a>
            <a href="/pages/media.html" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Media</a>
            <a href="/pages/resources.html" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Resources</a>
          </div>

          <div>
            <h4 class="text-sm font-bold text-white mb-4">Login</h4>
            <a href="/pages/login.html?role=employer" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Posting Table</a>
            <a href="/pages/login.html?role=seeker" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Job Seeker</a>
            <a href="/pages/login.html?role=employer" class="block text-[13px] text-white/55 mb-2.5 hover:text-white transition-colors">Employer</a>
          </div>

        </div>
        <div class="border-t border-white/10 pt-5 text-center text-xs text-white/35">
          © 2026 NextRole. All rights reserved.
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
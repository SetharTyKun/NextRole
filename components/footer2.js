// /components/footer.js
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-secondary text-white/80 px-20 pt-6 pb-6">
        <div>

          <div>
            <div class="flex items-center gap-2 text-[18px] font-extrabold text-white mb-3.5">
              <img src="/asset/logo.svg" alt="NextRole" width="28" height="28" class="w-7 h-7"/>
              NextRole
            </div>            
          </div>          

        </div>
        <div class="border-t border-white/10 pt-5 text-center text-xs text-white/35">
          © 2026 NextRole. All rights reserved.
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer2', SiteFooter);
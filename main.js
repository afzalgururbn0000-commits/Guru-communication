// GURU COMMUNICATION - CORE CLIENT APPLICATION LOGIC

function initApp() {
  const config = window.GURU_CONFIG || {};

  // 1. Initialize Lucide Icons
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  renderIcons();

  // 2. Hide Preloader Animation Safely
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 350);
  }

  // 3. Configure WhatsApp & Phone Links Across the Site
  if (config.whatsapp) {
    const defaultMsg = encodeURIComponent("Hello Guru Communication, I would like to enquire about mobile repair and technology services.");
    const defaultWhatsAppUrl = `https://wa.me/${config.whatsapp}?text=${defaultMsg}`;

    const setHref = (id, url) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('href', url);
    };

    setHref('floating-whatsapp', defaultWhatsAppUrl);
    setHref('hero-whatsapp-link', defaultWhatsAppUrl);
    setHref('mobile-whatsapp-btn', defaultWhatsAppUrl);
    setHref('form-whatsapp-btn', defaultWhatsAppUrl);
    setHref('footer-whatsapp-link', defaultWhatsAppUrl);

    // Dynamic Contact Texts
    const addressEl = document.getElementById('contact-address-text');
    if (addressEl && config.address) addressEl.textContent = config.address;

    const phoneEl = document.getElementById('contact-phone-text');
    if (phoneEl && config.phone) phoneEl.textContent = config.phone;

    const hoursEl = document.getElementById('contact-hours-text');
    if (hoursEl && config.openingHours) hoursEl.textContent = config.openingHours;

    const cleanPhone = (config.phone || '+917051383473').replace(/\s+/g, '');
    const callBtns = document.querySelectorAll('.direct-call-btn, #form-call-btn');
    callBtns.forEach(btn => btn.setAttribute('href', `tel:${cleanPhone}`));
  }

  // 4. Render Services Grid on Homepage if present
  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid && config.services) {
    servicesGrid.innerHTML = config.services.map(s => `
      <div class="glass-card rounded-2xl p-6 border border-white/10 space-y-4 hover:-translate-y-1.5 transition-all group flex flex-col justify-between">
        <div class="space-y-3">
          <div class="w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow group-hover:scale-110 transition-transform">
            <i data-lucide="${s.icon || 'smartphone'}" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-heading font-bold text-white group-hover:text-cyan-glow transition-colors">${s.title}</h3>
          <p class="text-xs sm:text-sm text-gray-400 font-body leading-relaxed">${s.desc}</p>
        </div>
        <div class="pt-3 border-t border-white/5 flex items-center justify-between">
          <a href="${s.link || 'services.html'}" class="inline-flex items-center text-xs font-mono text-cyan-glow hover:underline gap-1">
            Service Specs <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
          <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Guru Communication, I want to book: ${s.title}`)}" target="_blank" class="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            Book <i data-lucide="message-square" class="w-3 h-3"></i>
          </a>
        </div>
      </div>
    `).join('');
  }

  // 5. Render iPhone Services Grid on Homepage if present
  const iphoneGrid = document.getElementById('iphone-services-grid');
  if (iphoneGrid && config.iphoneServices) {
    iphoneGrid.innerHTML = config.iphoneServices.map(item => `
      <div class="glass-card glass-card-purple rounded-2xl p-5 border border-purple-glow/20 space-y-3 hover:border-purple-glow/60 transition-all flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-glow/20 text-purple-300 flex items-center justify-center">
              <i data-lucide="${item.icon || 'apple'}" class="w-4 h-4"></i>
            </div>
            <h4 class="font-heading font-bold text-white text-sm">${item.title}</h4>
          </div>
          <p class="text-xs text-gray-400 leading-relaxed">${item.desc}</p>
        </div>
        <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Guru Communication, I need iPhone Service: ${item.title}`)}" target="_blank" class="inline-flex items-center text-[11px] font-mono text-purple-300 hover:text-white pt-2 border-t border-white/5 gap-1">
          Enquire iPhone Fix <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    `).join('');
  }

  // 6. Render Machinery Showcase on Homepage if present
  const machineryGrid = document.getElementById('machinery-grid');
  if (machineryGrid && config.machinery) {
    machineryGrid.innerHTML = config.machinery.map(item => `
      <div class="glass-card glass-card-orange rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-orange-glow/50 transition-all">
        <div class="relative h-44 overflow-hidden bg-dark-800">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100">
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange-glow text-dark-900 font-heading font-bold text-[10px] uppercase tracking-wider">${item.badge}</span>
        </div>
        <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-mono text-orange-glow uppercase tracking-wider">${item.category}</span>
            <h4 class="text-base font-heading font-bold text-white mt-1">${item.name}</h4>
            <p class="text-xs text-gray-400 mt-2 line-clamp-2">${item.desc}</p>
          </div>
          <div class="pt-3 border-t border-white/5 space-y-2">
            <div class="text-[10px] font-mono text-gray-400 space-y-1">
              ${item.specs.map(spec => `<div class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3 h-3 text-orange-glow"></i>${spec}</div>`).join('')}
            </div>
            <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Guru Communication, I want price and details for: ${item.name}`)}" target="_blank" class="w-full mt-3 py-2.5 text-xs font-heading font-bold text-dark-900 uppercase bg-gradient-to-r from-orange-glow to-amber-500 rounded-xl text-center flex items-center justify-center gap-1.5 hover:brightness-110 transition-all">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i> Enquire Machine Price
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 7. Render Spare Parts Preview Tags
  const sparePartsContainer = document.getElementById('spare-parts-tags');
  if (sparePartsContainer && config.spareParts) {
    sparePartsContainer.innerHTML = config.spareParts.map(part => `
      <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Guru Communication, I am looking for spare part: ${part.name || part}`)}" target="_blank" class="glass-panel px-4 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-mono text-cyan-glow hover:border-cyan-glow/50 hover:scale-105 transition-all cursor-pointer flex items-center gap-2">
        <i data-lucide="cpu" class="w-4 h-4 text-cyan-glow"></i>
        ${part.name || part}
      </a>
    `).join('');
  }

  // 8. Render Accessories Preview Grid on Homepage
  const accessoriesGrid = document.getElementById('accessories-grid');
  if (accessoriesGrid && config.accessories) {
    accessoriesGrid.innerHTML = config.accessories.map(item => `
      <div class="glass-card glass-card-purple rounded-2xl p-6 border border-white/10 space-y-4 hover:border-purple-glow/40 transition-all flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono text-purple-400 uppercase tracking-widest">${item.category}</span>
            <span class="px-2 py-0.5 rounded bg-purple-glow/20 text-purple-300 text-[10px] font-mono">${item.badge}</span>
          </div>
          <h3 class="text-base font-heading font-bold text-white">${item.title}</h3>
          <p class="text-xs text-gray-400 leading-relaxed">${item.desc}</p>
        </div>
        <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Guru Communication, I want to purchase accessory: ${item.title}`)}" target="_blank" class="w-full py-2.5 text-xs font-heading font-bold text-white uppercase glass-panel border border-white/10 rounded-xl text-center flex items-center justify-center gap-1.5 hover:border-purple-glow/50 transition-all">
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-purple-400"></i> Order on WhatsApp
        </a>
      </div>
    `).join('');
  }

  // 9. Render Customer Reviews on Homepage
  const reviewsGrid = document.getElementById('reviews-grid');
  if (reviewsGrid && config.reviews) {
    reviewsGrid.innerHTML = config.reviews.map(review => `
      <div class="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex text-amber-400 gap-1">
              ${'<i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>'.repeat(review.rating)}
            </div>
            <span class="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3"></i> Verified Client
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-300 italic leading-relaxed">"${review.comment}"</p>
        </div>
        <div class="pt-3 border-t border-white/5">
          <h4 class="text-sm font-heading font-bold text-white">${review.name}</h4>
          <span class="text-[10px] font-mono text-cyan-glow">${review.service}</span>
        </div>
      </div>
    `).join('');
  }

  // Re-run icon injection for dynamically generated items
  renderIcons();

  // 10. Mobile Navigation Toggle (Bulletproof Touch & Click)
  let lastMenuToggle = 0;
  function toggleMobileMenu(forceState) {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (!drawer) return;

    const now = Date.now();
    // Debounce to prevent double-toggle on mobile touch+click events
    if (typeof forceState !== 'boolean' && now - lastMenuToggle < 300) {
      return;
    }
    lastMenuToggle = now;

    const shouldOpen = (typeof forceState === 'boolean') 
      ? forceState 
      : drawer.classList.contains('hidden');

    if (shouldOpen) {
      drawer.classList.remove('hidden');
      drawer.setAttribute('aria-expanded', 'true');
      if (btn) {
        btn.classList.add('menu-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    } else {
      drawer.classList.add('hidden');
      drawer.setAttribute('aria-expanded', 'false');
      if (btn) {
        btn.classList.remove('menu-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  }
  window.toggleMobileMenu = toggleMobileMenu;

  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (menuBtn && mobileDrawer) {
    const onToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    };

    menuBtn.onclick = onToggle;
    menuBtn.addEventListener('touchend', onToggle, { passive: false });

    // Close when tapping any nav link inside drawer
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close on outside tap or click
    const onOutside = (e) => {
      if (!mobileDrawer.contains(e.target) && !e.target.closest('#mobile-menu-btn')) {
        toggleMobileMenu(false);
      }
    };
    document.addEventListener('click', onOutside);
    document.addEventListener('touchend', onOutside, { passive: true });
  }

  // 11. Sticky Navbar Glass Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('py-2');
        navbar.classList.remove('py-4');
      } else {
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 12. Before / After Interactive Slider Handler
  const slider = document.getElementById('before-after-slider');
  const beforeLayer = document.getElementById('before-image-layer');
  if (slider && beforeLayer) {
    slider.addEventListener('input', (e) => {
      beforeLayer.style.width = `${e.target.value}%`;
    });
  }

  // 13. Contact & Enquiry Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('input[type="text"]');
      const phoneInput = contactForm.querySelector('input[type="tel"]');
      const deviceInput = contactForm.querySelector('input[placeholder*="iPhone"]') || contactForm.querySelectorAll('input[type="text"]')[1];
      const serviceSelect = contactForm.querySelector('select');
      const msgText = contactForm.querySelector('textarea');

      const name = nameInput ? nameInput.value : '';
      const phone = phoneInput ? phoneInput.value : '';
      const device = deviceInput ? deviceInput.value : 'Not specified';
      const service = serviceSelect ? serviceSelect.value : 'General Enquiry';
      const userMsg = msgText ? msgText.value : '';

      const formattedWhatsAppMsg = encodeURIComponent(
        `*New Enquiry via Guru Communication Website*\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📱 *Device:* ${device}\n` +
        `🛠️ *Service:* ${service}\n` +
        `📝 *Message:* ${userMsg || 'N/A'}`
      );

      const targetUrl = `https://wa.me/${config.whatsapp || '917051383473'}?text=${formattedWhatsAppMsg}`;
      window.open(targetUrl, '_blank');
      alert(`Thank you ${name}! Your enquiry has been received. Opening WhatsApp to connect with our master technician.`);
      contactForm.reset();
    });
  }

  // 14. Animated Stat Counters with Fallback
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length > 0) {
    if (window.gsap && window.gsap.to) {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        window.gsap.to(counter, {
          innerText: target,
          duration: 2.2,
          snap: { innerText: 1 },
          ease: 'power2.out'
        });
      });
    } else {
      // Vanilla counting animation fallback
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = current;
          }
        }, 30);
      });
    }
  }
}

// Universal initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

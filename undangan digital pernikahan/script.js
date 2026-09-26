/* ============================================================
   JAVASCRIPT — Undangan Digital Pernikahan Rizky & Nabila
   ============================================================ */

// ---- GUEST NAME FROM URL ----
(function () {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to') || params.get('nama') || params.get('guest');
  if (guest) {
    const el = document.getElementById('guest-name-display');
    if (el) el.textContent = decodeURIComponent(guest);
  }
})();

// ---- OPEN INVITATION ----
function openInvitation() {
  const cover = document.getElementById('cover-page');
  const main = document.getElementById('main-content');
  cover.classList.add('closing');
  setTimeout(() => {
    cover.style.display = 'none';
    main.classList.remove('hidden');
    document.body.style.overflow = 'auto';
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
      offset: 80,
    });
    startCountdown();
    initStickyNav();
    spawnClosingPetals();
    // Auto-play music (may be blocked by browser)
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.volume = 0.35;
      audio.play().then(() => {
        const toggle = document.getElementById('music-toggle');
        const vinyl = document.getElementById('music-vinyl');
        if (toggle) toggle.textContent = '⏸';
        if (vinyl) vinyl.classList.add('spinning');
      }).catch(() => {});
    }
  }, 800);
}

// ---- FLOATING PETALS (COVER) ----
(function spawnCoverPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;
  const symbols = ['🌸', '🌺', '🌷', '🍃', '✿', '❀'];
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.fontSize = (0.7 + Math.random() * 1.2) + 'rem';
    petal.style.animationDuration = (5 + Math.random() * 8) + 's';
    petal.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(petal);
  }
})();

function spawnClosingPetals() {
  const symbols = ['🌸', '🌺', '🌷', '🍃', '✿', '❀', '💕', '✨'];
  const body = document.body;
  setInterval(() => {
    const petal = document.createElement('div');
    petal.style.cssText = `
      position: fixed;
      top: -30px;
      left: ${Math.random() * 100}vw;
      font-size: ${0.8 + Math.random() * 1}rem;
      opacity: 0.7;
      pointer-events: none;
      z-index: 500;
      animation: petalFall ${5 + Math.random() * 6}s linear forwards;
    `;
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    body.appendChild(petal);
    setTimeout(() => petal.remove(), 12000);
  }, 1500);
}

// ---- CANVAS PARTICLES (COVER) ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = 1 + Math.random() * 2;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -0.2 - Math.random() * 0.5;
      this.alpha = 0.1 + Math.random() * 0.4;
      this.color = Math.random() > 0.5 ? '#e8c4a0' : '#f4c2c2';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ---- COUNTDOWN TIMER ----
function startCountdown() {
  const target = new Date('2027-02-15T08:00:00+07:00');

  function update() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    function fmt(n) { return String(n).padStart(2, '0'); }
    document.getElementById('cd-days').textContent = fmt(d);
    document.getElementById('cd-hours').textContent = fmt(h);
    document.getElementById('cd-minutes').textContent = fmt(m);
    document.getElementById('cd-seconds').textContent = fmt(s);
  }
  update();
  setInterval(update, 1000);
}

// ---- STICKY NAV ACTIVE STATE ----
function initStickyNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---- MUSIC PLAYER ----
let musicPlaying = false;

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const vinyl = document.getElementById('music-vinyl');

  if (musicPlaying) {
    audio.pause();
    btn.textContent = '▶';
    vinyl.classList.remove('spinning');
    musicPlaying = false;
  } else {
    audio.play();
    btn.textContent = '⏸';
    vinyl.classList.add('spinning');
    musicPlaying = true;
  }
}

// ---- LIGHTBOX ----
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  img.src = src;
  img.alt = caption;
  cap.textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Stop click propagation on image itself
document.getElementById('lightbox')?.addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// ---- RSVP FORM ----
function submitRSVP(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value.trim();
  const hadir = document.querySelector('input[name="kehadiran"]:checked')?.value;
  const guests = document.getElementById('rsvp-guests').value;

  if (!name || !hadir) return;

  // Animate button
  const btn = document.getElementById('rsvp-submit');
  btn.innerHTML = '<span>⏳ Mengirim...</span>';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('rsvp-form').classList.add('hidden');
    document.getElementById('rsvp-success').classList.remove('hidden');

    // Optional: Send to WhatsApp
    const waMsg = encodeURIComponent(
      `Halo Rizky & Nabila! Saya *${name}* ingin mengkonfirmasi kehadiran:\n` +
      `• Kehadiran: ${hadir === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir'}\n` +
      `• Jumlah tamu: ${guests} orang\n\n` +
      `Selamat menempuh hidup baru! 🌸`
    );
    // Uncomment to auto-open WA:
    // window.open(`https://wa.me/6281234567890?text=${waMsg}`, '_blank');
  }, 1500);
}

// ---- WISHES FORM ----
function submitWish(e) {
  e.preventDefault();
  const name = document.getElementById('wish-name').value.trim();
  const text = document.getElementById('wish-text').value.trim();
  if (!name || !text) return;

  const btn = document.getElementById('wish-submit');
  btn.textContent = '⏳ Mengirim...';
  btn.disabled = true;

  setTimeout(() => {
    const wall = document.getElementById('wishes-wall');
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.style.animation = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.innerHTML = `
      <div class="wish-avatar">${name.charAt(0).toUpperCase()}</div>
      <div class="wish-body">
        <div class="wish-header">
          <span class="wish-name">${escapeHtml(name)}</span>
          <span class="wish-time">Baru saja</span>
        </div>
        <p class="wish-text">${escapeHtml(text)}</p>
        <div class="wish-likes" onclick="likeWish(this)">❤ <span>0</span></div>
      </div>
    `;
    wall.insertBefore(card, wall.firstChild);

    // Animate in
    requestAnimationFrame(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    document.getElementById('wish-form').reset();
    btn.textContent = '💌 Kirim Ucapan';
    btn.disabled = false;
  }, 1000);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- LIKE WISH ----
function likeWish(el) {
  const span = el.querySelector('span');
  const count = parseInt(span.textContent) + 1;
  span.textContent = count;
  el.style.transform = 'scale(1.3)';
  el.style.color = '#e05050';
  setTimeout(() => {
    el.style.transform = 'scale(1)';
  }, 200);
}

// ---- COPY ACCOUNT ----
function copyAccount(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2500);
  });
}

// ---- SCROLL REVEAL for nav ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('sticky-nav');
  if (nav) {
    nav.style.opacity = window.scrollY > 100 ? '1' : '0';
    nav.style.pointerEvents = window.scrollY > 100 ? 'all' : 'none';
  }
});

// Initial state — hide nav until scrolled
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('sticky-nav');
  if (nav) {
    nav.style.opacity = '0';
    nav.style.transition = 'opacity 0.4s ease';
  }
  document.body.style.overflow = 'hidden';
  initLoveCursor();
});

// ---- LOVE CURSOR TRAIL ----
function initLoveCursor() {
  const symbols = ['❤', '💕', '💖', '💗', '💓', '🌸', '✨', '💝'];
  let lastX = 0, lastY = 0;
  let frameId = null;
  let throttle = false;

  // Custom cursor dot
  const cursor = document.createElement('div');
  cursor.id = 'love-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 18px;
    height: 18px;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    display: none;
  `;
  cursor.textContent = '💗';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Move custom cursor
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    cursor.style.display = 'block';

    // Spawn heart only if mouse moved enough and not throttled
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist < 12 || throttle) return;
    throttle = true;
    setTimeout(() => throttle = false, 80);

    lastX = x;
    lastY = y;
    spawnHeart(x, y);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });

  // Extra burst on click
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      setTimeout(() => spawnHeart(e.clientX + offsetX, e.clientY + offsetY, true), i * 40);
    }
  });

  function spawnHeart(x, y, burst = false) {
    const el = document.createElement('div');
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    const size = burst
      ? (1.0 + Math.random() * 1.2)
      : (0.65 + Math.random() * 0.9);
    const drift = (Math.random() - 0.5) * 50;
    const rise = 55 + Math.random() * 55;
    const duration = 900 + Math.random() * 600;
    const rotation = (Math.random() - 0.5) * 60;

    el.textContent = sym;
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}rem;
      pointer-events: none;
      z-index: 99998;
      user-select: none;
      transform: translate(-50%, -50%) rotate(0deg) scale(1);
      opacity: 1;
      transition:
        top ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94),
        left ${duration}ms ease,
        opacity ${duration * 0.7}ms ease ${duration * 0.3}ms,
        transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94);
    `;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.top = (y - rise) + 'px';
      el.style.left = (x + drift) + 'px';
      el.style.opacity = '0';
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${burst ? 1.6 : 1.2})`;
    });

    setTimeout(() => el.remove(), duration + 50);
  }
}

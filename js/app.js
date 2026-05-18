/* ═══════════════════════════════════════
   OPHELIA — Clean, minimal JS
   No gimmicks. Just what's needed.
═══════════════════════════════════════ */

/* ── 1. Hero slideshow (auto, random effects) ── */
const slides = document.querySelectorAll('.hero-slide');
const fxClasses = ['fx-zoom-in', 'fx-pan-left', 'fx-pan-right', 'fx-soft'];
let current = 0;

function nextSlide() {
  const prev = slides[current];
  current = (current + 1) % slides.length;
  const next = slides[current];

  /* Remove all fx classes from all slides */
  slides.forEach(s => fxClasses.forEach(fx => s.classList.remove(fx)));

  /* Pick random effect for the incoming slide */
  const fx = fxClasses[Math.floor(Math.random() * fxClasses.length)];
  next.classList.add(fx);

  /* Transition */
  prev.classList.remove('active');
  next.classList.add('active');
}

if (slides.length > 1) {
  setInterval(nextSlide, 5000);
}

/* ── 2. Reveal on scroll (one time, subtle) ── */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

/* ── 2. Nav: transparent on hero → solid after ── */
const nav = document.getElementById('nav');
function updateNav() {
  const y = window.scrollY;
  const heroH = window.innerHeight;
  const isScrolled = y > 60;
  nav.classList.toggle('scrolled', isScrolled);
  nav.classList.toggle('nav--light', !isScrolled);
  nav.classList.toggle('nav--dark', isScrolled);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── 3. Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  nav.classList.toggle('menu-open');
});
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    nav.classList.remove('menu-open');
  })
);

/* ── 4. Modal ── */
const EXP = {
  emergency: {
    l: '01 — Flower Boom', t: 'Emergency Kit', img: 'img/emergency-kit.png',
    d: 'Instalación de flores en el espacio destinado. Gipsofilia, lluvia, astromelias y más.',
    sp: 'Desde S/300', sd: '10 kits, sin IGV, sin staff on site.',
    pp: 'Cotización', pd: 'Baby rosas, claveles y otras flores seleccionadas.',
    wa: 'Hola%20Ophelia%2C%20quisiera%20cotizar%20el%20Emergency%20Kit'
  },
  foryou: {
    l: '02 — Regalos', t: 'For You', img: 'img/for-you.png',
    d: 'Tarjeta personalizada + porta tarjetas. Flores y palabras.',
    sp: 'Desde S/500', sd: '20 tarjetas, sin IGV.',
    pp: 'Cotización', pd: 'Lisiantus, gerberas, rosas, tulipanes + staff.',
    wa: 'Hola%20Ophelia%2C%20quisiera%20cotizar%20For%20You'
  },
  wall: {
    l: '03 — Instalaciones', t: 'Flower Wall', img: 'img/flower-wall.png',
    d: 'Pared de flores 1.80 × 1.20 m con estructura de madera.',
    sp: 'Desde S/700', sd: 'Sin staff on site.',
    pp: 'Cotización', pd: '+ staff + artisan details.',
    wa: 'Hola%20Ophelia%2C%20quisiera%20cotizar%20el%20Flower%20Wall'
  },
  bar: {
    l: '04 — Interactivo', t: 'Flower Bar', img: 'img/flower-bar.png',
    d: 'El público arma su propio ramo. Mesa de madera, baldes de acrílico.',
    sp: 'Desde S/900', sd: '1 staff · 3 flores · packaging básico.',
    pp: 'Desde S/1,700', pd: '2 staff · 5 flores · packaging premium.',
    wa: 'Hola%20Ophelia%2C%20quisiera%20cotizar%20el%20Flower%20Bar'
  }
};

const modalBg = document.getElementById('modalBg');

function openModal(key) {
  const d = EXP[key];
  if (!d) return;
  document.getElementById('mImg').src = d.img;
  document.getElementById('mLabel').textContent = d.l;
  document.getElementById('mTitle').textContent = d.t;
  document.getElementById('mDesc').textContent = d.d;
  document.getElementById('mStdP').textContent = d.sp;
  document.getElementById('mStdD').textContent = d.sd;
  document.getElementById('mPrmP').textContent = d.pp;
  document.getElementById('mPrmD').textContent = d.pd;
  document.getElementById('mWa').href = `https://wa.me/51937664403?text=${d.wa}`;
  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.exp-row[data-modal]').forEach(row => {
  row.style.cursor = 'pointer';
  row.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // No abrir el popup si se hace clic en un enlace
    openModal(row.dataset.modal);
  });
});

document.getElementById('modalClose')?.addEventListener('click', closeModal);
modalBg?.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── 5. FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    /* Close all */
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    /* Toggle current */
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── 6. Gallery lightbox ── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lightboxClose')?.addEventListener('click', () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
});
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── 7. Form → WhatsApp ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = form;
    const msg = `Hola Ophelia, soy ${f.nombre.value}.
Experiencia: ${f.exp.value || 'por definir'}
Tipo de evento: ${f.tipo?.value || 'por definir'}
Fecha: ${f.fecha.value || 'por definir'}
Personas: ${f.personas?.value || 'por definir'}
Email: ${f.email.value}

${f.msg.value}`;
    window.open(`https://wa.me/51937664403?text=${encodeURIComponent(msg)}`, '_blank');

    const btn = document.getElementById('submitBtn');
    const msgEl = document.getElementById('formMsg');
    btn.textContent = '¡Enviado!';
    msgEl.style.display = 'block';
    msgEl.textContent = 'Redirigiendo a WhatsApp…';

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Enviar cotización';
      msgEl.style.display = 'none';
    }, 4000);
  });
}

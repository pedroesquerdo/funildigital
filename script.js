const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#menu-principal');
const cookieBanner = document.querySelector('#cookie-banner');
const analyticsId = 'G-94F1ELJY1E';

function setMenu(open) {
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 950) setMenu(false);
});

function loadAnalytics() {
  if (document.querySelector('script[data-google-tag]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  script.dataset.googleTag = analyticsId;
  document.head.appendChild(script);

  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', analyticsId, { anonymize_ip: true });
}

function getConsent() {
  try {
    return localStorage.getItem('funil-cookie-consent');
  } catch {
    return null;
  }
}

function saveConsent(choice) {
  try {
    localStorage.setItem('funil-cookie-consent', choice);
  } catch {
    // O consentimento continua válido para a sessão atual.
  }
}

function closeCookieBanner() {
  cookieBanner.hidden = true;
  document.body.classList.remove('cookie-pending');
}

const consent = getConsent();
if (consent === 'granted') {
  loadAnalytics();
} else if (consent !== 'denied') {
  cookieBanner.hidden = false;
  document.body.classList.add('cookie-pending');
}

document.querySelectorAll('[data-cookie-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.cookieChoice;
    saveConsent(choice);
    if (choice === 'granted') loadAnalytics();
    closeCookieBanner();
  });
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('nome')).trim();
  const company = String(data.get('empresa')).trim();
  const phone = String(data.get('whatsapp')).trim();
  const interest = String(data.get('interesse')).trim();
  const message = `Olá, Pedro! Meu nome é ${name} e falo pela ${company}. Meu WhatsApp é ${phone}. Quero conversar sobre: ${interest}.`;
  window.location.href = `https://wa.me/5517992179836?text=${encodeURIComponent(message)}`;
});

const projectTrack = document.querySelector('#project-track');
const projectPrev = document.querySelector('[data-project-prev]');
const projectNext = document.querySelector('[data-project-next]');

if (projectTrack && projectPrev && projectNext) {
  const projectStep = () => {
    const card = projectTrack.querySelector('.project-case');
    const gap = Number.parseFloat(getComputedStyle(projectTrack).gap) || 0;
    return card ? card.getBoundingClientRect().width + gap : projectTrack.clientWidth;
  };

  const updateProjectControls = () => {
    const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
    const hasMultipleProjects = projectTrack.querySelectorAll('.project-case').length > 1;
    projectPrev.disabled = !hasMultipleProjects || projectTrack.scrollLeft <= 2;
    projectNext.disabled = !hasMultipleProjects || projectTrack.scrollLeft >= maxScroll - 2;
  };

  const moveProjects = (direction) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    projectTrack.scrollBy({ left: projectStep() * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  projectPrev.addEventListener('click', () => moveProjects(-1));
  projectNext.addEventListener('click', () => moveProjects(1));
  projectTrack.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveProjects(event.key === 'ArrowRight' ? 1 : -1);
  });
  projectTrack.addEventListener('scroll', updateProjectControls, { passive: true });
  window.addEventListener('resize', updateProjectControls);
  updateProjectControls();
}

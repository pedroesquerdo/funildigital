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
  const phone = String(data.get('whatsapp')).trim();
  const interest = String(data.get('interesse')).trim();
  const message = `Olá! Meu nome é ${name}. Meu WhatsApp é ${phone}. Tenho interesse em: ${interest}.`;
  window.location.href = `https://wa.me/5517992179836?text=${encodeURIComponent(message)}`;
});

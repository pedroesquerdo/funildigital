const projectShowcaseStyles = document.createElement('link');
projectShowcaseStyles.rel = 'stylesheet';
projectShowcaseStyles.href = 'projects-showcase.css?v=20260910-2';
document.head.appendChild(projectShowcaseStyles);

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
const projectControls = projectPrev?.closest('.project-controls');

if (projectTrack && projectPrev && projectNext) {
  if (projectControls && projectControls.parentElement !== projectTrack) {
    projectTrack.appendChild(projectControls);
  }

  const projectCards = [...projectTrack.querySelectorAll('.project-case')];
  let activeProject = 0;

  const updateProjectDeck = () => {
    projectCards.forEach((card, index) => {
      const position = (index - activeProject + projectCards.length) % projectCards.length;
      const isActive = position === 0;
      card.classList.toggle('is-active', isActive);
      card.classList.toggle('is-next', position === 1);
      card.classList.toggle('is-far', position > 1);
      card.style.zIndex = String(projectCards.length - position);

      if (isActive) {
        card.removeAttribute('aria-hidden');
        card.removeAttribute('inert');
      } else {
        card.setAttribute('aria-hidden', 'true');
        card.setAttribute('inert', '');
      }
    });

    const hasMultipleProjects = projectCards.length > 1;
    projectPrev.disabled = !hasMultipleProjects;
    projectNext.disabled = !hasMultipleProjects;
    projectTrack.setAttribute('aria-label', `Projetos da Funil Digital. Projeto ${activeProject + 1} de ${projectCards.length}.`);
  };

  const moveProjects = (direction) => {
    activeProject = (activeProject + direction + projectCards.length) % projectCards.length;
    updateProjectDeck();
  };

  projectPrev.addEventListener('click', () => moveProjects(-1));
  projectNext.addEventListener('click', () => moveProjects(1));
  projectTrack.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveProjects(event.key === 'ArrowRight' ? 1 : -1);
  });
  updateProjectDeck();
}

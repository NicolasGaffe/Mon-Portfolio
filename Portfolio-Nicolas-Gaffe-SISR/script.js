"use strict";
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const closeMenu = () => { toggle?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); };
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header-inner')) closeMenu(); });
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
function filterProjects(filter) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  let count = 0;
  cards.forEach(card => { const visible = filter === 'all' || card.dataset.category === filter; card.hidden = !visible; if (visible) count++; });
  const status = document.getElementById('filter-status');
  if (status) status.textContent = `${count} projet${count > 1 ? 's' : ''} présenté${count > 1 ? 's' : ''}`;
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function revealHash() {
  if (!cards.length || !location.hash) return;
  let card; try { card = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if (card?.hasAttribute('data-category')) { filterProjects('all'); card.classList.add('hash-target'); }
}
window.addEventListener('hashchange', revealHash); revealHash();
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  button.disabled = true; button.setAttribute('aria-busy', 'true'); status.textContent = 'Envoi en cours…'; status.classList.remove('is-error');
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('delivery');
    status.textContent = 'Votre message a bien été transmis. Merci pour votre prise de contact.';
    form.reset();
  } catch {
    status.textContent = 'L’envoi n’a pas pu être confirmé. Votre message est conservé dans les champs. Vous pouvez réessayer ou me contacter sur LinkedIn.';
    status.classList.add('is-error');
  } finally { button.disabled = false; button.removeAttribute('aria-busy'); }
});

/*
 * Eight'In Flour & Coffee — menu, recherche, langue (FR/EN) et commande à montrer à la caisse.
 * Aucune dépendance, aucun appel réseau : le contenu vient de menu-data.js et icons.js.
 */
(() => {
  'use strict';

  const { SITE, SECTIONS } = window.EIGHTIN;
  const API = window.EIGHTIN_API;
  // Carte de secours (menu-data.js), remplacée par celle de la base dès que celle-ci répond.
  let MENU = window.EIGHTIN.MENU;
  let FEATURED = window.EIGHTIN.FEATURED;
  const ICONS = window.EIGHTIN_ICONS;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STORE_KEY = 'eightin-commande-v1';
  const LANG_KEY = 'eightin-langue';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Langue ----------
   * Les textes fixes sont en français dans le HTML (attributs data-i18n*) ; leur version
   * anglaise est dans STATIC_EN. Les textes générés par le script sont dans T. */
  const STATIC_EN = {
    navHome: 'Eight’In Flour & Coffee — home',
    searchLabel: 'Search the menu',
    searchPlaceholder: 'Search the menu…',
    searchToggle: 'Search',
    heroMenu: 'See the menu',
    heroFind: 'Find us',
    selLabel: 'Selection',
    selTitle: 'Discover',
    selText: 'A few picks from the menu — tap to add them to your order.',
    partners: 'Our coffee partners: illy & Alta Caffè',
    menuLabel: 'Our menu',
    menuTitle: 'The Menu',
    menuText: 'Open a category and tap an item to add it to your order.',
    menuTabs: 'Menu sections',
    footVisit: 'Come and see us',
    footTop: 'Back to top',
    footAddr: 'Address',
    footAddr1: 'Boumhal — Southern Suburbs',
    footAddr2: 'Tunisia',
    footMaps: 'Open in Google Maps',
    footHours: 'Opening hours',
    footHours1: 'Every day',
    footHours2: '7am – midnight',
    footCoffee: 'Our coffee',
    footCoffee1: 'Partners',
    footRights: 'All rights reserved.',
    cartTitle: 'My order',
    cartBubble: 'My order:',
    close: 'Close',
    cartCheckout: 'Order at the counter',
    cartClear: 'Clear order',
    ticketSign: 'Order at the counter',
    ticketNote: 'Show this screen at the counter — payment is made at the till.',
    ticketClose: 'Close',
    ticketNew: 'New order',
  };

  const T = {
    fr: {
      add: '+ Ajouter',
      addItem: (name, cat, price) => `Ajouter ${name} (${cat}), ${price}`,
      removeOne: name => `Retirer : ${name}`,
      addOne: name => `Ajouter : ${name}`,
      from: 'dès',
      infoCount: 'Brownies · cookies · cakes',
      seeInsta: handle => `Voir @${handle}`,
      emptyCart: 'Votre commande est vide',
      ticketTime: time => `Commande composée à ${time}`,
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      results: n => `${n} résultat${n > 1 ? 's' : ''} — touchez un article pour l’ajouter`,
      noResults: q => `Aucun résultat pour « ${q} »`,
      locale: 'fr-FR',
    },
    en: {
      add: '+ Add',
      addItem: (name, cat, price) => `Add ${name} (${cat}), ${price}`,
      removeOne: name => `Remove: ${name}`,
      addOne: name => `Add: ${name}`,
      from: 'from',
      infoCount: 'Brownies · cookies · cakes',
      seeInsta: handle => `See @${handle}`,
      emptyCart: 'Your order is empty',
      ticketTime: time => `Order created at ${time}`,
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      results: n => `${n} result${n > 1 ? 's' : ''} — tap an item to add it`,
      noResults: q => `No results for “${q}”`,
      locale: 'en-GB',
    },
  };

  let lang = 'fr';
  try { if (localStorage.getItem(LANG_KEY) === 'en') lang = 'en'; } catch { /* stockage indisponible */ }

  const tr = v => (v && typeof v === 'object' ? (v[lang] ?? v.fr) : v);
  const t = (key, ...args) => {
    const v = T[lang][key];
    return typeof v === 'function' ? v(...args) : v;
  };

  // Mémorise les textes français d'origine pour pouvoir revenir au FR sans recharger.
  const staticNodes = [...document.querySelectorAll('[data-i18n], [data-i18n-aria], [data-i18n-placeholder]')].map(el => ({
    el,
    text: el.dataset.i18n ? el.textContent : null,
    aria: el.getAttribute('aria-label'),
    placeholder: el.getAttribute('placeholder'),
  }));

  function applyStatic() {
    const en = lang === 'en';
    for (const n of staticNodes) {
      const { el } = n;
      if (el.dataset.i18n) el.textContent = en ? (STATIC_EN[el.dataset.i18n] ?? n.text) : n.text;
      if (el.dataset.i18nAria) el.setAttribute('aria-label', en ? (STATIC_EN[el.dataset.i18nAria] ?? n.aria) : n.aria);
      if (el.dataset.i18nPlaceholder) el.setAttribute('placeholder', en ? (STATIC_EN[el.dataset.i18nPlaceholder] ?? n.placeholder) : n.placeholder);
    }
    document.documentElement.lang = lang;
  }

  /* ---------- Helpers DOM (pas d'innerHTML : tout passe par textContent) ---------- */
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) if (c != null && c !== false) el.append(c);
    return el;
  }

  function svgIcon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    for (const [tag, attrs] of ICONS[name] || []) {
      const el = document.createElementNS(SVG_NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      svg.append(el);
    }
    return svg;
  }

  function chevron() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M3 6l5 5 5-5');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '2');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    svg.append(p);
    return svg;
  }

  const round3 = n => Math.round(n * 1000) / 1000;
  const fmt = p => (Number.isInteger(p) ? String(p) : p.toFixed(3)) + ' DT';

  /* ---------- Index des articles : "categorie/article" → { item, cat } (rempli par indexMenu) ---------- */
  const ITEMS = new Map();
  const catLabel = cat => tr(cat.label || cat.name);
  const addLabel = (it, cat) => t('addItem', tr(it.name), catLabel(cat), fmt(it.price));

  /* ---------- Rendu : sélection ---------- */
  const featuredGrid = document.getElementById('featured-grid');

  function renderFeatured() {
    featuredGrid.replaceChildren();
    for (const key of FEATURED) {
      const entry = ITEMS.get(key);
      if (!entry) continue;
      const { item, cat } = entry;
      featuredGrid.append(
        h('button', { type: 'button', class: 'feat-card reveal', 'data-add': key, 'aria-label': addLabel(item, cat) },
          h('span', { class: `tile theme-${cat.theme}` }, svgIcon(cat.icon)),
          h('span', { class: 'feat-body' },
            h('span', { class: 'feat-cat', text: catLabel(cat) }),
            h('span', { class: 'feat-name', text: tr(item.name) }),
            h('span', { class: 'feat-foot' },
              h('span', { class: 'feat-price', text: fmt(item.price) }),
              h('span', { class: 'feat-add', text: t('add') })))));
    }
  }

  /* ---------- Rendu : onglets + menu en cartes accordéon ---------- */
  const grid = document.getElementById('menu-grid');
  const tabs = document.getElementById('menu-tabs');
  let activeSection = SECTIONS[0].id;

  function renderTabs() {
    tabs.replaceChildren();
    for (const s of SECTIONS) {
      const n = MENU.filter(c => c.section === s.id).reduce((sum, c) => sum + c.groups.reduce((m, g) => m + g.items.length, 0), 0);
      const tab = h('button', { type: 'button', role: 'tab', class: 'menu-tab', id: `tab-${s.id}`, 'aria-controls': 'menu-grid', 'data-section': s.id },
        tr(s.label), n ? h('span', { class: 'menu-tab-count', text: String(n) }) : null);
      tab.addEventListener('click', () => setSection(s.id));
      tabs.append(tab);
    }
  }

  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const list = [...tabs.querySelectorAll('[role="tab"]')];
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
    next.focus();
    setSection(next.dataset.section);
  });

  function setSection(id) {
    activeSection = id;
    document.querySelectorAll('.menu-card.open').forEach(c => setCardOpen(c, false));
    for (const tab of tabs.querySelectorAll('[role="tab"]')) {
      const on = tab.dataset.section === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    }
    for (const card of grid.querySelectorAll('.menu-card')) {
      card.hidden = card.dataset.section !== id;
      if (!card.hidden) card.classList.remove('reveal-pending');
    }
    grid.setAttribute('aria-labelledby', `tab-${id}`);
  }

  function renderMenu() {
    grid.replaceChildren();
    for (const cat of MENU) {
      const prices = cat.groups.flatMap(g => g.items.map(it => it.price));
      const countText = cat.info
        ? t('infoCount')
        : `${prices.length} ${tr(cat.unit)} · ${t('from')} ${fmt(Math.min(...prices))}`;
      const panelId = `menu-${cat.id}`;

      const inner = h('div', { class: 'dropdown-inner' });
      if (cat.info) {
        inner.append(
          h('p', { class: 'dropdown-info', text: tr(cat.info) },
            h('br'),
            h('a', { href: `https://www.instagram.com/${SITE.instagram}/`, target: '_blank', rel: 'noopener', text: t('seeInsta', SITE.instagram) })));
      } else {
        for (const g of cat.groups) {
          if (g.title) inner.append(h('div', { class: 'dropdown-sub', text: tr(g.title) }));
          for (const it of g.items) {
            inner.append(
              h('button', { type: 'button', class: 'item', 'data-add': `${cat.id}/${it.id}`, 'aria-label': addLabel(it, cat) },
                h('span', { class: 'item-name' }, tr(it.name),
                  it.tag && h('span', { class: 'item-tag', text: tr(it.tag) }),
                  it.desc && h('small', { class: 'item-desc', text: tr(it.desc) })),
                h('span', { class: 'item-price', text: fmt(it.price) }),
                h('span', { class: 'item-plus', 'aria-hidden': 'true', text: '+' })));
          }
        }
        if (cat.note) inner.append(h('p', { class: 'dropdown-note', text: tr(cat.note) }));
      }

      const head = h('button', { type: 'button', class: 'card-head tile', 'aria-expanded': 'false', 'aria-controls': panelId },
        svgIcon(cat.icon),
        h('span', { class: 'card-label' },
          h('span', {},
            h('span', { class: 'card-title', text: tr(cat.name) }),
            cat.subtitle && h('span', { class: 'card-sub', text: tr(cat.subtitle) }),
            h('span', { class: 'card-count', text: countText })),
          h('span', { class: 'card-arrow' }, chevron())));

      const panel = h('div', { class: 'card-dropdown', id: panelId }, h('div', { class: 'dropdown-clip' }, inner));
      panel.inert = true;

      const card = h('article', { class: `menu-card reveal theme-${cat.theme}`, 'data-section': cat.section }, h('h3', { class: 'card-heading' }, head), panel);
      head.addEventListener('click', () => toggleCard(card));
      grid.append(card);
    }
  }

  function setCardOpen(card, open) {
    card.classList.toggle('open', open);
    card.querySelector('.card-head').setAttribute('aria-expanded', String(open));
    card.querySelector('.card-dropdown').inert = !open;
  }

  function toggleCard(card) {
    const willOpen = !card.classList.contains('open');
    document.querySelectorAll('.menu-card.open').forEach(c => setCardOpen(c, false));
    if (!willOpen) return;
    setCardOpen(card, true);
    // Laisse l'accordéon se déplier avant de recadrer la carte à l'écran.
    setTimeout(() => card.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' }), 480);
  }

  /* ---------- Recherche ---------- */
  const nav = document.getElementById('nav');
  const searchForm = document.getElementById('nav-search');
  const searchInput = document.getElementById('search-input');
  const searchToggle = document.getElementById('search-toggle');
  const searchPanel = document.getElementById('search-results');
  const searchStatus = document.getElementById('search-status');
  const searchList = document.getElementById('search-list');

  // Recherche insensible aux accents et à la casse, dans les deux langues à la fois.
  const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  const variants = v => (v && typeof v === 'object' ? [v.fr, v.en] : [v || '']);
  let SEARCH_INDEX = [];

  // (Re)construit l'index des articles et celui de la recherche à partir de MENU.
  function indexMenu() {
    ITEMS.clear();
    for (const cat of MENU) {
      for (const g of cat.groups) {
        for (const it of g.items) ITEMS.set(`${cat.id}/${it.id}`, { item: it, cat });
      }
    }
    SEARCH_INDEX = [...ITEMS].map(([key, { item, cat }]) => ({
      key,
      names: variants(item.name).map(norm),
      text: norm([item.name, item.desc, item.tag, cat.name, cat.label, cat.subtitle].flatMap(variants).join(' ')),
    }));
  }

  function searchItems(query) {
    const terms = norm(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return SEARCH_INDEX
      .filter(e => terms.every(term => e.text.includes(term)))
      .map(e => ({ key: e.key, rank: e.names.some(n => n.startsWith(terms[0])) ? 0 : 1 }))
      .sort((a, b) => a.rank - b.rank)
      .map(e => e.key);
  }

  function resultRow(key) {
    const { item, cat } = ITEMS.get(key);
    return h('li', {},
      h('button', { type: 'button', class: 'item result', 'data-add': key, 'aria-label': addLabel(item, cat) },
        h('span', { class: 'item-name' }, tr(item.name), h('small', { class: 'item-desc', text: catLabel(cat) })),
        h('span', { class: 'item-price', text: fmt(item.price) }),
        h('span', { class: 'item-plus', 'aria-hidden': 'true', text: '+' })));
  }

  function renderSearch() {
    const q = searchInput.value.trim();
    if (!q) { closeSearch(false); return; }
    const keys = searchItems(q);
    searchList.replaceChildren(...keys.slice(0, 40).map(resultRow));
    searchStatus.textContent = keys.length ? t('results', keys.length) : t('noResults', q);
    searchPanel.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }

  function closeSearch(clear) {
    searchPanel.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    if (clear) searchInput.value = '';
  }

  function setMobileSearch(open) {
    nav.classList.toggle('search-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) { setNav(false); searchInput.focus(); } else closeSearch(true);
  }

  searchInput.addEventListener('input', renderSearch);
  searchInput.addEventListener('focus', () => { if (searchInput.value.trim()) renderSearch(); });
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const first = searchList.querySelector('button');
    if (first) first.focus();
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown') return;
    const first = searchList.querySelector('button');
    if (first) { e.preventDefault(); first.focus(); }
  });
  searchList.addEventListener('keydown', e => {
    const buttons = [...searchList.querySelectorAll('button')];
    const i = buttons.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && i < buttons.length - 1) { e.preventDefault(); buttons[i + 1].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? buttons[i - 1] : searchInput).focus(); }
  });
  searchToggle.addEventListener('click', () => setMobileSearch(!nav.classList.contains('search-open')));
  document.addEventListener('click', e => {
    if (searchPanel.hidden || !e.target.isConnected) return;
    if (e.target.closest('#nav-search, #search-results, #search-toggle')) return;
    closeSearch(false);
  });

  /* ---------- Commande ---------- */
  const cart = new Map(); // clé → quantité
  const els = {
    bubble: document.getElementById('cart-bubble'),
    count: document.getElementById('cart-count'),
    panel: document.getElementById('cart-panel'),
    list: document.getElementById('cart-list'),
    total: document.getElementById('cart-total'),
    actions: document.querySelector('.cart-actions'),
    close: document.getElementById('cart-close'),
    ticket: document.getElementById('ticket'),
    ticketList: document.getElementById('ticket-list'),
    ticketTotal: document.getElementById('ticket-total'),
    ticketTime: document.getElementById('ticket-time'),
  };

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (!Array.isArray(saved)) return;
      for (const entry of saved) {
        const [key, qty] = Array.isArray(entry) ? entry : [];
        // Les prix ne sont jamais relus du stockage : seulement les clés encore présentes au menu.
        if (ITEMS.has(key) && Number.isInteger(qty) && qty > 0 && qty < 100) cart.set(key, qty);
      }
    } catch {
      /* stockage indisponible (navigation privée…) : commande gardée en mémoire */
    }
  }

  function saveCart() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...cart])); } catch { /* idem */ }
  }

  const cartTotal = () => round3([...cart].reduce((s, [k, q]) => s + ITEMS.get(k).item.price * q, 0));

  function cartRow(key, qty) {
    const { item, cat } = ITEMS.get(key);
    const name = tr(item.name);
    return h('div', { class: 'cart-row' },
      h('span', { class: 'cart-row-name' }, name, h('small', { text: catLabel(cat) })),
      h('button', { type: 'button', class: 'qty-btn', 'data-dec': key, 'aria-label': t('removeOne', name), text: '−' }),
      h('span', { class: 'cart-row-qty', text: String(qty) }),
      h('button', { type: 'button', class: 'qty-btn', 'data-inc': key, 'aria-label': t('addOne', name), text: '+' }),
      h('span', { class: 'cart-row-price', text: fmt(round3(item.price * qty)) }));
  }

  function renderCart() {
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    els.count.textContent = String(count);
    els.bubble.hidden = count === 0;
    els.actions.hidden = count === 0;
    els.total.textContent = fmt(cartTotal());
    els.list.replaceChildren(...(count
      ? [...cart].map(([k, q]) => cartRow(k, q))
      : [h('p', { class: 'cart-empty', text: t('emptyCart') })]));
    if (count === 0) setPanel(false);
    saveCart();
  }

  function setPanel(open) {
    els.panel.hidden = !open;
    els.bubble.setAttribute('aria-expanded', String(open));
  }

  function addToCart(key) {
    cart.set(key, (cart.get(key) || 0) + 1);
    renderCart();
    bounceBubble();
  }

  function removeFromCart(key) {
    const q = cart.get(key) || 0;
    if (q > 1) cart.set(key, q - 1); else cart.delete(key);
    renderCart();
  }

  function bounceBubble() {
    if (prefersReduced) return;
    els.bubble.classList.remove('bounce');
    void els.bubble.offsetWidth;
    els.bubble.classList.add('bounce');
    const r = els.bubble.getBoundingClientRect();
    const notif = h('div', { class: 'cart-notif', 'aria-hidden': 'true', text: '+1' });
    notif.style.left = `${r.left + r.width / 2 - 16}px`;
    notif.style.top = `${r.top - 10}px`;
    document.body.append(notif);
    setTimeout(() => notif.remove(), 900);
  }

  function showTicket() {
    els.ticketList.replaceChildren(...[...cart].map(([k, q]) => {
      const { item, cat } = ITEMS.get(k);
      return h('li', {},
        h('span', { class: 'ticket-qty', text: `${q}×` }),
        h('span', { class: 'ticket-name' }, tr(item.name), h('small', { text: catLabel(cat) })),
        h('span', { class: 'ticket-price', text: fmt(round3(item.price * q)) }));
    }));
    els.ticketTotal.textContent = fmt(cartTotal());
    els.ticketTime.textContent = t('ticketTime', new Date().toLocaleTimeString(t('locale'), { hour: '2-digit', minute: '2-digit' }));
    setPanel(false);
    if (typeof els.ticket.showModal === 'function') els.ticket.showModal();
    else els.ticket.setAttribute('open', '');
  }

  function closeTicket() {
    if (typeof els.ticket.close === 'function') els.ticket.close();
    else els.ticket.removeAttribute('open');
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      addToCart(add.dataset.add);
      add.classList.remove('added');
      void add.offsetWidth;
      add.classList.add('added');
      setTimeout(() => add.classList.remove('added'), 600);
      return;
    }
    const inc = e.target.closest('[data-inc]');
    if (inc) { addToCart(inc.dataset.inc); return; }
    const dec = e.target.closest('[data-dec]');
    if (dec) removeFromCart(dec.dataset.dec);
  });

  els.bubble.addEventListener('click', () => setPanel(els.panel.hidden));
  els.close.addEventListener('click', () => { setPanel(false); els.bubble.focus(); });
  document.getElementById('cart-clear').addEventListener('click', () => { cart.clear(); renderCart(); });
  document.getElementById('cart-checkout').addEventListener('click', showTicket);
  document.getElementById('ticket-close').addEventListener('click', closeTicket);
  document.getElementById('ticket-new').addEventListener('click', () => { cart.clear(); renderCart(); closeTicket(); });
  els.ticket.addEventListener('click', e => { if (e.target === els.ticket) closeTicket(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!searchPanel.hidden) { closeSearch(false); searchInput.focus(); return; }
    if (nav.classList.contains('search-open')) { setMobileSearch(false); searchToggle.focus(); return; }
    if (!els.panel.hidden) { setPanel(false); els.bubble.focus(); }
  });

  /* ---------- Navigation ---------- */
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  function setNav(open) {
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? t('closeMenu') : t('openMenu'));
  }
  burger.addEventListener('click', () => {
    const open = !navLinks.classList.contains('open');
    if (open && nav.classList.contains('search-open')) setMobileSearch(false);
    setNav(open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Changement de langue : un seul bouton, la pastille glisse FR ⇄ EN ---------- */
  const langSwitch = document.getElementById('lang-switch');

  function syncLangSwitch() {
    langSwitch.dataset.current = lang;
    langSwitch.setAttribute('aria-label', lang === 'fr' ? 'Passer en anglais (English)' : 'Switch to French (Français)');
  }

  function renderAll() {
    renderFeatured();
    renderTabs();
    renderMenu();
    setSection(activeSection);
    renderCart();
    setNav(navLinks.classList.contains('open'));
    if (!searchPanel.hidden) renderSearch();
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* idem */ }
    syncLangSwitch();
    applyStatic();
    renderAll();
  }
  // Un clic n'importe où sur le bouton bascule vers l'autre langue.
  langSwitch.addEventListener('click', () => setLang(lang === 'fr' ? 'en' : 'fr'));

  /* ---------- Apparition au défilement ---------- */
  function setupReveal() {
    if (prefersReduced || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.remove('reveal-pending');
        io.unobserve(en.target);
      }
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => {
      // Ce qui est déjà visible au chargement n'est jamais masqué.
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-pending');
        io.observe(el);
      }
    });
  }

  /* ---------- Démarrage ---------- */
  // Pas d'animation au chargement si l'anglais était déjà choisi.
  langSwitch.classList.add('no-anim');
  syncLangSwitch();
  requestAnimationFrame(() => requestAnimationFrame(() => langSwitch.classList.remove('no-anim')));
  applyStatic();
  document.getElementById('maps-link').href = SITE.mapsUrl;
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // La base (si configurée) fait foi ; si elle ne répond pas, la carte de secours reste affichée.
  async function loadMenu() {
    if (!API || !API.configured) return;
    try {
      ({ MENU, FEATURED } = await API.fetchMenu());
    } catch (err) {
      console.warn('Base du menu injoignable, carte de secours affichée :', err.message);
    }
  }

  // Dans chaque catégorie (et chaque sous-groupe), du moins cher au plus cher ; à prix égal, l'ordre d'origine.
  const byPrice = menu => menu.map(cat => ({
    ...cat,
    groups: cat.groups.map(g => ({ ...g, items: [...g.items].sort((a, b) => a.price - b.price) })),
  }));

  loadMenu().then(() => {
    MENU = byPrice(MENU);
    indexMenu();
    loadCart();
    renderAll();
    setupReveal();
  });
})();

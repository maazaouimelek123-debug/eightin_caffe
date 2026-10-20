/*
 * Eight'In Flour & Coffee — rendu du menu, navigation et commande à montrer à la caisse.
 * Aucune dépendance, aucun appel réseau : le contenu vient de menu-data.js.
 */
(() => {
  'use strict';

  const { SITE, SECTIONS, MENU, FEATURED } = window.EIGHTIN;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STORE_KEY = 'eightin-commande-v1';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icônes (style des "highlights" Instagram : aplats + accents) ----------
   * m = forme principale, a = accent, ms/as = traits, thin = trait fin. viewBox 64×64. */
  const ICONS = {
    iced: [
      ['path', { class: 'm', d: 'M35 3l4 1-4.5 16-4-1z' }],
      ['rect', { class: 'm', x: 15, y: 18, width: 34, height: 7, rx: 3.5 }],
      ['path', { class: 'm', d: 'M18 27h28l-3.5 31q-.3 2-2.5 2H24q-2.2 0-2.5-2z' }],
      ['rect', { class: 'a', x: 24, y: 32, width: 8, height: 8, rx: 1.5, transform: 'rotate(-12 28 36)' }],
      ['rect', { class: 'a', x: 33, y: 39, width: 7, height: 7, rx: 1.5, transform: 'rotate(10 36.5 42.5)' }],
      ['rect', { class: 'a', x: 26, y: 47, width: 6, height: 6, rx: 1.5, transform: 'rotate(20 29 50)' }],
    ],
    frappe: [
      ['rect', { class: 'm', x: 30, y: 2, width: 4, height: 14, rx: 2 }],
      ['path', { class: 'm', d: 'M16 30c0-11 7-17 16-17s16 6 16 17z' }],
      ['path', { class: 'as', d: 'M22 26c3-6 8-8 12-6s6 4 8 6' }],
      ['rect', { class: 'm', x: 14, y: 29, width: 36, height: 5, rx: 2.5 }],
      ['path', { class: 'm', d: 'M18 36h28l-3.5 22q-.3 2-2.5 2H24q-2.2 0-2.5-2z' }],
      ['path', { class: 'a', d: 'M19.6 42c5 4 9-2 13 2s7-1 11.6 1l-.6 4.2c-4.5-1.5-7.8 3.3-12.2-.7s-8 2.2-11.6-1.6z' }],
    ],
    shake: [
      ['path', { class: 'm', d: 'M41 2l4 1.5-6.5 17-4-1.5z' }],
      ['path', { class: 'as', d: 'M27.5 8c.5-3 3-5 6-5.5' }],
      ['circle', { class: 'a', cx: 26, cy: 12, r: 5 }],
      ['path', { class: 'm', d: 'M17 27c-2.5-6 2-10.5 6.5-8.5 1-5 7.5-6 9.5-2 3-4 10-2 10 3.5 5 0 6.5 5 4 7z' }],
      ['path', { class: 'm', d: 'M17 29h30l-4 23q-.5 3-3 3H24q-2.5 0-3-3z' }],
      ['rect', { class: 'a', x: 19, y: 35, width: 26, height: 3.5 }],
      ['rect', { class: 'm', x: 28, y: 55, width: 8, height: 4 }],
      ['rect', { class: 'm', x: 21, y: 58, width: 22, height: 4, rx: 2 }],
    ],
    smoothie: [
      ['path', { class: 'm', d: 'M37 2l4 1-3 19-4-1z' }],
      ['path', { class: 'm', d: 'M18 20h28l-2 36q-.3 4-4 4H24q-3.7 0-4-4z' }],
      ['circle', { class: 'a', cx: 26, cy: 36, r: 2.4 }],
      ['circle', { class: 'a', cx: 35, cy: 30, r: 2 }],
      ['circle', { class: 'a', cx: 31, cy: 46, r: 2.6 }],
      ['circle', { class: 'a', cx: 39, cy: 41, r: 1.8 }],
      ['circle', { class: 'a', cx: 47, cy: 18, r: 9 }],
      ['circle', { class: 'm', cx: 47, cy: 18, r: 6.5 }],
      ['path', { class: 'as thin', d: 'M47 12.5v11M41.5 18h11M43 14l8 8M51 14l-8 8' }],
    ],
    mojito: [
      ['path', { class: 'm', d: 'M35 1l4 1-4 18-4-1z' }],
      ['ellipse', { class: 'a', cx: 23, cy: 14, rx: 7, ry: 3.4, transform: 'rotate(-35 23 14)' }],
      ['ellipse', { class: 'a', cx: 28.5, cy: 10, rx: 6, ry: 3, transform: 'rotate(-75 28.5 10)' }],
      ['path', { class: 'm', d: 'M18 18h28l-3 39q-.3 4-3 4H24q-2.7 0-3-4z' }],
      ['rect', { class: 'a', x: 24, y: 28, width: 7, height: 7, rx: 1.5, transform: 'rotate(-10 27.5 31.5)' }],
      ['rect', { class: 'a', x: 32, y: 36, width: 7, height: 7, rx: 1.5, transform: 'rotate(14 35.5 39.5)' }],
      ['rect', { class: 'a', x: 25, y: 45, width: 6, height: 6, rx: 1.5, transform: 'rotate(6 28 48)' }],
      ['path', { class: 'a', d: 'M38 18a10 10 0 0 1 20 0z' }],
      ['path', { class: 'm', d: 'M41 18a7 7 0 0 1 14 0z' }],
      ['path', { class: 'as thin', d: 'M48 18v-6M48 18l-4.5-4.5M48 18l4.5-4.5' }],
    ],
    cocktail: [
      ['path', { class: 'ms', d: 'M46 9L38 30' }],
      ['path', { class: 'a', d: 'M33 15q12-15 26-5z' }],
      ['path', { class: 'm', d: 'M12 22h40c0 13-8 20-20 20S12 35 12 22z' }],
      ['path', { class: 'a', d: 'M14.5 28h35c-2 7-8 11-17.5 11S16.5 35 14.5 28z' }],
      ['circle', { class: 'a', cx: 15, cy: 21, r: 7 }],
      ['circle', { class: 'm', cx: 15, cy: 21, r: 4.5 }],
      ['rect', { class: 'm', x: 30, y: 41, width: 4, height: 13 }],
      ['ellipse', { class: 'm', cx: 32, cy: 57, rx: 12, ry: 3.5 }],
    ],
    classic: [
      ['rect', { class: 'a', x: 39, y: 3, width: 10, height: 5, rx: 1.5 }],
      ['path', { class: 'm', d: 'M40 8h8v6c0 2 4 4 4 10v34q0 3-3 3H39q-3 0-3-3V24c0-6 4-8 4-10z' }],
      ['rect', { class: 'a', x: 36, y: 34, width: 16, height: 12 }],
      ['path', { class: 'm', d: 'M12 30h20l-2 28q-.2 3-3 3H17q-2.8 0-3-3z' }],
      ['path', { class: 'a', d: 'M13.1 42h17.8l-.2 3H13.3z' }],
      ['circle', { class: 'a', cx: 30, cy: 29, r: 6 }],
      ['circle', { class: 'm', cx: 30, cy: 29, r: 3.8 }],
    ],
    croissant: [
      ['ellipse', { class: 'seg', cx: 10, cy: 43, rx: 5, ry: 8.5, transform: 'rotate(-58 10 43)' }],
      ['ellipse', { class: 'seg', cx: 54, cy: 43, rx: 5, ry: 8.5, transform: 'rotate(58 54 43)' }],
      ['ellipse', { class: 'seg', cx: 19, cy: 34, rx: 7.5, ry: 12, transform: 'rotate(-38 19 34)' }],
      ['ellipse', { class: 'seg', cx: 45, cy: 34, rx: 7.5, ry: 12, transform: 'rotate(38 45 34)' }],
      ['ellipse', { class: 'seg', cx: 32, cy: 30, rx: 9.5, ry: 14 }],
      ['path', { class: 'as thin', d: 'M27 24q5-3 10 0M26.5 31q5.5-3 11 0' }],
    ],
    crepe: [
      ['ellipse', { class: 'm', cx: 32, cy: 54, rx: 28, ry: 4.5 }],
      ['path', { class: 'm', d: 'M4 48C4 28 18 15 35 15C48 15 57 24 60 37L44 48Z' }],
      ['path', { class: 'as', d: 'M44 48C40 35 30 26 16 24' }],
      ['path', { class: 'as', d: 'M17 38c4-3 6 2 10 0s6-3 9 1' }],
    ],
    waffle: [
      ['circle', { class: 'm', cx: 32, cy: 32, r: 25 }],
      ['path', { class: 'as', transform: 'rotate(45 32 32)', d: 'M20 16V48M28 12.4V51.6M36 12.4V51.6M44 16V48M16 20H48M12.4 28H51.6M12.4 36H51.6M16 44H48' }],
    ],
    egg: [
      ['path', { class: 'm', d: 'M44 31l17-4 1.5 5-17 4z' }],
      ['circle', { class: 'm', cx: 27, cy: 34, r: 21 }],
      ['path', { class: 'a', d: 'M15 33c-1-7 6-12 12-10 6-4 15 0 14 8 4 6-2 13-9 12-6 4-14 1-15-5-4-1-4-4-2-5z' }],
      ['circle', { class: 'm', cx: 28, cy: 33, r: 5.5 }],
    ],
    burger: [
      ['path', { class: 'm', d: 'M9 29C9 15 55 15 55 29z' }],
      ['ellipse', { class: 'a', cx: 24, cy: 23, rx: 1.8, ry: 1.1, transform: 'rotate(-20 24 23)' }],
      ['ellipse', { class: 'a', cx: 32, cy: 20.5, rx: 1.8, ry: 1.1 }],
      ['ellipse', { class: 'a', cx: 40, cy: 23, rx: 1.8, ry: 1.1, transform: 'rotate(20 40 23)' }],
      ['ellipse', { class: 'a', cx: 28.5, cy: 26.5, rx: 1.8, ry: 1.1, transform: 'rotate(-10 28.5 26.5)' }],
      ['ellipse', { class: 'a', cx: 36, cy: 26.5, rx: 1.8, ry: 1.1, transform: 'rotate(10 36 26.5)' }],
      ['path', { class: 'a', d: 'M7 33q3.5-3 7 0t7 0t7 0t7 0t7 0t7 0t7 0v3H7z' }],
      ['rect', { class: 'm', x: 8, y: 38, width: 48, height: 7, rx: 3.5 }],
      ['path', { class: 'm', d: 'M9 47h46v1c0 4-3 6-7 6H16c-4 0-7-2-7-6z' }],
    ],
    cookie: [
      ['circle', { class: 'm', cx: 31, cy: 34, r: 23 }],
      ['circle', { class: 'bg', cx: 52, cy: 15, r: 8 }],
      ['circle', { class: 'bg', cx: 57, cy: 26, r: 6 }],
      ['circle', { class: 'a', cx: 22, cy: 26, r: 3 }],
      ['circle', { class: 'a', cx: 34, cy: 23, r: 2.5 }],
      ['circle', { class: 'a', cx: 24, cy: 41, r: 3 }],
      ['circle', { class: 'a', cx: 37, cy: 36, r: 3.2 }],
      ['circle', { class: 'a', cx: 45, cy: 45, r: 2.4 }],
      ['circle', { class: 'a', cx: 31, cy: 49, r: 2.2 }],
      ['circle', { class: 'a', cx: 14, cy: 35, r: 2 }],
    ],
  };

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

  /* ---------- Index des articles : "categorie/article" → infos ---------- */
  const catLabel = cat => cat.label || cat.name;
  const ITEMS = new Map();
  for (const cat of MENU) {
    for (const g of cat.groups) {
      for (const it of g.items) {
        ITEMS.set(`${cat.id}/${it.id}`, {
          name: it.name, price: it.price, cat: catLabel(cat), theme: cat.theme, icon: cat.icon,
        });
      }
    }
  }

  /* ---------- Rendu : sélection ---------- */
  function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    for (const key of FEATURED) {
      const it = ITEMS.get(key);
      if (!it) continue;
      grid.append(
        h('button', { type: 'button', class: 'feat-card reveal', 'data-add': key, 'aria-label': `Ajouter ${it.name} (${it.cat}), ${fmt(it.price)}` },
          h('span', { class: `tile theme-${it.theme}` }, svgIcon(it.icon)),
          h('span', { class: 'feat-body' },
            h('span', { class: 'feat-cat', text: it.cat }),
            h('span', { class: 'feat-name', text: it.name }),
            h('span', { class: 'feat-foot' },
              h('span', { class: 'feat-price', text: fmt(it.price) }),
              h('span', { class: 'feat-add', text: '+ Ajouter' })))));
    }
  }

  /* ---------- Rendu : onglets + menu en cartes accordéon ---------- */
  const grid = document.getElementById('menu-grid');
  const tabs = document.getElementById('menu-tabs');

  function renderTabs() {
    for (const s of SECTIONS) {
      const n = MENU.filter(c => c.section === s.id).reduce((sum, c) => sum + c.groups.reduce((m, g) => m + g.items.length, 0), 0);
      const tab = h('button', { type: 'button', role: 'tab', class: 'menu-tab', id: `tab-${s.id}`, 'aria-controls': 'menu-grid', 'data-section': s.id },
        s.label, n ? h('span', { class: 'menu-tab-count', text: String(n) }) : null);
      tab.addEventListener('click', () => setSection(s.id));
      tabs.append(tab);
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
  }

  function setSection(id) {
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
    for (const cat of MENU) {
      const prices = cat.groups.flatMap(g => g.items.map(it => it.price));
      const countText = cat.info
        ? 'Brownies · cookies · cakes'
        : `${prices.length} ${cat.unit} · dès ${fmt(Math.min(...prices))}`;
      const panelId = `menu-${cat.id}`;

      const inner = h('div', { class: 'dropdown-inner' });
      if (cat.info) {
        inner.append(
          h('p', { class: 'dropdown-info', text: cat.info },
            h('br'),
            h('a', { href: `https://www.instagram.com/${SITE.instagram}/`, target: '_blank', rel: 'noopener', text: `Voir @${SITE.instagram}` })));
      } else {
        for (const g of cat.groups) {
          if (g.title) inner.append(h('div', { class: 'dropdown-sub', text: g.title }));
          for (const it of g.items) {
            inner.append(
              h('button', { type: 'button', class: 'item', 'data-add': `${cat.id}/${it.id}`, 'aria-label': `Ajouter ${it.name} (${cat.name}), ${fmt(it.price)}` },
                h('span', { class: 'item-name' }, it.name,
                  it.tag && h('span', { class: 'item-tag', text: it.tag }),
                  it.desc && h('small', { class: 'item-desc', text: it.desc })),
                h('span', { class: 'item-price', text: fmt(it.price) }),
                h('span', { class: 'item-plus', 'aria-hidden': 'true', text: '+' })));
          }
        }
        if (cat.note) inner.append(h('p', { class: 'dropdown-note', text: cat.note }));
      }

      const head = h('button', { type: 'button', class: 'card-head tile', 'aria-expanded': 'false', 'aria-controls': panelId },
        svgIcon(cat.icon),
        h('span', { class: 'card-label' },
          h('span', {},
            h('span', { class: 'card-title', text: cat.name }),
            cat.subtitle && h('span', { class: 'card-sub', text: cat.subtitle }),
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

  const cartTotal = () => round3([...cart].reduce((s, [k, q]) => s + ITEMS.get(k).price * q, 0));

  function cartRow(key, qty) {
    const it = ITEMS.get(key);
    return h('div', { class: 'cart-row' },
      h('span', { class: 'cart-row-name' }, it.name, h('small', { text: it.cat })),
      h('button', { type: 'button', class: 'qty-btn', 'data-dec': key, 'aria-label': `Retirer : ${it.name}`, text: '−' }),
      h('span', { class: 'cart-row-qty', text: String(qty) }),
      h('button', { type: 'button', class: 'qty-btn', 'data-inc': key, 'aria-label': `Ajouter : ${it.name}`, text: '+' }),
      h('span', { class: 'cart-row-price', text: fmt(round3(it.price * qty)) }));
  }

  function renderCart() {
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    els.count.textContent = String(count);
    els.bubble.hidden = count === 0;
    els.actions.hidden = count === 0;
    els.total.textContent = fmt(cartTotal());
    els.list.replaceChildren(...(count
      ? [...cart].map(([k, q]) => cartRow(k, q))
      : [h('p', { class: 'cart-empty', text: 'Votre commande est vide' })]));
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
      const it = ITEMS.get(k);
      return h('li', {},
        h('span', { class: 'ticket-qty', text: `${q}×` }),
        h('span', { class: 'ticket-name' }, it.name, h('small', { text: it.cat })),
        h('span', { class: 'ticket-price', text: fmt(round3(it.price * q)) }));
    }));
    els.ticketTotal.textContent = fmt(cartTotal());
    els.ticketTime.textContent = 'Commande composée à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
    if (e.key === 'Escape' && !els.panel.hidden) { setPanel(false); els.bubble.focus(); }
  });

  /* ---------- Navigation ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  function setNav(open) {
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  burger.addEventListener('click', () => setNav(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
  renderFeatured();
  renderTabs();
  renderMenu();
  setSection(SECTIONS[0].id);
  loadCart();
  renderCart();
  document.getElementById('maps-link').href = SITE.mapsUrl;
  document.getElementById('year').textContent = String(new Date().getFullYear());
  setupReveal();
})();

/*
 * Eight'In Flour & Coffee — page admin : articles et prix affichés sur le site.
 * Connexion via Supabase Auth ; les droits d'écriture sont vérifiés par la base (admin_users + RLS).
 */
(() => {
  'use strict';

  const API = window.EIGHTIN_API;
  const { SECTIONS } = window.EIGHTIN;
  const SESSION_KEY = 'eightin-admin-session';
  const $ = id => document.getElementById(id);

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

  const views = { login: $('view-login'), config: $('view-config'), admin: $('view-admin') };
  const show = name => { for (const [k, el] of Object.entries(views)) el.hidden = k !== name; };

  /* ---------- Messages ---------- */
  let toastTimer;
  function toast(message, isError = false) {
    const el = $('adm-toast');
    el.textContent = message;
    el.classList.toggle('is-error', isError);
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, isError ? 6000 : 3000);
  }

  /* ---------- Session (gardée le temps de l'onglet) ---------- */
  let session = null;

  function saveSession(s) {
    session = s;
    try {
      if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch { /* stockage indisponible : session en mémoire */ }
  }

  function readSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  }

  async function renewSession() {
    const s = await API.refresh(session.refresh_token);
    saveSession({ ...s, user: s.user || session.user });
  }

  function expire(message = 'Session expirée : reconnectez-vous.') {
    saveSession(null);
    show('login');
    $('login-error').textContent = message;
  }

  const authError = () => Object.assign(new Error('Session expirée'), { status: 401 });

  async function renewOrExpire() {
    try { await renewSession(); } catch { expire(); throw authError(); }
  }

  // Exécute une requête authentifiée ; renouvelle la session une fois si le jeton a expiré.
  async function withAuth(fn) {
    if (!session) { expire(); throw authError(); }
    if (Date.now() > session.expires_at - 60000) await renewOrExpire();
    try {
      return await fn(session.access_token);
    } catch (err) {
      if (err.status !== 401) throw err;
      await renewOrExpire();
      try {
        return await fn(session.access_token);
      } catch (again) {
        if (again.status === 401) { expire(); throw authError(); }
        throw again;
      }
    }
  }

  /* ---------- Connexion / déconnexion ---------- */
  $('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = $('login-email').value.trim();
    const password = $('login-password').value;
    const error = $('login-error');
    const button = $('login-submit');
    error.textContent = '';
    if (!email || !password) { error.textContent = 'E-mail et mot de passe requis.'; return; }

    button.disabled = true;
    button.textContent = 'Connexion…';
    try {
      const s = await API.signIn(email, password);
      if (!s.user || !(await API.isAdmin(s.access_token, s.user.id))) {
        await API.signOut(s.access_token);
        error.textContent = 'Ce compte n’a pas les droits d’administration.';
        return;
      }
      saveSession(s);
      $('login-password').value = '';
      await openAdmin();
    } catch (err) {
      error.textContent = err.status === 400 || err.status === 401
        ? 'E-mail ou mot de passe incorrect.'
        : err instanceof TypeError
          ? 'Connexion impossible : la base ne répond pas (vérifiez la connexion internet).'
          : `Connexion impossible : ${err.message}`;
    } finally {
      button.disabled = false;
      button.textContent = 'Se connecter';
    }
  });

  $('logout').addEventListener('click', async () => {
    if (hasUnsaved() && !confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) return;
    if (session) await API.signOut(session.access_token);
    saveSession(null);
    $('login-error').textContent = '';
    show('login');
    $('login-email').focus();
  });

  /* ---------- Données ---------- */
  let categories = [];
  let items = [];
  let activeSection = SECTIONS[0].id;

  const byId = id => items.find(it => it.id === id);
  const tr = v => (v && typeof v === 'object' ? v.fr : v);
  const fmtPrice = p => (Number.isInteger(Number(p)) ? String(Number(p)) : Number(p).toFixed(3).replace(/0+$/, ''));

  async function openAdmin() {
    show('admin');
    $('adm-email').textContent = session.user ? session.user.email : '';
    $('adm-categories').replaceChildren(h('p', { class: 'adm-muted', text: 'Chargement du menu…' }));
    try {
      ({ categories, items } = await withAuth(t => API.loadAll(t)));
      render();
    } catch (err) {
      if (err.status !== 401) {
        $('adm-categories').replaceChildren(h('p', { class: 'adm-error', text: `Impossible de charger le menu : ${err.message}` }));
      }
    }
  }

  /* ---------- Saisie ---------- */
  function parsePrice(raw) {
    const v = Number(String(raw).trim().replace(',', '.'));
    return Number.isFinite(v) && v >= 0 && v < 1000 && /^\d+([.,]\d{1,3})?$/.test(String(raw).trim()) ? v : null;
  }

  function readFields(scope) {
    const nameFr = scope.querySelector('[data-f="name_fr"]').value.trim();
    const nameEn = scope.querySelector('[data-f="name_en"]').value.trim();
    const price = parsePrice(scope.querySelector('[data-f="price"]').value);
    if (!nameFr || nameFr.length > 80) return { error: 'Le nom (FR) est obligatoire (80 caractères max).' };
    if (nameEn.length > 80) return { error: 'Le nom (EN) fait 80 caractères max.' };
    if (price === null) return { error: 'Prix invalide : un nombre entre 0 et 999, par ex. 12 ou 12.5.' };
    return { values: { name_fr: nameFr, name_en: nameEn || null, price } };
  }

  const field = (label, input) => h('label', { class: `adm-field f-${input.dataset.f}` }, label, input);
  const input = (f, value, extra = {}) =>
    h('input', { class: 'adm-input', 'data-f': f, value: value ?? '', autocomplete: 'off', ...extra });

  /* ---------- Rendu ---------- */
  function render() {
    renderTabs();
    const host = $('adm-categories');
    const query = $('adm-filter').value.trim().toLowerCase();
    host.replaceChildren(...categories
      .filter(c => c.section === activeSection)
      .map(c => renderCategory(c, query))
      .filter(Boolean));
    if (!host.children.length) host.append(h('p', { class: 'adm-muted', text: 'Aucun article ne correspond au filtre.' }));
  }

  function renderTabs() {
    const tabs = $('adm-tabs');
    tabs.replaceChildren(...SECTIONS.map(s => {
      const n = items.filter(it => categories.some(c => c.id === it.category_id && c.section === s.id)).length;
      const tab = h('button', {
        type: 'button', role: 'tab', class: 'menu-tab', 'aria-selected': String(s.id === activeSection),
      }, tr(s.label), h('span', { class: 'menu-tab-count', text: String(n) }));
      tab.addEventListener('click', () => {
        if (s.id === activeSection) return;
        if (hasUnsaved() && !confirm('Des modifications ne sont pas enregistrées. Changer de rubrique quand même ?')) return;
        activeSection = s.id;
        render();
      });
      return tab;
    }));
  }

  function renderCategory(cat, query) {
    const rows = items
      .filter(it => it.category_id === cat.id)
      .sort((a, b) => a.sort - b.sort);
    const shown = query
      ? rows.filter(it => `${it.name_fr} ${it.name_en || ''}`.toLowerCase().includes(query))
      : rows;
    if (query && !shown.length) return null;

    const hiddenCount = rows.filter(it => !it.visible).length;
    const title = h('h2', {}, cat.name_fr, cat.subtitle_fr ? h('small', { text: cat.subtitle_fr }) : null);
    const count = h('span', { class: 'adm-count', text: `${rows.length} article${rows.length > 1 ? 's' : ''}${hiddenCount ? ` · ${hiddenCount} masqué${hiddenCount > 1 ? 's' : ''}` : ''}` });

    const section = h('section', { class: 'adm-cat', 'data-cat': cat.id },
      h('header', { class: 'adm-cat-head' }, title, count));

    if (cat.info_fr && !rows.length) {
      section.append(h('p', { class: 'adm-muted', text: 'Carte sans prix (texte d’information) : son texte se modifie directement dans la base.' }));
      return section;
    }
    section.append(...shown.map(renderRow));
    if (!query) section.append(renderAddForm(cat, rows));
    return section;
  }

  function renderRow(it) {
    const nameFr = input('name_fr', it.name_fr, { maxlength: '80', 'aria-label': `Nom (FR) de ${it.name_fr}` });
    const nameEn = input('name_en', it.name_en, { maxlength: '80', placeholder: 'Identique au FR', 'aria-label': `Nom (EN) de ${it.name_fr}` });
    const price = input('price', fmtPrice(it.price), { inputmode: 'decimal', 'aria-label': `Prix de ${it.name_fr} en DT` });

    const visible = h('button', {
      type: 'button', class: 'adm-toggle f-visible', 'aria-pressed': String(it.visible),
      title: it.visible ? 'Affiché sur le site — cliquer pour masquer' : 'Masqué sur le site — cliquer pour afficher',
      text: it.visible ? 'Affiché' : 'Masqué',
    });
    const star = h('button', {
      type: 'button', class: 'adm-star f-featured', 'aria-pressed': String(it.featured),
      'aria-label': it.featured ? `Retirer ${it.name_fr} de « À découvrir »` : `Mettre ${it.name_fr} dans « À découvrir »`,
      title: 'À découvrir', text: it.featured ? '★' : '☆',
    });
    const save = h('button', { type: 'button', class: 'btn btn-navy adm-save', hidden: true, text: 'Enregistrer' });
    const cancel = h('button', { type: 'button', class: 'adm-text-btn', hidden: true, text: 'Annuler' });
    const del = h('button', { type: 'button', class: 'adm-delete', 'aria-label': `Supprimer ${it.name_fr}`, title: 'Supprimer', text: 'Supprimer' });

    const row = h('div', { class: `adm-row${it.visible ? '' : ' is-hidden'}`, 'data-id': it.id },
      field(it.group_title ? `Nom (FR) · ${it.group_title}` : 'Nom (FR)', nameFr),
      field('Nom (EN)', nameEn),
      field('Prix (DT)', price),
      visible, star,
      h('div', { class: 'adm-actions f-actions' }, save, cancel, del));

    const isDirty = () => nameFr.value !== (it.name_fr ?? '') || nameEn.value !== (it.name_en ?? '') || price.value !== fmtPrice(it.price);
    const syncDirty = () => {
      const dirty = isDirty();
      row.classList.toggle('is-dirty', dirty);
      save.hidden = !dirty;
      cancel.hidden = !dirty;
    };
    [nameFr, nameEn, price].forEach(el => {
      el.addEventListener('input', syncDirty);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' && isDirty()) { e.preventDefault(); save.click(); }
        if (e.key === 'Escape' && isDirty()) { e.preventDefault(); cancel.click(); }
      });
    });

    cancel.addEventListener('click', () => {
      nameFr.value = it.name_fr ?? '';
      nameEn.value = it.name_en ?? '';
      price.value = fmtPrice(it.price);
      syncDirty();
    });

    save.addEventListener('click', async () => {
      const { values, error } = readFields(row);
      if (error) { toast(error, true); return; }
      save.disabled = true;
      try {
        const updated = await withAuth(t => API.updateItem(t, it.id, values));
        replaceItem(updated);
        toast(`« ${updated.name_fr} » enregistré : ${fmtPrice(updated.price)} DT ✓`);
      } catch (err) {
        save.disabled = false;
        if (err.status !== 401) toast(`Échec de l’enregistrement : ${err.message}`, true);
      }
    });

    visible.addEventListener('click', () => quickUpdate(it, { visible: !it.visible },
      u => (u.visible ? `« ${u.name_fr} » est affiché sur le site` : `« ${u.name_fr} » est masqué du site`), visible));
    star.addEventListener('click', () => quickUpdate(it, { featured: !it.featured },
      u => (u.featured ? `« ${u.name_fr} » ajouté à « À découvrir »` : `« ${u.name_fr} » retiré de « À découvrir »`), star));

    del.addEventListener('click', async () => {
      if (!confirm(`Supprimer « ${it.name_fr} » du menu ? Cette action est définitive.\n(Pour un article épuisé, préférez « Masqué ».)`)) return;
      del.disabled = true;
      try {
        await withAuth(t => API.deleteItem(t, it.id));
        items = items.filter(x => x.id !== it.id);
        render();
        toast(`« ${it.name_fr} » supprimé`);
      } catch (err) {
        del.disabled = false;
        if (err.status !== 401) toast(`Suppression impossible : ${err.message}`, true);
      }
    });

    return row;
  }

  async function quickUpdate(it, patch, message, button) {
    if (document.querySelector(`.adm-row[data-id="${CSS.escape(it.id)}"].is-dirty`)) {
      toast('Enregistrez ou annulez d’abord la modification en cours sur cet article.', true);
      return;
    }
    button.disabled = true;
    try {
      const updated = await withAuth(t => API.updateItem(t, it.id, patch));
      replaceItem(updated);
      toast(message(updated));
    } catch (err) {
      button.disabled = false;
      if (err.status !== 401) toast(`Échec : ${err.message}`, true);
    }
  }

  function replaceItem(updated) {
    items = items.map(x => (x.id === updated.id ? updated : x));
    render();
  }

  function renderAddForm(cat, rows) {
    const groups = [...new Set(rows.map(it => it.group_title).filter(Boolean))];
    const nameFr = input('name_fr', '', { maxlength: '80', placeholder: 'Nouvel article' });
    const nameEn = input('name_en', '', { maxlength: '80', placeholder: 'Identique au FR' });
    const price = input('price', '', { inputmode: 'decimal', placeholder: '0' });
    const group = groups.length
      ? h('select', { class: 'adm-input', 'data-f': 'group' }, ...groups.map(g => h('option', { value: g, text: g })))
      : null;
    const add = h('button', { type: 'submit', class: 'btn btn-navy adm-add-btn', text: '+ Ajouter' });

    const form = h('form', { class: 'adm-add', novalidate: true },
      field('Nouvel article (FR)', nameFr),
      field('Nom (EN)', nameEn),
      field('Prix (DT)', price),
      group ? h('label', { class: 'adm-field f-group' }, 'Sous-groupe', group) : null,
      add);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const { values, error } = readFields(form);
      if (error) { toast(error, true); return; }
      add.disabled = true;
      try {
        const created = await withAuth(t => API.createItem(t, {
          ...values,
          category_id: cat.id,
          group_title: group ? group.value : null,
          sort: rows.reduce((m, it) => Math.max(m, it.sort), 0) + 1,
          visible: true,
          featured: false,
        }));
        items = [...items, created];
        render();
        toast(`« ${created.name_fr} » ajouté à ${cat.name_fr} ✓`);
        const again = document.querySelector(`.adm-cat[data-cat="${CSS.escape(cat.id)}"] .adm-add [data-f="name_fr"]`);
        if (again) again.focus();
      } catch (err) {
        add.disabled = false;
        if (err.status !== 401) toast(`Ajout impossible : ${err.message}`, true);
      }
    });
    return form;
  }

  /* ---------- Filtre et modifications non enregistrées ---------- */
  const hasUnsaved = () => Boolean(document.querySelector('.adm-row.is-dirty'));

  let lastFilter = '';
  $('adm-filter').addEventListener('input', e => {
    if (hasUnsaved() && !confirm('Des modifications ne sont pas enregistrées. Filtrer quand même ?')) {
      e.target.value = lastFilter;
      return;
    }
    lastFilter = e.target.value;
    render();
  });

  window.addEventListener('beforeunload', e => {
    if (hasUnsaved()) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Démarrage ---------- */
  (async () => {
    if (!API || !API.configured) { show('config'); return; }
    const saved = readSession();
    if (!saved) { show('login'); return; }
    session = saved;
    try {
      await withAuth(t => API.getUser(t));
      await openAdmin();
    } catch {
      saveSession(null);
      show('login');
    }
  })();
})();

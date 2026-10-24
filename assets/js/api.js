/*
 * Eight'In Flour & Coffee — accès à la base du menu (API REST de Supabase).
 * Seul fichier qui connaît les tables : si la base change de structure, c'est ici qu'on adapte.
 * Aucune librairie externe : de simples appels fetch.
 */
window.EIGHTIN_API = (() => {
  'use strict';

  const cfg = window.EIGHTIN_CONFIG || {};
  const base = String(cfg.supabaseUrl || '').trim().replace(/\/+$/, '');
  const key = String(cfg.supabaseKey || '').trim();
  const configured = Boolean(base && key);

  function headers(token, extra = {}) {
    const h = { apikey: key, ...extra };
    // Clé "anon" historique (JWT) : elle sert aussi d'autorisation par défaut.
    // Les nouvelles clés "publishable" ne doivent pas être envoyées en Authorization.
    if (token) h.Authorization = `Bearer ${token}`;
    else if (key.startsWith('eyJ')) h.Authorization = `Bearer ${key}`;
    return h;
  }

  async function request(path, { method = 'GET', token, body, prefer, signal } = {}) {
    const extra = {};
    if (body !== undefined) extra['Content-Type'] = 'application/json';
    if (prefer) extra.Prefer = prefer;
    const res = await fetch(base + path, {
      method,
      headers: headers(token, extra),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = (data && (data.message || data.error_description || data.msg || data.error)) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  /* ---------- Lignes de la base → structure utilisée par le site ---------- */
  const bi = (fr, en) => (en && en !== fr ? { fr, en } : fr || undefined);

  function rowsToMenu(categories, items) {
    const order = new Map(categories.map((c, i) => [c.id, i]));
    const sorted = [...items].sort((a, b) =>
      (order.get(a.category_id) ?? 999) - (order.get(b.category_id) ?? 999) || a.sort - b.sort);

    const MENU = categories.map(c => {
      const groups = [];
      for (const it of sorted) {
        if (it.category_id !== c.id) continue;
        const title = it.group_title || undefined;
        let g = groups.find(x => x.title === title);
        if (!g) groups.push(g = { title, items: [] });
        g.items.push({
          id: it.id,
          name: bi(it.name_fr, it.name_en),
          desc: it.desc_fr ? bi(it.desc_fr, it.desc_en) : undefined,
          tag: it.tag || undefined,
          price: Number(it.price),
        });
      }
      return {
        id: c.id,
        section: c.section,
        name: bi(c.name_fr, c.name_en),
        subtitle: bi(c.subtitle_fr, c.subtitle_en),
        label: bi(c.label_fr, c.label_en),
        unit: bi(c.unit_fr, c.unit_en),
        note: bi(c.note_fr, c.note_en),
        info: bi(c.info_fr, c.info_en),
        theme: c.theme,
        icon: c.icon,
        groups,
      };
    }).filter(c => c.info || c.groups.length);

    const FEATURED = sorted.filter(it => it.featured).map(it => `${it.category_id}/${it.id}`);
    return { MENU, FEATURED };
  }

  /* ---------- Site vitrine : lecture publique ---------- */
  async function fetchMenu({ timeout = 6000 } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const [categories, items] = await Promise.all([
        request('/rest/v1/categories?select=*&order=sort.asc', { signal: ctrl.signal }),
        request('/rest/v1/items?select=*&visible=eq.true&order=sort.asc', { signal: ctrl.signal }),
      ]);
      if (!Array.isArray(categories) || !categories.length) throw new Error('Menu vide');
      return rowsToMenu(categories, items);
    } finally {
      clearTimeout(timer);
    }
  }

  /* ---------- Admin : connexion (Supabase Auth) ---------- */
  const session = s => ({
    access_token: s.access_token,
    refresh_token: s.refresh_token,
    expires_at: Date.now() + (Number(s.expires_in) || 3600) * 1000,
    user: s.user ? { id: s.user.id, email: s.user.email } : null,
  });

  const signIn = async (email, password) =>
    session(await request('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } }));
  const refresh = async refreshToken =>
    session(await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: refreshToken } }));
  const getUser = token => request('/auth/v1/user', { token });
  const signOut = token => request('/auth/v1/logout', { method: 'POST', token }).catch(() => null);

  async function isAdmin(token, userId) {
    const rows = await request(`/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(userId)}`, { token });
    return Array.isArray(rows) && rows.length === 1;
  }

  /* ---------- Admin : articles ---------- */
  async function loadAll(token) {
    const [categories, items] = await Promise.all([
      request('/rest/v1/categories?select=*&order=sort.asc', { token }),
      request('/rest/v1/items?select=*&order=sort.asc', { token }),
    ]);
    return { categories, items };
  }

  // Une écriture refusée par les règles d'accès ne renvoie aucune ligne : on la traite comme une erreur.
  const refused = () => Object.assign(new Error('Modification refusée par la base (droits insuffisants).'), { status: 403 });

  async function updateItem(token, id, patch) {
    const rows = await request(`/rest/v1/items?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH', token, body: patch, prefer: 'return=representation',
    });
    if (!Array.isArray(rows) || rows.length !== 1) throw refused();
    return rows[0];
  }

  async function createItem(token, row) {
    const rows = await request('/rest/v1/items', { method: 'POST', token, body: row, prefer: 'return=representation' });
    if (!Array.isArray(rows) || rows.length !== 1) throw refused();
    return rows[0];
  }

  async function deleteItem(token, id) {
    const rows = await request(`/rest/v1/items?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE', token, prefer: 'return=representation',
    });
    if (!Array.isArray(rows) || rows.length !== 1) throw refused();
  }

  return { configured, rowsToMenu, fetchMenu, signIn, refresh, getUser, signOut, isAdmin, loadAll, updateItem, createItem, deleteItem };
})();

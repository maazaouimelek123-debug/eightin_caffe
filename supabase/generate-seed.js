#!/usr/bin/env node
/*
 * Génère supabase/seed.sql à partir de la carte actuelle (assets/js/menu-data.js).
 * Usage : node supabase/generate-seed.js > supabase/seed.sql
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js/menu-data.js'), 'utf8'), sandbox);
const { MENU, FEATURED } = sandbox.window.EIGHTIN;

const fr = v => (v && typeof v === 'object' ? v.fr : v);
const en = v => (v && typeof v === 'object' && v.en !== v.fr ? v.en : null);
const lit = v => {
  if (v === null || v === undefined || v === '') return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return `'${String(v).replace(/'/g, "''")}'`;
};
const row = values => `  (${values.map(lit).join(', ')})`;

const categories = MENU.map((c, i) => row([
  c.id, c.section, i + 1,
  fr(c.name), en(c.name), fr(c.subtitle), en(c.subtitle), fr(c.label), en(c.label),
  fr(c.unit), en(c.unit), fr(c.note), en(c.note), fr(c.info), en(c.info),
  c.theme, c.icon,
]));

const items = [];
for (const c of MENU) {
  let sort = 0;
  for (const g of c.groups) {
    for (const it of g.items) {
      sort += 1;
      items.push(row([
        c.id, g.title || null, sort,
        fr(it.name), en(it.name), fr(it.desc), en(it.desc), fr(it.tag),
        it.price, FEATURED.includes(`${c.id}/${it.id}`),
      ]));
    }
  }
}

process.stdout.write(`-- ============================================================================
-- Eight'In Flour & Coffee — menu de départ (${categories.length} catégories, ${items.length} articles)
-- Fichier généré par supabase/generate-seed.js à partir de assets/js/menu-data.js.
-- À exécuter APRÈS schema.sql. Sans effet si les articles existent déjà.
-- ============================================================================

insert into public.categories
  (id, section, sort, name_fr, name_en, subtitle_fr, subtitle_en, label_fr, label_en,
   unit_fr, unit_en, note_fr, note_en, info_fr, info_en, theme, icon)
values
${categories.join(',\n')}
on conflict (id) do nothing;

insert into public.items
  (category_id, group_title, sort, name_fr, name_en, desc_fr, desc_en, tag, price, featured)
select v.category_id, v.group_title, v.sort, v.name_fr, v.name_en, v.desc_fr, v.desc_en, v.tag, v.price::numeric, v.featured
from (values
${items.join(',\n')}
) as v (category_id, group_title, sort, name_fr, name_en, desc_fr, desc_en, tag, price, featured)
where not exists (select 1 from public.items);
`);

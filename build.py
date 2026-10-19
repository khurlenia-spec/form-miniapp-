#!/usr/bin/env python3
"""Сборка public/index.html из src/. Запуск: python3 build.py"""
import re, pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
mod = (src / 'vendor' / 'htm-preact.module.js').read_text()
m = re.search(r'export\s*\{([^}]*)\}\s*;?\s*$', mod)
binds = []
for part in m.group(1).split(','):
    a, b = [x.strip() for x in part.split(' as ')]
    binds.append(f'{b}:{a}')
lib = 'const __p=(()=>{' + mod[:m.start()] + ';return {' + ','.join(binds) + '};})();'
prelude = r'''
const { html, render, useState, useEffect, useRef, useMemo } = __p;
const tg = window.Telegram && window.Telegram.WebApp;
const INIT = tg && tg.initData ? tg.initData : '';
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor('#0F1011'); tg.setBackgroundColor('#0F1011'); if (tg.disableVerticalSwipes) tg.disableVerticalSwipes(); } catch (e) {} }
const tgUser = INIT && tg.initDataUnsafe && tg.initDataUnsafe.user;
const HELLO = tgUser && tgUser.first_name ? 'Привет, ' + tgUser.first_name + '.' : 'Привет.';
const API = {
  ok: !!INIT && location.protocol === 'https:',
  async req(method, path, body) {
    try {
      const r = await fetch(path, { method, headers: { 'Content-Type': 'application/json', 'X-Init-Data': INIT }, body: body ? JSON.stringify(body) : undefined });
      return r.ok ? await r.json() : null;
    } catch (e) { return null; }
  },
  get() { return this.req('GET', '/api/state'); },
  post(p, b) { return this.req('POST', p, b); },
  save(state, meta) { clearTimeout(this._t); this._t = setTimeout(() => this.req('POST', '/api/state', { state, meta }), 800); }
};
'''
js = lib + prelude + '\n'.join((src / f).read_text() for f in ['data.js', 'logic.js', 'avatar.js', 'app.js'])
js += "\nrender(html`<${App} />`, document.getElementById('app'));\n"
css = (src / 'style.css').read_text()
doc = f'''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0F1011">
<title>FORM</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Manrope:wght@400;500;600;700;800&display=swap">
<style>
{css}
</style>
</head>
<body>
<div id="app"></div>
<script type="module">
{js}
</script>
</body>
</html>
'''
(root / 'public' / 'index.html').write_text(doc)
print('built', len(doc.encode()), 'bytes')

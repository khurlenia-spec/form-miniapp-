// ===== FORM — приложение. Разработка Александра Гурлени =====
const LS_KEY = 'form-v3';
const SIGN = html`<div class="lbl" style="text-align:center;margin-top:26px;font-size:10px;letter-spacing:.18em;color:#868B90">Разработка Александра Гурлени</div>`;

const I = {
  coin: html`<svg class="coin" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#FFC93C"/><circle cx="10" cy="10" r="6.5" fill="none" stroke="#E0A400" stroke-width="1.6"/><path d="M8 6.5h4M8 10h3.5M8 6.5v7" stroke="#8A5B00" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bolt: html`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#4CC9F0"/></svg>`,
  check: (c = '#0F1011', w = 18) => html`<svg width=${w} height=${w} viewBox="0 0 24 24" fill="none" stroke=${c} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  back: html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>`,
  arrow: html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  plus: html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  x: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  home: html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/></svg>`,
  food: html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.5 1.5-4 4-4 8h4"/></svg>`,
  act: html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>`,
  prog: html`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19h16M6 15l4-5 3 3 5-7"/></svg>`,
  cart: html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8F542" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>`,
  info: html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>`,
  steps: html`<svg width="22" height="22" viewBox="0 0 24 24" fill="#C8F542" aria-hidden="true"><ellipse cx="8" cy="7" rx="3" ry="4.5"/><ellipse cx="16" cy="12" rx="3" ry="4.5"/><rect x="5.5" y="12.5" width="5" height="3" rx="1.5"/><rect x="13.5" y="17.5" width="5" height="3" rx="1.5"/></svg>`,
  fire: html`<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 7 13c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z" fill="#FF7A45"/></svg>`
};

function initState() {
  return {
    v: 3, date: todayISO(), screen: 'welcome', step: 0, edit: false,
    goal: null, age: '', h: '', w: '', tw: '', sex: 1, horizon: 1, act: 1, freq: 1, sleepT: 1, meals: 2, restr: {}, budget: 1, cook: 1, split: false,
    av: { g: 'f', name: '', hair: 0, hc: 1, skin: 0, top: 'tee', bottom: 'joggers', shoes: 'basic', acc: 'none', ctop: 0, cbot: 5, cshoe: 4, owned: {}, lastSize: null },
    game: { xp: 0, coins: 0, energy: ENERGY_MAX, ets: Date.now(), claimed: {}, bonusDay: null, streak: 0, taps: 0 },
    tab: 'home', day: null, eaten: {}, over: {}, water: 0, checkin: false, mood: null, sleep: null, feel: null, planB: null,
    diary: {}, actLog: {}, wlog: {}, trDone: {}, startDate: null, period: 1, shop: {}
  };
}
function migrate(o) {
  if (!o || typeof o !== 'object') return null;
  const base = initState();
  const s = { ...base, ...o, av: { ...base.av, ...(o.av || {}) }, game: { ...base.game, ...(o.game || {}) } };
  if (!o.v) {
    s.av.g = o.sex === 1 ? 'f' : 'm';
    const td = {};
    Object.keys(o.trDone || {}).forEach((k) => { if (/^\d{4}-/.test(k)) td[k] = true; });
    s.trDone = td;
    s.v = 3;
  }
  if (s.screen === 'loading') s.screen = 'app';
  return s;
}
function fresh(st) {
  const t = todayISO();
  if (st.date === t) return st;
  const cut = (() => { const n = new Date(); return iso(n.getFullYear(), n.getMonth(), n.getDate() - 60); })();
  const prune = (o) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => k >= cut));
  return { ...st, date: t, diary: prune(st.diary), actLog: prune(st.actLog), eaten: {}, water: 0, checkin: false, mood: null, sleep: null, feel: null, planB: null, day: null, game: { ...st.game, claimed: {} } };
}
function loadLocal() {
  try { const o = JSON.parse(localStorage.getItem(LS_KEY) || 'null') || JSON.parse(localStorage.getItem('form-v2') || 'null'); return o ? fresh(migrate(o)) : initState(); } catch (e) { return initState(); }
}
const energyNow = (g) => Math.min(ENERGY_MAX, (g.energy ?? ENERGY_MAX) + Math.floor((Date.now() - (g.ets || Date.now())) / ENERGY_MS));

function App() {
  const [s, setS] = useState(loadLocal);
  const [ui, setUi] = useState({ sheet: null });
  const [toast, setToast] = useState(null);
  const [fly, setFly] = useState(null);
  const [lvlUp, setLvlUp] = useState(null);
  const synced = useRef(!API.ok);
  const tT = useRef(null), fT = useRef(null);

  const set = (patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }));
  const say = (m) => { setToast(m); clearTimeout(tT.current); tT.current = setTimeout(() => setToast(null), 2600); };
  showHint = say;
  const open = (sheet, extra = {}) => setUi({ sheet, ...extra });
  const close = () => setUi({ sheet: null });

  const award = (kind, sub = '') => {
    const R0 = REWARDS[kind];
    const cl = s.game.claimed || {};
    const key = kind + ':' + sub;
    if (cl[key]) return;
    if (R0.max && Object.keys(cl).filter((k) => k.startsWith(kind + ':')).length >= R0.max) return;
    const before = levelOf(s.game.xp).lvl, after = levelOf(s.game.xp + R0.xp).lvl;
    setS((p) => ({ ...p, game: { ...p.game, xp: p.game.xp + R0.xp, coins: p.game.coins + R0.c, claimed: { ...(p.game.claimed || {}), [key]: true } } }));
    setFly({ id: Date.now(), xp: R0.xp, c: R0.c }); clearTimeout(fT.current); fT.current = setTimeout(() => setFly(null), 1600);
    if (tg && tg.HapticFeedback) try { tg.HapticFeedback.notificationOccurred('success'); } catch (e) {}
    if (after > before) setTimeout(() => setLvlUp(after), 900);
  };

  useEffect(() => {
    (async () => {
      if (!API.ok) return;
      const r = await API.get();
      if (r && r.state) { const m = migrate(r.state); if (m) setS(fresh(m)); }
      synced.current = true;
    })();
    const t = setInterval(() => setS((p) => (p.date !== todayISO() ? fresh(p) : p)), 60000);
    return () => clearInterval(t);
  }, []);

  const T = target(s);
  const lv = levelOf(s.game.xp);
  const body = bodyOf(s, lv.lvl);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
    if (API.ok && synced.current && s.screen === 'app') API.save(s, metaOf(s, T, lv));
  }, [s]);

  useEffect(() => {
    if (s.screen !== 'app') return;
    if (!s.av.lastSize) { set((p) => ({ av: { ...p.av, lastSize: body.size } })); return; }
    if (s.av.lastSize !== body.size) {
      const down = SIZES.indexOf(body.size) < SIZES.indexOf(s.av.lastSize);
      say((down ? 'Минус размер! ' : 'Новый размер! ') + 'Одежда героя теперь ' + body.size);
      set((p) => ({ av: { ...p.av, lastSize: body.size } }));
    }
  }, [body.size, s.screen]);

  const ctx = { s, set, T, lv, body, award, say, open, close, ui, setUi };
  let screen;
  if (s.screen === 'welcome') screen = html`<${Welcome} ...${ctx} />`;
  else if (s.screen === 'onb') screen = html`<${Onboarding} ...${ctx} />`;
  else if (s.screen === 'loading') screen = html`<${Loading} ...${ctx} />`;
  else screen = html`<${Main} ...${ctx} />`;

  return html`<div class="root">
    ${screen}
    ${ui.sheet ? html`<${Sheets} ...${ctx} />` : null}
    ${lvlUp !== null ? html`<${LevelUp} ...${ctx} lvl=${lvlUp} onClose=${() => setLvlUp(null)} />` : null}
    ${fly ? html`<div class="xpfly" key=${fly.id}>+${fly.xp} XP · +${fly.c} ${I.coin}</div>` : null}
    ${toast ? html`<div class="toast" role="status"><span style="width:24px;height:24px;flex:none;border-radius:8px;background:#C8F542;display:flex;align-items:center;justify-content:center">${I.check('#0F1011', 14)}</span><span>${toast}</span></div>` : null}
  </div>`;
}

function metaOf(s, T, lv) {
  const d = todayISO();
  const today = dayPlan(s, T, wdOf(new Date()));
  return { date: s.date, goal: s.goal !== null ? GOALS[s.goal].n : null, kcal: T.kcal, mealsDone: today.filter((x) => s.eaten[x.key]).length, mealsTotal: today.length,
    diaryN: (s.diary[d] || []).length, checkin: !!s.checkin, mood: s.mood, trToday: !!s.trDone[d], trWeek: Object.keys(s.trDone).filter((k) => k >= weekDates()[0]).length,
    steps: (s.actLog[d] || {}).steps || 0, level: lv.lvl, weight: curWeight(s), planB: s.planB || null, split: !!s.split };
}
function weekDates() {
  const n = new Date(), i = wdOf(n);
  return Array.from({ length: 7 }, (_, k) => { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() - i + k); return iso(d.getFullYear(), d.getMonth(), d.getDate()); });
}

// ===== Приветствие =====
function Welcome({ s, set }) {
  const a1 = { g: 'f', hair: 1, hc: 4, skin: 1, top: 'crop', bottom: 'leggings', shoes: 'run', ctop: 1, cbot: 5, cshoe: 4, acc: 'band' };
  const a2 = { g: 'm', hair: 1, hc: 1, skin: 2, top: 'tank', bottom: 'shorts', shoes: 'high', ctop: 0, cbot: 2, cshoe: 4, acc: 'watch' };
  const bd = { fat: 0.15, mus: 0.75, glow: 0.8 };
  return html`<div style="position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden">
    <div class="between" style="padding:22px 22px 0"><span class="dg" style="font-size:18px">FORM<span style="color:#C8F542">.</span></span><span class="lbl">Personal fitness system</span></div>
    <div style="position:relative;flex:1;min-height:0">
      <div class="dg outline" style="position:absolute;left:16px;top:8px;font-size:120px;line-height:.9">FO</div>
      <div class="dg" style="position:absolute;left:16px;top:112px;font-size:120px;line-height:.9;color:#C8F542">RM</div>
      <div style="position:absolute;right:-18px;top:0;width:190px;transform:rotate(4deg)"><${Avatar} a=${a1} body=${bd} w=${190} cls="idle" /></div>
      <div style="position:absolute;right:96px;top:120px;width:160px;transform:rotate(-5deg)"><${Avatar} a=${a2} body=${bd} w=${160} cls="idle" /></div>
      <div style="position:absolute;left:-20px;right:-20px;bottom:14px;transform:rotate(-4deg);background:#C8F542;color:#0F1011;padding:9px 0;overflow:hidden">
        <div class="marq dg" style="font-size:15px;letter-spacing:.06em;gap:18px;white-space:nowrap"><span>ПИТАНИЕ ✦ ГЕРОЙ ✦ АКТИВНОСТЬ ✦ ПЛАН Б ✦ ТРЕНЕР ✦</span><span>ПИТАНИЕ ✦ ГЕРОЙ ✦ АКТИВНОСТЬ ✦ ПЛАН Б ✦ ТРЕНЕР ✦</span></div>
      </div>
    </div>
    <div style="padding:6px 22px 20px">
      <h1 class="h1" style="font-size:29px">Собери свою форму. <span style="color:#C8F542">Без хаоса.</span></h1>
      <p class="mu" style="margin:10px 0 18px">Создай героя — он будет становиться сильнее и красивее вместе с тобой.</p>
      <button class="btn lime full" style="justify-content:space-between;padding:0 8px 0 22px;height:60px;font-size:17px" onClick=${() => set({ screen: 'onb', step: 0, edit: false })}>Начать свой путь
        <span style="width:44px;height:44px;border-radius:14px;background:#0F1011;color:#C8F542;display:flex;align-items:center;justify-content:center">${I.arrow}</span></button>
      ${SIGN}
    </div>
  </div>`;
}

// ===== Онбординг (и редактирование профиля) =====
function Onboarding({ s, set, T, body, lv, say }) {
  const step = s.step;
  const N = 6;
  const pick = (k, v) => set({ [k]: v });
  const numIn = (k) => (e) => set({ [k]: String(e.target.value).replace(/[^0-9.,]/g, '').slice(0, 5) });
  const canNext = !(step === 1 && s.goal === null) && !(step === 0 && !s.av.name.trim());
  const next = () => {
    if (!canNext) { say(step === 0 ? 'Придумай имя герою' : 'Выбери цель'); return; }
    if (step < N - 1) return set({ step: step + 1 });
    if (s.edit) { set({ screen: 'app', edit: false }); say('Профиль обновлён — меню пересчитано'); return; }
    set({ screen: 'loading', startDate: s.startDate || todayISO() });
    setTimeout(() => set({ screen: 'app', tab: 'hero' }), 2800);
  };
  const back = () => (step > 0 ? set({ step: step - 1 }) : set({ screen: s.edit ? 'app' : 'welcome', edit: false }));
  const setAv = (patch) => set((p) => ({ av: { ...p.av, ...patch } }));
  const tw = num(s.tw, 0);
  let goalCheck = 'Проверим, насколько цель реалистична. Точных обещаний «минус N кг за месяц» не даём.';
  if (tw) { const pw = Math.abs(curWeight(s) - tw) / ([1, 3, 6][s.horizon] * 4.3); goalCheck = pw > 1 ? `Это ≈ ${fmtD(pw)} кг в неделю — слишком быстро. Лучше выбрать горизонт подлиннее.` : `Это ≈ ${fmtD(pw)} кг в неделю — реалистичный темп.`; }

  return html`<div style="position:absolute;inset:0;display:flex;flex-direction:column">
    <div class="row" style="padding:16px 18px 8px">
      <button aria-label="Назад" onClick=${back} style="width:44px;height:44px;flex:none;border-radius:14px;background:#1A1C1E;display:flex;align-items:center;justify-content:center">${I.back}</button>
      <div style=${`flex:1;display:grid;grid-template-columns:repeat(${N},minmax(0,1fr));gap:5px`}>${Array.from({ length: N }, (_, i) => html`<span style=${`height:6px;border-radius:9px;background:${i <= step ? '#C8F542' : '#24272A'}`}></span>`)}</div>
    </div>
    <div class="scr" style="position:relative;flex:1;padding:4px 18px 20px">
      <div class="row" style="align-items:flex-end;margin-bottom:4px"><span class="dg outline" style="font-size:60px;line-height:.95">0${step + 1}</span><span class="lbl" style="padding-bottom:9px">${s.edit ? 'Изменение профиля' : 'Настройка профиля'} · 0${step + 1}/0${N}</span></div>

      ${step === 0 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Создай своего героя</h2>
        <p class="mu" style="margin:6px 0 10px">Он будет меняться вместе с тобой: становиться спортивнее, увереннее и красивее.</p>
        <div class="g2">${[['f', 'Девушка'], ['m', 'Парень']].map(([g, n]) => html`<button class=${'chip' + (s.av.g === g ? ' on' : '')} style="min-height:50px;border-radius:16px;font-size:15px" onClick=${() => { setAv({ g, top: 'tee', bottom: 'joggers' }); set({ sex: g === 'f' ? 1 : 0 }); }}>${n}</button>`)}</div>
        <div style="display:flex;justify-content:center;margin:6px 0"><${Avatar} a=${s.av} body=${body} w=${200} cls="idle" /></div>
        <label class="field">Имя героя<input class="inp" maxlength="16" value=${s.av.name} onInput=${(e) => setAv({ name: e.target.value.slice(0, 16) })} placeholder=${s.av.g === 'f' ? 'Например, Ника' : 'Например, Макс'} /></label>
        <${Looks} s=${s} setAv=${setAv} />
      ` : null}

      ${step === 1 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Какая у тебя цель?</h2>
        <p class="mu" style="margin:6px 0 16px">Подстроим питание и нагрузку. Цель можно поменять в любой момент.</p>
        <div class="col">${GOALS.map((g, i) => html`<button class=${'opt' + (s.goal === i ? ' on' : '')} onClick=${() => pick('goal', i)}><span class="num">0${i + 1}</span><span style="display:flex;flex-direction:column"><span class="b" style="font-size:16px">${g.n}</span><span class="sub">${g.s}</span></span></button>`)}</div>
        ${s.goal === 2 ? html`<div class="card tight mt sm mu pop"><b style="color:#F5F6F2">Рекомпозиция</b> — небольшой дефицит калорий, много белка и силовые тренировки. Вес может меняться медленно, зато уходит жир и растут мышцы. Лучше всего видно по замерам и фото.</div>` : null}
      ` : null}

      ${step === 2 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Исходные данные</h2>
        <p class="mu" style="margin:6px 0 16px">По ним считаем норму калорий и БЖУ, а ещё — фигуру героя.</p>
        <div class="g2">
          <label class="field">Возраст<input class="inp" inputmode="numeric" value=${s.age} onInput=${numIn('age')} placeholder="28" /></label>
          <label class="field">Рост, см<input class="inp" inputmode="numeric" value=${s.h} onInput=${numIn('h')} placeholder="170" /></label>
          <label class="field">Вес, кг<input class="inp" inputmode="decimal" value=${s.w} onInput=${numIn('w')} placeholder="70" /></label>
          <label class="field">Желаемый вес<input class="inp" inputmode="decimal" value=${s.tw} onInput=${numIn('tw')} placeholder="—" /></label>
        </div>
        <div class="lbl mt2" style="margin-bottom:8px">Пол — для формулы расчёта</div>
        <div class="g2">${['Мужской', 'Женский'].map((n, i) => html`<button class=${'chip' + (s.sex === i ? ' on' : '')} style="border-radius:16px;min-height:50px" onClick=${() => pick('sex', i)}>${n}</button>`)}</div>
        <div class="lbl mt2" style="margin-bottom:8px">Горизонт</div>
        <div class="g3">${['1 месяц', '3 месяца', '6 месяцев'].map((n, i) => html`<button class=${'chip' + (s.horizon === i ? ' on' : '')} style="border-radius:16px;min-height:50px" onClick=${() => pick('horizon', i)}>${n}</button>`)}</div>
        <div class="card tight mt sm mu row" style="align-items:flex-start"><span style="width:6px;align-self:stretch;flex:none;border-radius:9px;background:#4CC9F0"></span><span>${goalCheck}</span></div>
      ` : null}

      ${step === 3 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Образ жизни</h2>
        <p class="mu" style="margin:6px 0 16px">Активность влияет на суточный расход энергии.</p>
        <div class="col">${[['Низкая', 'В основном сижу'], ['Средняя', 'Регулярно двигаюсь'], ['Высокая', 'Много движения и тренировок']].map(([n, sub], i) => html`<button class=${'opt' + (s.act === i ? ' on' : '')} onClick=${() => pick('act', i)}><span class="num">0${i + 1}</span><span style="display:flex;flex-direction:column"><span class="b" style="font-size:16px">${n}</span><span class="sub">${sub}</span></span></button>`)}</div>
        <div class="lbl mt2" style="margin-bottom:8px">Тренировок в неделю</div>
        <div class="g4">${['0', '1–2', '3–4', '5+'].map((n, i) => html`<button class=${'chip' + (s.freq === i ? ' on' : '')} style="border-radius:16px;min-height:50px" onClick=${() => pick('freq', i)}>${n}</button>`)}</div>
      ` : null}

      ${step === 4 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Питание</h2>
        <p class="mu" style="margin:6px 0 16px">Меню соберём только из подходящих продуктов.</p>
        <div class="lbl" style="margin-bottom:8px">Приёмов пищи в день</div>
        <div class="g3">${[['2', 'приёма'], ['3', 'приёма'], ['4', 'с перекусом']].map(([n, sub], i) => html`<button class=${'chip' + (s.meals === i ? ' on' : '')} style="border-radius:18px;min-height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center" onClick=${() => pick('meals', i)}><span class="dg" style="font-size:22px">${n}</span><span class="xs b">${sub}</span></button>`)}</div>
        <${SplitToggle} s=${s} set=${set} />
        <div class="lbl mt2" style="margin-bottom:8px">Ограничения и аллергии</div>
        <div class="row" style="flex-wrap:wrap;gap:8px">${RESTR.map((n, i) => { const on = !!s.restr[i]; return html`<button class=${'chip' + (on ? ' on' : '')} onClick=${() => { const none = RESTR.length - 1; let r = { ...s.restr }; if (i === none) r = on ? {} : { [none]: true }; else { r[i] = !on; delete r[none]; } set({ restr: r }); }}>${n}</button>`; })}</div>
        <div class="lbl mt2" style="margin-bottom:8px">Время на готовку</div>
        <div class="g3">${['до 15 мин', '15–30', '30+ мин'].map((n, i) => html`<button class=${'chip' + (s.cook === i ? ' on' : '')} style="border-radius:16px;min-height:50px" onClick=${() => pick('cook', i)}>${n}</button>`)}</div>
      ` : null}

      ${step === 5 ? html`
        <h2 class="h1" style="font-size:25px;margin-top:6px">Твоя норма</h2>
        <p class="mu" style="margin:6px 0 14px">Формула Миффлина — Сан-Жеора с учётом активности и цели.</p>
        <div class="card lime">
          <div class="lbl" style="color:#0F1011">Ориентир на день</div>
          <div class="row" style="align-items:baseline;gap:8px;margin-top:4px"><span class="dg" style="font-size:50px;line-height:1">${fmtN(T.kcal)}</span><span class="b">ккал</span></div>
          <div class="g3 mt">${[['#FF7A45', T.p, 'белки, г'], ['#FFC93C', T.f, 'жиры, г'], ['#4CC9F0', T.c, 'углеводы, г']].map(([c, v, l]) => html`<div style="padding:10px;border-radius:14px;background:#0F1011;color:#F5F6F2"><div class="dg" style=${'font-size:18px;color:' + c}>${v}</div><div class="xs b">${l}</div></div>`)}</div>
          <div class="xs mt" style="font-weight:600">Базовый обмен ≈ ${fmtN(T.bmr)} ккал · расход ≈ ${fmtN(T.tdee)} ккал · вода ≈ ${fmtD(T.water)} л</div>
        </div>
        ${T.isDefault ? html`<div class="xs b mt0" style="color:#FFC93C">Поля на шаге 3 пустые — расчёт по примерным данным.</div>` : null}
        <div class="card tight mt">${[['Герой', (s.av.name || '—') + ' · размер ' + body.size], ['Цель', s.goal !== null ? GOALS[s.goal].n : '—'], ['Питание', ['2', '3', '4'][s.meals] + ' приёма' + (s.split ? ' · раздельное' : '')], ['Ограничения', RESTR.filter((n, i) => s.restr[i]).join(', ') || 'нет']].map(([k, v]) => html`<div class="between list-row" style="padding:9px 2px"><span class="mu sm">${k}</span><span class="sm b" style="text-align:right">${v}</span></div>`)}</div>
        <div class="card tight mt sm mu" style="border:1.5px dashed #2E3236;background:none">Норма не опускается ниже базового обмена. При заболеваниях, беременности или опыте РПП план согласует тренер.</div>
      ` : null}
      ${SIGN}
    </div>
    <div style="padding:10px 18px 20px"><button class=${'btn full ' + (canNext ? 'lime' : 's2')} style="height:58px;font-size:16px" onClick=${next}>${step === N - 1 ? (s.edit ? 'Сохранить изменения' : 'Создать мой план') : step === 0 && !s.av.name.trim() ? 'Придумай имя герою' : step === 1 && s.goal === null ? 'Выбери цель' : 'Продолжить'}</button></div>
  </div>`;
}

function SplitToggle({ s, set }) {
  return html`<button class="card tight mt2" style=${'width:100%;text-align:left;display:flex;gap:12px;align-items:flex-start;' + (s.split ? 'outline:2px solid #C8F542' : '')} onClick=${() => set({ split: !s.split })}>
    <span style=${`width:46px;height:28px;flex:none;border-radius:999px;background:${s.split ? '#C8F542' : '#2E3236'};position:relative;transition:background .2s`}><span style=${`position:absolute;top:3px;left:${s.split ? 21 : 3}px;width:22px;height:22px;border-radius:50%;background:${s.split ? '#0F1011' : '#9EA3A8'};transition:left .2s`}></span></span>
    <span><span class="b" style="font-size:15px">Раздельное питание по Неумывакину</span><br/><span class="sm mu">Белковые и углеводные продукты — в разные приёмы пищи, фрукты — отдельно. Меню соберётся по этому принципу.</span></span>
  </button>`;
}

function Looks({ s, setAv }) {
  const a = s.av;
  return html`<div>
    <div class="lbl mt2" style="margin-bottom:8px">Причёска</div>
    <div class="g4">${AV.hair[a.g].map((n, i) => html`<button class=${'chip' + (a.hair === i ? ' on' : '')} style="border-radius:14px;padding:8px 4px;font-size:12px;min-height:46px" onClick=${() => setAv({ hair: i })}>${n}</button>`)}</div>
    <div class="lbl mt2" style="margin-bottom:8px">Цвет волос</div>
    <div class="row" style="flex-wrap:wrap;gap:8px">${AV.hairColors.map((h, i) => html`<button aria-label=${h.n} class=${'swatch' + (a.hc === i ? ' on' : '')} style=${'background:' + h.c} onClick=${() => setAv({ hc: i })}></button>`)}</div>
    <div class="lbl mt2" style="margin-bottom:8px">Тон кожи</div>
    <div class="row" style="flex-wrap:wrap;gap:8px">${AV.skins.map((c, i) => html`<button aria-label=${'Тон ' + (i + 1)} class=${'swatch' + (a.skin === i ? ' on' : '')} style=${'background:' + c} onClick=${() => setAv({ skin: i })}></button>`)}</div>
  </div>`;
}

function Loading({ s, body }) {
  return html`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;background:#C8F542;color:#0F1011">
    <div class="pop"><${Avatar} a=${s.av} body=${body} w=${170} cls="idle" bare=${true} /></div>
    <div class="dg" style="display:flex;flex-direction:column;gap:8px;text-align:center;font-size:20px;line-height:1.2">
      <div class="f1">Анализируем параметры.</div><div class="f2">Формируем стратегию.</div><div class="f3">${s.av.name || 'Герой'} готов${s.av.g === 'f' ? 'а' : ''} к старту!</div>
    </div>
    <div class="lbl" style="position:absolute;bottom:26px;color:#0F1011;font-size:10px;letter-spacing:.18em">Разработка Александра Гурлени</div>
  </div>`;
}

// ===== Основная часть с вкладками =====
function Main(ctx) {
  const { s, set } = ctx;
  const go = (tab) => set({ tab });
  const tabs = [['home', 'Сегодня', I.home], ['food', 'Питание', I.food], ['hero', '', null], ['act', 'Активность', I.act], ['prog', 'Прогресс', I.prog]];
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [s.tab]);
  let body;
  if (s.tab === 'food') body = html`<${Food} ...${ctx} />`;
  else if (s.tab === 'hero') body = html`<${Hero} ...${ctx} />`;
  else if (s.tab === 'act') body = html`<${Activity} ...${ctx} />`;
  else if (s.tab === 'prog') body = html`<${Progress} ...${ctx} />`;
  else if (s.tab === 'planb') body = html`<${PlanB} ...${ctx} />`;
  else body = html`<${Home} ...${ctx} />`;
  return html`<div style="position:absolute;inset:0">
    <div class="scr" ref=${ref}>${body}${SIGN}</div>
    <nav class="nav">${tabs.map(([id, n, ic]) => id === 'hero'
      ? html`<button class=${'hero' + (s.tab === 'hero' ? ' on' : '')} aria-label="Герой" onClick=${() => go('hero')}><div style="position:absolute;left:50%;top:-4px;transform:translateX(-50%);width:84px"><${Avatar} a=${s.av} body=${ctx.body} w=${84} bare=${true} /></div></button>`
      : html`<button class=${s.tab === id ? 'on' : ''} onClick=${() => go(id)}>${ic}${n}</button>`)}</nav>
  </div>`;
}

function TopBar({ s, set, lv, body }) {
  return html`<div class="between">
    <button class="row" style="gap:10px;text-align:left" onClick=${() => set({ tab: 'hero' })}>
      <span style="width:46px;height:46px;border-radius:16px;background:#1A1C1E;overflow:hidden;display:block;position:relative"><span style="position:absolute;left:-10px;top:-4px;width:66px"><${Avatar} a=${s.av} body=${body} w=${66} bare=${true} /></span></span>
      <span style="display:flex;flex-direction:column"><span class="b" style="font-size:15px">${s.av.name || 'Герой'}</span><span class="xs b" style="color:#C8F542">Ур. ${lv.lvl + 1} · ${lv.name}</span></span>
    </button>
    <span class="pill">${I.coin}${fmtN(s.game.coins)}</span>
  </div>`;
}

function dayTotals(s, T) {
  const today = dayPlan(s, T, wdOf(new Date()));
  const planned = sumR(today.filter((x) => s.eaten[x.key]).map((x) => x.r));
  const diary = sumR((s.diary[todayISO()] || []));
  return { today, planned, diary, all: { k: planned.k + diary.k, p: planned.p + diary.p, f: planned.f + diary.f, c: planned.c + diary.c } };
}
const macroRows = (v, t) => [
  { l: 'Белки', c: '#FF7A45', v: Math.round(v.p), t: t.p }, { l: 'Жиры', c: '#FFC93C', v: Math.round(v.f), t: t.f }, { l: 'Углеводы', c: '#4CC9F0', v: Math.round(v.c), t: t.c || 1 }
].map((m) => ({ ...m, pct: Math.min(100, Math.round(m.v / m.t * 100)) }));

function Home(ctx) {
  const { s, set, T, lv, body, award, open, say } = ctx;
  const d = todayISO();
  const { today, all } = dayTotals(s, T);
  const C = 2 * Math.PI * 56, left = T.kcal - all.k;
  const al = s.actLog[d] || { steps: 0, w: [] };
  const burned = stepsKcal(al.steps || 0, curWeight(s)) + (al.w || []).reduce((a, x) => a + x.kcal, 0);
  const eatenN = today.filter((x) => s.eaten[x.key]).length;
  const planned = [1, 3, 6].includes(wdOf(new Date()));
  const trDone = !!s.trDone[d];
  const tasks = [
    { t: 'Питание по плану', sub: `${eatenN} из ${today.length} приёмов`, done: eatenN === today.length, go: () => set({ tab: 'food' }), cta: 'Меню', c: '#FFC93C', xp: '+10 XP за приём' },
    { t: 'Тренировка', sub: trDone ? 'Сделано' : planned ? 'По программе тренера' : 'Сегодня отдых — можно прогулку', done: trDone, go: () => { if (!trDone) { set({ trDone: { ...s.trDone, [d]: true } }); award('train', d); } else set({ tab: 'act' }); }, cta: 'Отметить', c: '#FF7A45', xp: '+50 XP' },
    { t: 'Шаги', sub: `${fmtN(al.steps || 0)} из ${fmtN(STEP_GOAL)}`, done: (al.steps || 0) >= STEP_GOAL, go: () => set({ tab: 'act' }), cta: 'Внести', c: '#C8F542', xp: '+40 XP' },
    { t: 'Вечерний чек-ин', sub: s.checkin ? 'Сохранён' : 'Самочувствие и сон', done: s.checkin, go: () => open('checkin'), cta: 'Открыть', c: '#4CC9F0', xp: '+20 XP' }
  ];
  return html`<div>
    <${TopBar} ...${ctx} />
    <h1 class="h1" style="margin:16px 0 2px;font-size:30px">${HELLO}<br/><span style="color:#C8F542">Работаем.</span></h1>
    <p class="mu" style="margin:6px 0 14px">${WD[wdOf(new Date())]} · ${new Date().getDate()} ${MG[new Date().getMonth()]}</p>
    ${s.planB ? html`<div class="card tight org pop between" style="margin-bottom:12px"><div><div class="lbl" style="color:#0F1011">Активен План Б</div><div class="b">${s.planB}</div></div><button class="btn small dark" style="color:#F5F6F2" onClick=${() => { set({ planB: null }); say('Вернулись к основному плану'); }}>Отменить</button></div>` : null}

    <button class="card" style="width:100%;display:flex;align-items:center;gap:16px;text-align:left" onClick=${() => set({ tab: 'food' })}>
      <span style="position:relative;width:128px;height:128px;flex:none">
        <svg width="128" height="128" viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="56" fill="none" stroke="#2A2D30" stroke-width="12"/><circle class="ring" cx="66" cy="66" r="56" fill="none" stroke=${left >= 0 ? '#C8F542' : '#FF7A45'} stroke-width="12" stroke-linecap="round" stroke-dasharray=${(Math.min(1, all.k / T.kcal) * C).toFixed(1) + ' ' + C.toFixed(1)} transform="rotate(-90 66 66)"/></svg>
        <span style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span class="dg" style="font-size:25px;line-height:1">${fmtN(Math.abs(left))}</span><span class="xs mu b">${left >= 0 ? 'ккал осталось' : 'ккал сверх'}</span></span>
      </span>
      <span style="flex:1;display:flex;flex-direction:column;gap:9px;min-width:0">
        <span class="lbl">Съедено ${fmtN(all.k)} / ${fmtN(T.kcal)}</span>
        ${macroRows(all, T).map((m) => html`<span style="display:flex;flex-direction:column;gap:4px"><span class="between xs b"><span style=${'color:' + m.c}>${m.l}</span><span>${m.v}<span style="color:#6F757B"> / ${m.t} г</span></span></span><span class="bar" style="height:6px"><i style=${`width:${m.pct}%;background:${m.c}`}></i></span></span>`)}
      </span>
    </button>

    <button class="card lime mt" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px;padding:12px 16px" onClick=${() => set({ tab: 'hero' })}>
      <span style="width:70px;flex:none;margin:-14px 0 -18px"><${Avatar} a=${s.av} body=${body} w=${70} bare=${true} /></span>
      <span style="flex:1;min-width:0"><span class="lbl" style="color:#0F1011">Уровень ${lv.lvl + 1} · ${lv.name}</span>
        <span class="b" style="display:block;font-size:15px;margin:2px 0 6px">${lv.next ? `До следующего уровня ${fmtN(lv.next - s.game.xp)} XP` : 'Максимальный уровень!'}</span>
        <span class="bar" style="background:rgba(15,16,17,.15);height:8px;display:block"><i style=${`width:${lv.pct}%;background:#0F1011`}></i></span></span>
    </button>

    <div class="between" style="margin:22px 2px 10px"><h2 class="h2">Задачи на сегодня</h2><span class="dg" style="color:#C8F542">${tasks.filter((t) => t.done).length}/${tasks.length}</span></div>
    <div class="col" style="gap:8px">${tasks.map((t, i) => html`<button class="card tight" style=${'display:flex;align-items:center;gap:12px;text-align:left;width:100%;' + (t.done ? 'opacity:.7' : '')} onClick=${t.go}>
      <span style=${`width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;background:${t.done ? '#C8F542' : '#24272A'}`}>${t.done ? I.check() : html`<span class="dg" style=${'font-size:13px;color:' + t.c}>0${i + 1}</span>`}</span>
      <span style="flex:1;min-width:0;display:flex;flex-direction:column"><span class="b">${t.t}</span><span class="sm mu">${t.sub}</span></span>
      ${t.done ? null : html`<span style="display:flex;flex-direction:column;align-items:flex-end"><span class="xs b" style=${'color:' + t.c}>${t.cta}</span><span class="xs mu" style="font-size:10px">${t.xp}</span></span>`}
    </button>`)}</div>

    <div class="g2 mt">
      <button class="card tight" style="text-align:left" onClick=${() => set({ tab: 'act' })}><div class="row" style="gap:6px">${I.steps}<span class="lbl">Шаги</span></div><div class="dg mt0" style="font-size:22px">${fmtN(al.steps || 0)}</div><div class="bar mt0" style="height:6px"><i style=${`width:${Math.min(100, (al.steps || 0) / STEP_GOAL * 100)}%;background:#C8F542`}></i></div></button>
      <button class="card tight" style="text-align:left" onClick=${() => set({ tab: 'act' })}><div class="row" style="gap:6px">${I.fire}<span class="lbl">Сожжено</span></div><div class="dg mt0" style="font-size:22px">${fmtN(burned)}<span class="sm mu b"> ккал</span></div><div class="xs mu">шаги + тренировки</div></button>
    </div>

    <div class="card tight mt">
      <div class="between"><span class="lbl">Вода</span><span class="sm b"><span class="dg" style="color:#4CC9F0">${fmtD(s.water * 0.25, 2)}</span> / ${fmtD(T.water)} л</span></div>
      <div style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;margin-top:10px">${Array.from({ length: 8 }, (_, i) => { const on = i < s.water; return html`<button aria-label=${'Стакан ' + (i + 1)} style=${`height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${on ? 'rgba(76,201,240,.18)' : '#24272A'}`} onClick=${() => { const nw = s.water === i + 1 ? i : i + 1; set({ water: nw }); if (nw > s.water) award('water', String(nw)); }}><svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1C8 1 2 8 2 12.5a6 6 0 0 0 12 0C14 8 8 1 8 1z" fill=${on ? '#4CC9F0' : 'none'} stroke=${on ? '#4CC9F0' : '#4A4F54'} stroke-width="1.6"/></svg></button>`; })}</div>
    </div>

    <div class="g2 mt">
      <button class="card tight org" style="text-align:left;min-height:96px;display:flex;flex-direction:column;justify-content:space-between" onClick=${() => set({ tab: 'planb' })}><span class="dg" style="font-size:22px">План Б</span><span class="xs b">День пошёл не по плану?</span></button>
      <button class="card tight light" style="text-align:left;min-height:96px;display:flex;flex-direction:column;justify-content:space-between" onClick=${() => open('coach')}><span class="dg" style="font-size:22px">Тренер</span><span class="xs b">Написать Александру</span></button>
    </div>
  </div>`;
}

// ===== Питание =====
function Food(ctx) {
  const { s, set, T, open, award } = ctx;
  const ti = wdOf(new Date());
  const sel = s.day ?? ti;
  const now = new Date();
  const wd = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - ti + i));
  const plan = dayPlan(s, T, sel);
  const tot = sumR(plan.map((x) => x.r));
  const diff = tot.k - T.kcal;
  const d = todayISO();
  const diary = s.diary[d] || [];
  const dsum = sumR(diary);
  return html`<div>
    <div class="between"><h1 class="h1">Питание</h1><button class="btn small s2" onClick=${() => open('shop')}>${I.cart}Покупки</button></div>
    <button class="card tight mt row" style=${'width:100%;text-align:left;' + (s.split ? 'outline:2px solid #C8F542' : '')} onClick=${() => set({ split: !s.split, over: {} })}>
      <span style=${`width:42px;height:26px;flex:none;border-radius:999px;background:${s.split ? '#C8F542' : '#2E3236'};position:relative`}><span style=${`position:absolute;top:3px;left:${s.split ? 19 : 3}px;width:20px;height:20px;border-radius:50%;background:${s.split ? '#0F1011' : '#9EA3A8'};transition:left .2s`}></span></span>
      <span style="flex:1"><span class="b">Раздельное питание</span><span class="xs mu" style="display:block">${s.split ? 'Включено: белки и углеводы — в разные приёмы' : 'По Неумывакину — нажми, чтобы включить'}</span></span>
    </button>
    ${s.split ? html`<div class="card tight mt sm" style="background:linear-gradient(135deg,rgba(255,122,69,.16),rgba(76,201,240,.16))">
      <div class="b" style="margin-bottom:6px">Правила раздельного питания</div>
      <div class="col" style="gap:6px">
        <div class="row" style="align-items:flex-start"><span class="tag" style="background:#FF7A45">Б</span><span>Мясо, рыба, яйца, творог — с некрахмалистыми овощами, без круп, хлеба и картофеля.</span></div>
        <div class="row" style="align-items:flex-start"><span class="tag" style="background:#4CC9F0">У</span><span>Крупы, хлеб, картофель — с овощами и маслом, без мяса и рыбы.</span></div>
        <div class="row" style="align-items:flex-start"><span class="tag" style="background:#FF7EB6">Ф</span><span>Фрукты — отдельно: за 30 минут до еды или через 2 часа после.</span></div>
        <div class="row" style="align-items:flex-start"><span class="tag" style="background:#C8F542">Ч</span><span>Между белковым и углеводным приёмом — 2–3 часа.</span></div>
      </div>
      <div class="xs mu mt0">Это авторская система питания; при хронических заболеваниях согласуй её с врачом или тренером.</div>
    </div>` : null}

    <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin-top:12px">${wd.map((dt, i) => html`<button style=${`min-height:58px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;font-weight:800;background:${sel === i ? '#C8F542' : '#1A1C1E'};color:${sel === i ? '#0F1011' : i === ti ? '#C8F542' : '#F5F6F2'}`} onClick=${() => set({ day: i })}><span>${WD[i]}</span><span class="dg" style="font-size:17px">${dt.getDate()}</span></button>`)}</div>

    <div class="card mt">
      <div class="between" style="align-items:flex-end"><div><div class="lbl">План дня · ${WDF[sel]}</div><div style="margin-top:4px"><span class="dg" style="font-size:28px">${fmtN(tot.k)}</span><span class="b mu"> / ${fmtN(T.kcal)} ккал</span></div></div>
        <span class="pill" style="background:rgba(200,245,66,.14);color:#C8F542">${Math.abs(diff) <= T.kcal * 0.05 ? 'в норме' : (diff > 0 ? '+' : '−') + fmtN(Math.abs(diff)) + ' ккал'}</span></div>
      <div class="col mt" style="gap:9px">${macroRows(tot, T).map((m) => html`<div class="row"><span class="xs b" style=${'width:70px;color:' + m.c}>${m.l}</span><span class="bar" style="flex:1"><i style=${`width:${m.pct}%;background:${m.c}`}></i></span><span class="xs b" style="width:76px;text-align:right">${m.v}<span style="color:#6F757B"> / ${m.t} г</span></span></div>`)}</div>
      <div class="xs mu mt0">Порции рассчитаны под твою норму, мясо и крупы — в сыром весе.</div>
    </div>

    <div class="col mt">${plan.map((x) => {
      const r = x.r, on = !!s.eaten[x.key], dn = donut(r.p, r.f, r.c);
      const kind = r.kind ? KIND[r.kind] : null;
      return html`<div class="card" style="padding:0;overflow:hidden">
        <div style=${'height:6px;background:' + x.color}></div>
        <div class="row" style="padding:14px 14px 10px;gap:14px;align-items:flex-start">
          <span style="position:relative;width:80px;height:80px;flex:none"><svg width="80" height="80" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="#24272A" stroke-width="10"/>${dn.map((o, j) => html`<circle cx="42" cy="42" r="34" fill="none" stroke=${['#FF7A45', '#FFC93C', '#4CC9F0'][j]} stroke-width="10" stroke-dasharray=${o.da} stroke-dashoffset=${o.off} transform="rotate(-90 42 42)"/>`)}</svg>
            <span style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span class="dg" style="font-size:16px;line-height:1">${r.k}</span><span class="xs mu b" style="font-size:10px">ккал</span></span></span>
          <div style="min-width:0;flex:1">
            <div class="row" style="gap:6px;flex-wrap:wrap"><span class="tag" style=${'background:' + x.color}>${x.type}</span>${kind ? html`<span class="tag" style=${'background:' + kind.c}>${kind.n}</span>` : null}<span class="xs mu b">${x.time} · ${r.m} мин</span></div>
            <div class="b" style="font-size:16px;line-height:1.25;margin-top:6px">${r.n}</div>
            <div class="xs mu" style="margin-top:3px">${recipeShort(r)}</div>
          </div>
        </div>
        <div class="g3" style="padding:0 14px;gap:6px">${[['Б', '#FF7A45', r.p], ['Ж', '#FFC93C', r.f], ['У', '#4CC9F0', r.c]].map(([l, c, v]) => html`<span style="padding:7px 0;border-radius:12px;background:#121314;text-align:center;font-size:12px;font-weight:800"><span style=${'color:' + c}>${l}</span> ${v} г</span>`)}</div>
        <div class="row" style="padding:12px 14px 14px;gap:8px">
          <button class="btn small" style=${'flex:1.3;' + (on ? 'background:#C8F542;color:#0F1011' : 'border:1.5px solid #2E3236')} onClick=${() => { set({ eaten: { ...s.eaten, [x.key]: !on } }); if (!on && sel === ti) award('meal', x.key); }}>${on ? 'Съедено' : 'Отметить'}</button>
          <button class="btn small s2" style="flex:1" onClick=${() => open('recipe', { key: x.key })}>Рецепт</button>
          <button class="btn small s2" style="flex:1" onClick=${() => open('swap', { key: x.key })}>Заменить</button>
        </div>
      </div>`;
    })}</div>

    <div class="between" style="margin:24px 2px 10px"><h2 class="h2">Мой дневник</h2><span class="sm b mu">сегодня · ${fmtN(dsum.k)} ккал</span></div>
    <div class="g2">
      <button class="card tight lime" style="text-align:left;min-height:96px;display:flex;flex-direction:column;justify-content:space-between" onClick=${() => open('food', { mode: 'raw' })}><span class="row" style="gap:6px">${I.plus}<span class="b">Продукт</span></span><span class="xs b">Мясо и крупы — в сыром виде, овощи — по факту</span></button>
      <button class="card tight" style="text-align:left;min-height:96px;display:flex;flex-direction:column;justify-content:space-between;background:#4CC9F0;color:#0F1011" onClick=${() => open('food', { mode: 'cooked' })}><span class="row" style="gap:6px">${I.plus}<span class="b">Готовое блюдо</span></span><span class="xs b">Суп, плов, пицца, гарнир…</span></button>
    </div>
    ${diary.length ? html`<div class="card tight mt">${['b', 'l', 's', 'd'].map((m) => { const items = diary.filter((x) => x.meal === m); if (!items.length) return null; const mixed = s.split && items.some((x) => x.grp === 'P') && items.some((x) => x.grp === 'C'); return html`<div style="margin-bottom:6px">
        <div class="between" style="margin:6px 0 2px"><span class="tag" style=${'background:' + SLOT_COLOR[m]}>${SLOT_TYPE[m]}</span><span class="xs mu b">${fmtN(sumR(items).k)} ккал</span></div>
        ${mixed ? html`<div class="xs b" style="color:#FF7A45;margin:4px 0">Здесь смешаны белки и углеводы — в раздельном питании их лучше разнести по разным приёмам.</div>` : null}
        ${items.map((x) => html`<div class="list-row"><span style="flex:1;min-width:0"><span class="b sm" style="display:block">${x.name}</span><span class="xs mu">${x.g} г${x.cooked ? ' · готовое' : ''} · Б ${fmtD(x.p)} · Ж ${fmtD(x.f)} · У ${fmtD(x.c)}</span></span><span class="b sm">${x.k}</span>
          <button aria-label="Удалить" style="width:36px;height:36px;border-radius:12px;background:#24272A;display:flex;align-items:center;justify-content:center;color:#9EA3A8" onClick=${() => set({ diary: { ...s.diary, [d]: diary.filter((y) => y.id !== x.id) } })}>${I.x}</button></div>`)}
      </div>`; })}</div>` : html`<div class="card tight mt sm mu">Съел(а) что-то вне плана? Добавь — калории и БЖУ посчитаются сразу и попадут в итог дня.</div>`}
  </div>`;
}

// ===== План Б =====
function PlanB({ s, set, say }) {
  const [sc, setSc] = useState(null);
  const scens = [
    { l: 'Нет времени', sub: 'Быстрые блюда до 15 минут', head: 'Упростим день, не меняя курс.', steps: ['Обед → блюдо до 15 минут: паста с тунцом или омлет с овощами.', 'Ужин → творог с овощами или яйца с салатом.', 'Тренировку можно перенести — отметь, когда сделаешь.'] },
    { l: 'Нет продуктов', sub: 'Из того, что есть дома', head: 'Соберём меню из того, что есть.', steps: ['Обед → гречка, яйца и любые овощи из холодильника.', 'Ужин → яйца, картофель и овощи.', 'Недостающее — в список покупок.'] },
    { l: 'Ем вне дома', sub: 'Как выбрать в кафе', head: 'Встреча с друзьями — часть жизни, а не срыв.', steps: ['До встречи — перекус с белком, чтобы не прийти голодным.', 'В кафе — белок, овощи и гарнир: рыба или курица с салатом.', 'Десерт и напитки — по ситуации, без чувства вины.', 'Завтра — обычный план, без урезания еды.'] },
    { l: 'Нет сил', sub: 'Бережный режим', head: 'Сегодня бережный режим.', steps: ['Тренировка → спокойная прогулка или отдых.', 'Питание без изменений: еда помогает восстановиться.', 'Если слабость держится несколько дней — напиши тренеру или обратись к врачу.'] }
  ];
  const c = sc !== null ? scens[sc] : null;
  return html`<div>
    <div class="card org" style="position:relative;overflow:hidden"><span class="dg" style="position:absolute;right:-8px;top:-26px;font-size:140px;line-height:1;color:rgba(15,16,17,.1)">Б</span>
      <div class="lbl" style="color:#0F1011">План Б</div><h1 class="h1" style="margin:8px 0 6px;font-size:30px">Что<br/>изменилось?</h1><p class="sm b" style="margin:0;max-width:250px">Один сложный день не отменяет программу.</p></div>
    <div class="g2 mt">${scens.map((x, i) => html`<button class="card tight" style=${'text-align:left;min-height:118px;display:flex;flex-direction:column;justify-content:space-between;' + (sc === i ? 'background:#F5F6F2;color:#0F1011' : '')} onClick=${() => setSc(sc === i ? null : i)}><span class="dg" style="color:#FF7A45">0${i + 1}</span><span><span class="b" style="display:block;font-size:16px">${x.l}</span><span class="xs" style=${'color:' + (sc === i ? '#4A4D50' : '#9EA3A8')}>${x.sub}</span></span></button>`)}</div>
    ${c ? html`<div class="card light mt pop"><div class="lbl" style="color:#B2471B">План Б · ${c.l}</div><div class="h2" style="margin-top:6px">${c.head}</div>
      <div class="col mt" style="gap:9px">${c.steps.map((t, i) => html`<div class="row sm" style="align-items:flex-start;font-weight:600"><span class="dg" style="width:26px;height:26px;flex:none;border-radius:9px;background:#0F1011;color:#C8F542;font-size:12px;display:flex;align-items:center;justify-content:center">${i + 1}</span><span>${t}</span></div>`)}</div>
      <div class="xs mt" style="color:#4A4D50;font-weight:600">Без компенсации голоданием, лишней нагрузкой или урезанием еды на завтра.</div>
      <button class="btn dark full mt" onClick=${() => { set({ planB: c.l, tab: 'home' }); say('План Б применён к сегодняшнему дню'); }}>Применить к сегодня</button></div>` : null}
    <button class="btn s2 full mt" onClick=${() => set({ tab: 'home' })}>${I.back}На главную</button>
  </div>`;
}

// ===== Герой (игровой экран) =====
function Hero(ctx) {
  const { s, set, lv, body, open, say } = ctx;
  const [parts, setParts] = useState([]);
  const [hit, setHit] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 3000); return () => clearInterval(t); }, []);
  const en = energyNow(s.game);
  const perTap = 1 + Math.floor(lv.lvl / 2);
  const d = todayISO();
  const yest = (() => { const n = new Date(); return iso(n.getFullYear(), n.getMonth(), n.getDate() - 1); })();
  const bonusReady = s.game.bonusDay !== d;
  const nextStreak = s.game.bonusDay === yest ? Math.min((s.game.streak || 0) + 1, 7) : 1;
  const tap = (e) => {
    if (en <= 0) { say('Энергия закончилась — герой отдыхает. Она восстановится сама'); return; }
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || r.left + r.width / 2) - r.left, y = (e.clientY || r.top + r.height / 2) - r.top;
    const id = Math.random();
    setParts((p) => [...p.slice(-12), { id, x, y, v: perTap }]);
    setTimeout(() => setParts((p) => p.filter((q) => q.id !== id)), 900);
    setHit(true); setTimeout(() => setHit(false), 90);
    if (tg && tg.HapticFeedback) try { tg.HapticFeedback.impactOccurred('light'); } catch (er) {}
    set((p) => ({ game: { ...p.game, coins: p.game.coins + perTap, energy: energyNow(p.game) - 1, ets: Date.now(), taps: (p.game.taps || 0) + 1 } }));
  };
  const nextItems = Object.values(AV.items).flat().filter((it) => it.lvl === lv.lvl + 1 && (!it.g || it.g === s.av.g));
  return html`<div>
    <div class="between">
      <div><div class="lbl">Твой герой</div><div class="h1" style="font-size:26px">${s.av.name || 'Герой'}</div></div>
      <span class="pill" style="font-size:16px;padding:9px 13px">${I.coin}<span class="dg">${fmtN(s.game.coins)}</span></span>
    </div>
    <div class="card tight mt" style="padding:12px 14px">
      <div class="between"><span class="b">Ур. ${lv.lvl + 1} · ${lv.name}</span><span class="xs b mu">${lv.next ? fmtN(s.game.xp) + ' / ' + fmtN(lv.next) + ' XP' : fmtN(s.game.xp) + ' XP'}</span></div>
      <div class="bar mt0" style="height:10px"><i style=${`width:${lv.pct}%;background:linear-gradient(90deg,#C8F542,#FFC93C)`}></i></div>
    </div>

    ${!s.av.name ? html`<button class="card tight lime mt" style="width:100%;text-align:left" onClick=${() => open('looks')}><span class="b">Дай герою имя и выбери внешность →</span></button>` : null}
    <div class="tapzone mt ${hit ? 'hit' : ''}" onClick=${tap} role="button" aria-label="Погладить героя">
      <${Avatar} a=${s.av} body=${body} w=${270} cls="idle" />
      ${parts.map((p) => html`<span class="particle" key=${p.id} style=${`left:${p.x}px;top:${p.y - 20}px;transform:translateX(-50%)`}>+${p.v}</span>`)}
    </div>
    <div class="between" style="margin-top:-6px">
      <span class="pill">${I.bolt}${en} / ${ENERGY_MAX}</span>
      <span class="pill">Размер <b style="color:#C8F542">${body.size}</b></span>
      <span class="pill">+${perTap} ${I.coin} за тап</span>
    </div>
    <p class="xs mu" style="text-align:center;margin:8px 0 0">Тапай героя, чтобы собирать коины. Тело и лицо меняются только от реального прогресса.</p>

    ${bonusReady ? html`<button class="card tight lime mt pop" style="width:100%;display:flex;align-items:center;justify-content:space-between;text-align:left" onClick=${() => { const c = 50 * nextStreak; set((p) => ({ game: { ...p.game, coins: p.game.coins + c, bonusDay: d, streak: nextStreak } })); say(`Ежедневный бонус: +${c} коинов · серия ${nextStreak} дн.`); }}>
      <span><span class="lbl" style="color:#0F1011">Ежедневный бонус · день ${nextStreak}</span><span class="b" style="display:block;font-size:16px">Забрать +${50 * nextStreak} коинов</span></span>${I.coin}</button>` : null}

    <div class="g3 mt">
      <button class="card tight" style="text-align:center;padding:14px 6px" onClick=${() => open('wardrobe')}><div class="dg" style="font-size:15px">Гардероб</div><div class="xs mu">одежда по размеру</div></button>
      <button class="card tight" style="text-align:center;padding:14px 6px" onClick=${() => open('looks')}><div class="dg" style="font-size:15px">Внешность</div><div class="xs mu">имя, причёска</div></button>
      <button class="card tight" style="text-align:center;padding:14px 6px" onClick=${() => set({ screen: 'onb', step: 1, edit: true })}><div class="dg" style="font-size:15px">Цель</div><div class="xs mu">изменить</div></button>
    </div>

    <div class="card mt">
      <div class="h2">Как прокачать героя</div>
      <p class="sm mu" style="margin:6px 0 10px">XP дают только реальные действия. С каждым уровнем герой становится спортивнее, а лицо — счастливее. Фигура меняется вместе с твоим весом.</p>
      ${[['Приём пищи по плану', '+10 XP'], ['Запись в дневник', '+5 XP'], ['Тренировка', '+50 XP'], ['8 000 шагов', '+40 XP'], ['Активность записана', '+30 XP'], ['Вечерний чек-ин', '+20 XP'], ['Взвешивание', '+15 XP'], ['Стакан воды', '+2 XP']].map(([n, v]) => html`<div class="between list-row" style="padding:9px 0"><span class="sm">${n}</span><span class="sm b" style="color:#C8F542">${v}</span></div>`)}
    </div>
    ${nextItems.length ? html`<div class="card tight mt"><div class="lbl">На уровне ${lv.lvl + 2} откроется</div><div class="sm b mt0">${nextItems.map((x) => x.n).join(' · ')}</div></div>` : null}
  </div>`;
}

// ===== Активность =====
function Activity(ctx) {
  const { s, set, open, award } = ctx;
  const d = todayISO();
  const al = s.actLog[d] || { steps: 0, w: [] };
  const w = curWeight(s);
  const sk = stepsKcal(al.steps || 0, w);
  const wk = (al.w || []).reduce((a, x) => a + x.kcal, 0);
  const setSteps = (n) => {
    const v = Math.max(0, Math.min(100000, Math.round(n)));
    set({ actLog: { ...s.actLog, [d]: { ...al, steps: v } } });
    if (v >= STEP_GOAL) award('steps', d);
  };
  const C = 2 * Math.PI * 52;
  // календарь тренировок
  const now = new Date(), Y = now.getFullYear(), Mo = now.getMonth(), TODAY = now.getDate();
  const dim = new Date(Y, Mo + 1, 0).getDate();
  const planned = (dd) => [1, 3, 6].includes(wdOf(new Date(Y, Mo, dd)));
  const startKey = s.startDate || d;
  const cells = Array.from({ length: wdOf(new Date(Y, Mo, 1)) }, () => null);
  for (let dd = 1; dd <= dim; dd++) cells.push(dd);
  const doneMonth = Object.keys(s.trDone).filter((k) => k.startsWith(iso(Y, Mo, 1).slice(0, 8))).length;
  const todayDone = !!s.trDone[d];
  return html`<div>
    <h1 class="h1">Активность</h1>
    <div class="card mt">
      <div class="row" style="gap:16px">
        <span style="position:relative;width:120px;height:120px;flex:none"><svg width="120" height="120" viewBox="0 0 124 124" aria-hidden="true"><circle cx="62" cy="62" r="52" fill="none" stroke="#2A2D30" stroke-width="12"/><circle class="ring" cx="62" cy="62" r="52" fill="none" stroke="#C8F542" stroke-width="12" stroke-linecap="round" stroke-dasharray=${(Math.min(1, (al.steps || 0) / STEP_GOAL) * C).toFixed(1) + ' ' + C.toFixed(1)} transform="rotate(-90 62 62)"/></svg>
          <span style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">${I.steps}<span class="dg" style="font-size:20px">${fmtN(al.steps || 0)}</span><span class="xs mu b">из ${fmtN(STEP_GOAL)}</span></span></span>
        <div style="flex:1;min-width:0">
          <div class="lbl">Шаги сегодня</div>
          <input class="inp mt0" inputmode="numeric" aria-label="Шаги" value=${al.steps || ''} placeholder="0" onChange=${(e) => setSteps(num(e.target.value, 0))} />
          <div class="g3 mt0" style="gap:6px">${[1000, 2000, 5000].map((n) => html`<button class="chip" style="min-height:38px;padding:4px;font-size:12px;border-radius:12px;background:#24272A" onClick=${() => setSteps((al.steps || 0) + n)}>+${fmtN(n)}</button>`)}</div>
        </div>
      </div>
      <div class="xs mu mt">≈ ${fmtN(sk)} ккал за шаги. Цель — 8 000: за неё +40 XP.</div>
    </div>

    <div class="card mt">
      <div class="between"><div><div class="lbl">Тренировки и активность</div><div class="dg" style="font-size:26px;margin-top:2px">${fmtN(wk)} <span class="sm mu b">ккал</span></div></div>
        <button class="btn small lime" onClick=${() => open('workout')}>${I.plus}Добавить</button></div>
      ${(al.w || []).length ? html`<div class="mt0">${al.w.map((x, i) => html`<div class="list-row"><span style="flex:1"><span class="b sm" style="display:block">${x.n}</span><span class="xs mu">${x.min} мин · ${x.src === 'watch' ? 'из часов' : 'оценка'}</span></span><span class="b">${x.kcal} ккал</span>
        <button aria-label="Удалить" style="width:34px;height:34px;border-radius:11px;background:#24272A;display:flex;align-items:center;justify-content:center;color:#9EA3A8" onClick=${() => set({ actLog: { ...s.actLog, [d]: { ...al, w: al.w.filter((_, j) => j !== i) } } })}>${I.x}</button></div>`)}</div>` : html`<div class="sm mu mt0">Пока пусто. Добавь тренировку, пробежку или прогулку.</div>`}
      <div class="between card tight mt" style="background:#24272A"><span class="sm b">Всего сожжено сегодня</span><span class="dg" style="color:#FF7A45">${fmtN(sk + wk)} ккал</span></div>
    </div>

    <button class="card tight mt row" style="width:100%;text-align:left" onClick=${() => open('hints')}>
      <span style="width:40px;height:40px;flex:none;border-radius:13px;background:#4CC9F0;color:#0F1011;display:flex;align-items:center;justify-content:center">${I.info}</span>
      <span style="flex:1"><span class="b">Где взять шаги и калории?</span><span class="xs mu" style="display:block">Подсказки для iPhone, Android и часов</span></span>${I.arrow}
    </button>

    <div class="card mt">
      <div class="between"><span class="h2">${MN[Mo]}</span><span class="xs mu b">${doneMonth} тренировок</span></div>
      ${!todayDone ? html`<button class="btn lime full mt" onClick=${() => { set({ trDone: { ...s.trDone, [d]: true } }); award('train', d); }}>${I.check()}Тренировка сегодня сделана</button>` : html`<div class="card tight lime mt pop row"><span>${I.check()}</span><span class="b" style="flex:1">Сегодня сделано!</span><button class="btn small" style="background:rgba(15,16,17,.12);color:#0F1011" onClick=${() => { const t = { ...s.trDone }; delete t[d]; set({ trDone: t }); }}>Отменить</button></div>`}
      <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-top:14px;text-align:center" class="xs b mu">${WD.map((x) => html`<span>${x}</span>`)}</div>
      <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-top:8px">${cells.map((dd) => {
        if (!dd) return html`<span></span>`;
        const key = iso(Y, Mo, dd), done = !!s.trDone[key], pl = planned(dd), fut = dd > TODAY, isT = dd === TODAY;
        let st = done ? 'background:#C8F542;color:#0F1011' : pl && !fut && !isT && key >= startKey ? 'background:rgba(255,122,69,.18);color:#FF7A45;border:1.5px solid #FF7A45' : pl ? 'border:1.5px dashed #6F757B' : fut ? 'color:#4A4F54' : 'background:#24272A;color:#9EA3A8';
        if (isT && !done) st += ';box-shadow:inset 0 0 0 2px #C8F542';
        return html`<button disabled=${fut} aria-label=${dd + ' ' + MG[Mo]} style=${'height:40px;border-radius:12px;font-size:13px;font-weight:800;' + st} onClick=${() => { const t = { ...s.trDone }; if (done) delete t[key]; else t[key] = true; set({ trDone: t }); }}>${dd}</button>`;
      })}</div>
      <div class="row xs mu b mt" style="flex-wrap:wrap;gap:12px"><span class="row" style="gap:6px"><span style="width:14px;height:14px;border-radius:5px;background:#C8F542"></span>сделано</span><span class="row" style="gap:6px"><span style="width:14px;height:14px;border-radius:5px;border:1.5px dashed #6F757B"></span>по плану</span><span class="row" style="gap:6px"><span style="width:14px;height:14px;border-radius:5px;border:1.5px solid #FF7A45"></span>пропущено</span></div>
    </div>
  </div>`;
}

// ===== Прогресс =====
function Progress(ctx) {
  const { s, set, T, open, lv, body } = ctx;
  const ws = weightsSorted(s);
  const startW = num(s.w, ws.length ? ws[0][1] : 0);
  const cur = curWeight(s);
  const pts = ws.length ? ws : [[s.startDate || todayISO(), startW]];
  const vals = pts.map((x) => x[1]);
  const mx = Math.max(...vals) + 0.3, mn = Math.min(...vals) - 0.3;
  const P = pts.map((x, i) => [8 + (pts.length > 1 ? i * (310 / (pts.length - 1)) : 155), 8 + (mx - x[1]) / (mx - mn || 1) * 112]);
  const line = P.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const delta = cur - startW;
  const tw = num(s.tw, 0);
  const goalPct = tw && startW !== tw ? Math.max(0, Math.min(100, Math.round((startW - cur) / (startW - tw) * 100))) : null;
  const wd = weekDates();
  const trW = wd.filter((k) => s.trDone[k]).length;
  const stepsW = wd.map((k) => (s.actLog[k] || {}).steps || 0);
  const avgSteps = Math.round(stepsW.reduce((a, b) => a + b, 0) / Math.max(1, stepsW.filter((x) => x > 0).length || 1));
  const diaryDays = wd.filter((k) => (s.diary[k] || []).length).length;
  return html`<div>
    <h1 class="h1">Прогресс</h1>
    <div class="card mt">
      <div class="between" style="align-items:flex-end"><div><div class="lbl">Вес, кг</div><div class="dg" style="font-size:36px;margin-top:2px">${fmtD(cur)}</div></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">${ws.length > 1 ? html`<span class="pill" style="background:#C8F542;color:#0F1011">${delta <= 0 ? '−' : '+'}${fmtD(Math.abs(delta))} кг</span>` : null}<button class="btn small lime" onClick=${() => open('weight')}>${I.plus}Взвеситься</button></div></div>
      ${pts.length > 1 ? html`<svg width="100%" viewBox="0 0 326 128" role="img" aria-label="График веса" style="display:block;margin-top:14px">
        ${[8, 64, 120].map((y) => html`<line x1="0" y1=${y} x2="326" y2=${y} stroke="#24272A" />`)}
        <polygon points=${'8,120 ' + line + ' ' + P[P.length - 1][0].toFixed(1) + ',120'} fill="rgba(200,245,66,.1)" />
        <polyline points=${line} fill="none" stroke="#C8F542" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx=${P[P.length - 1][0]} cy=${P[P.length - 1][1]} r="6" fill="#0F1011" stroke="#C8F542" stroke-width="3" />
      </svg><div class="between xs mu b mt0"><span>${pts[0][0].slice(5).split('-').reverse().join('.')}</span><span>${pts[pts.length - 1][0].slice(5).split('-').reverse().join('.')}</span></div>`
      : html`<div class="sm mu mt">Взвешивайся раз в несколько дней утром натощак — здесь появится график. Смотри на тенденцию, а не на колебания одного дня.</div>`}
      ${goalPct !== null ? html`<div class="mt"><div class="between xs b"><span class="mu">К цели ${fmtD(tw)} кг</span><span style="color:#C8F542">${goalPct}%</span></div><div class="bar mt0"><i style=${`width:${goalPct}%;background:#C8F542`}></i></div></div>` : null}
    </div>

    <div class="g2 mt">
      <div class="card tight" style="background:#4CC9F0;color:#0F1011"><div class="lbl" style="color:#0F1011">Тренировки</div><div class="dg" style="font-size:26px;margin-top:4px">${trW}</div><div class="sm b">за эту неделю</div></div>
      <div class="card tight" style="background:#FF7A45;color:#0F1011"><div class="lbl" style="color:#0F1011">Шаги</div><div class="dg" style="font-size:26px;margin-top:4px">${fmtN(avgSteps)}</div><div class="sm b">в среднем в день</div></div>
      <div class="card tight" style="background:#9B8CFF;color:#0F1011"><div class="lbl" style="color:#0F1011">Размер одежды</div><div class="dg" style="font-size:26px;margin-top:4px">${body.size}</div><div class="sm b">ИМТ ≈ ${fmtD(body.bmi)}</div></div>
      <div class="card tight" style="background:#FFC93C;color:#0F1011"><div class="lbl" style="color:#0F1011">Герой</div><div class="dg" style="font-size:26px;margin-top:4px">${lv.lvl + 1}</div><div class="sm b">${lv.name}</div></div>
    </div>

    <div class="card lime mt">
      <div class="lbl" style="color:#0F1011">Неделя · итоги</div>
      <div class="col mt0 sm" style="gap:8px">
        <div><b>Тренировки:</b> ${trW} за неделю.</div>
        <div><b>Дневник питания:</b> записи в ${diaryDays} из 7 дней.</div>
        <div><b>Шаги:</b> ${avgSteps >= STEP_GOAL ? 'отлично, цель держится' : 'добавь короткие прогулки — цель 8 000 в день'}.</div>
        <div><b>Фокус:</b> ${trW >= 3 ? 'держим ритм и добавляем шаги.' : 'стабильность важнее идеала — начни с одной тренировки.'}</div>
      </div>
      <div class="lbl" style="color:#0F1011;opacity:.7;margin-top:12px;font-size:10px">Разработка Александра Гурлени</div>
    </div>

    <button class="card tight mt row" style="width:100%;text-align:left" onClick=${() => set({ screen: 'onb', step: 1, edit: true })}>
      <span style="flex:1"><span class="b">Изменить цель и данные</span><span class="xs mu" style="display:block">Сейчас: ${s.goal !== null ? GOALS[s.goal].n : '—'}</span></span>${I.arrow}</button>
    <button class="btn ghost full mt" onClick=${() => { if (confirmReset()) set(initState()); }}>Начать заново</button>
  </div>`;
}
let resetArmed = 0;
function confirmReset() { const n = Date.now(); if (n - resetArmed < 4000) return true; resetArmed = n; showHint('Нажми ещё раз, чтобы сбросить все данные'); return false; }
let showHint = () => {};

// ===== Нижние шторки =====
function Sheets(ctx) {
  const { ui, close } = ctx;
  const map = { recipe: RecipeSheet, swap: SwapSheet, shop: ShopSheet, checkin: CheckinSheet, coach: CoachSheet, food: FoodSheet, workout: WorkoutSheet, hints: HintsSheet, wardrobe: WardrobeSheet, looks: LooksSheet, weight: WeightSheet };
  const C = map[ui.sheet];
  return html`<div class="sheet-wrap"><button class="sheet-bg" aria-label="Закрыть" onClick=${close}></button><div class="sheet"><div class="grab"></div><button aria-label="Закрыть" onClick=${close} style="position:absolute;top:12px;right:14px;width:36px;height:36px;border-radius:12px;background:#24272A;color:#9EA3A8;display:flex;align-items:center;justify-content:center;z-index:2">${I.x}</button>${C ? html`<${C} ...${ctx} />` : null}</div></div>`;
}
const findSlot = (s, T, key) => { const ti = wdOf(new Date()); const sel = s.day ?? ti; return dayPlan(s, T, sel).find((x) => x.key === key) || dayPlan(s, T, sel)[0]; };

function RecipeSheet({ s, T, ui, open }) {
  const x = findSlot(s, T, ui.key), r = x.r;
  return html`<div>
    <div class="row" style="flex-wrap:wrap;gap:6px"><span class="tag" style=${'background:' + x.color}>${x.type} · ${x.time}</span>${r.kind ? html`<span class="tag" style=${'background:' + KIND[r.kind].c}>${KIND[r.kind].n}</span>` : null}</div>
    <h3 class="h2" style="margin:10px 0 4px">${r.n}</h3>
    <div class="sm mu b">${r.m} мин · порция ×${fmtD(r.fct, 2)}</div>
    <div class="g4 mt">${[['ккал', r.k, '#F5F6F2'], ['белки', r.p, '#FF7A45'], ['жиры', r.f, '#FFC93C'], ['углев.', r.c, '#4CC9F0']].map(([l, v, c]) => html`<div style="padding:10px 4px;border-radius:14px;background:#0F1011;text-align:center"><div class="dg" style=${'font-size:17px;color:' + c}>${v}</div><div class="xs mu b">${l}</div></div>`)}</div>
    <div class="h2 mt2" style="font-size:16px">Ингредиенты <span class="xs mu b" style="font-family:Manrope">(сырой вес)</span></div>
    ${r.ingS.map(([id, g, n]) => html`<div class="between list-row sm"><span style="font-weight:600">${F[id][0]}</span><span class="b">${n ? n + ' шт · ' : ''}${g} г</span></div>`)}
    <div class="h2 mt2" style="font-size:16px">Приготовление</div>
    <div class="col mt0">${r.steps.map((t, i) => html`<div class="row sm" style="align-items:flex-start"><span class="dg" style=${`width:28px;height:28px;flex:none;border-radius:10px;background:${x.color};color:#0F1011;font-size:12px;display:flex;align-items:center;justify-content:center`}>${i + 1}</span><span style="padding-top:3px">${t}</span></div>`)}</div>
    <button class="btn s2 full mt2" onClick=${() => open('swap', { key: x.key })}>Заменить блюдо</button>
  </div>`;
}
function SwapSheet({ s, set, T, ui, close, say }) {
  const x = findSlot(s, T, ui.key);
  const { ok } = recipePool(s, x.cat);
  const opts = ok.filter((r) => r.id !== x.r.id).map((r0) => ({ r0, r: scaleRecipe(r0, T.kcal * x.sh, T.p * x.sh) }));
  return html`<div>
    <span class="tag" style=${'background:' + x.color}>Замена · ${x.type}</span>
    <h3 class="h2" style="margin:10px 0 4px">Вместо «${x.r.n}»</h3>
    <p class="sm mu" style="margin:0 0 12px">Порция пересчитана, чтобы калорийность дня осталась прежней.${s.split ? ' Только блюда по правилам раздельного питания.' : ''}</p>
    <div class="col">${opts.map(({ r0, r }) => html`<button class="card tight" style="background:#0F1011;text-align:left;width:100%" onClick=${() => { set({ over: { ...s.over, [x.key]: r0.id } }); close(); say('Заменили на «' + r.n + '»'); }}>
      <div class="between"><span class="b">${r.n}</span><span class="dg" style="color:#C8F542;white-space:nowrap;font-size:14px">${r.k} ккал</span></div>
      <div class="xs mu b mt0">${r.kind ? html`<span style=${'color:' + KIND[r.kind].c}>${KIND[r.kind].n} · </span>` : null}<span style="color:#FF7A45">Б ${r.p}</span> · <span style="color:#FFC93C">Ж ${r.f}</span> · <span style="color:#4CC9F0">У ${r.c}</span> · ${r.m} мин</div></button>`)}</div>
    ${x.isOver ? html`<button class="btn ghost full mt" onClick=${() => { const o = { ...s.over }; delete o[x.key]; set({ over: o }); close(); }}>Вернуть блюдо из плана</button>` : null}
  </div>`;
}
function ShopSheet({ s, set, T }) {
  const agg = {};
  for (let d = 0; d < 7; d++) dayPlan(s, T, d).forEach((x) => x.r.ingS.forEach(([id, g]) => { agg[id] = (agg[id] || 0) + g; }));
  const ids = Object.keys(agg).sort((a, b) => F[a][0].localeCompare(F[b][0], 'ru'));
  const done = ids.filter((id) => s.shop[id]).length;
  return html`<div>
    <div class="lbl" style="color:#C8F542">На неделю</div><h3 class="h2" style="margin:6px 0 4px;font-size:22px">Список покупок</h3>
    <p class="sm mu" style="margin:0 0 8px">Из меню недели с учётом замен и порций. Куплено ${done} из ${ids.length}.</p>
    <div class="bar"><i style=${`width:${ids.length ? done / ids.length * 100 : 0}%;background:#C8F542`}></i></div>
    ${ids.map((id) => { const on = !!s.shop[id], g = agg[id], q = F[id][6] ? Math.round(g / F[id][7]) + ' ' + F[id][6] : g >= 1000 ? fmtD(g / 1000) + ' кг' : Math.round(g / 10) * 10 + ' г'; return html`<button class="list-row" style="width:100%;text-align:left" onClick=${() => set({ shop: { ...s.shop, [id]: !on } })}>
      <span style=${`width:26px;height:26px;flex:none;border-radius:9px;display:flex;align-items:center;justify-content:center;${on ? 'background:#C8F542' : 'border:1.5px solid #3A3F44'}`}>${on ? I.check('#0F1011', 14) : null}</span>
      <span style=${'flex:1;font-weight:600;' + (on ? 'text-decoration:line-through;color:#6F757B' : '')}>${F[id][0]}</span><span class="sm mu b">${q}</span></button>`; })}
  </div>`;
}
function CheckinSheet({ s, set, close, award, say }) {
  const [m, setM] = useState(s.mood), [sl, setSl] = useState(s.sleep);
  return html`<div>
    <div class="lbl" style="color:#C8F542">Вечерний чек-ин</div><h3 class="h2" style="margin:6px 0 14px;font-size:22px">Как прошёл день?</h3>
    <div class="lbl" style="margin-bottom:8px">Самочувствие</div>
    <div class="g2">${['Отлично', 'Нормально', 'Устал(а)', 'Плохо'].map((n, i) => html`<button class=${'chip' + (m === i ? ' on' : '')} style="border-radius:16px;min-height:50px;background:${m === i ? '' : '#24272A'}" onClick=${() => setM(i)}>${n}</button>`)}</div>
    <div class="lbl mt2" style="margin-bottom:8px">Сон прошлой ночью</div>
    <div class="g4">${['< 6 ч', '6–7 ч', '7–8 ч', '8+ ч'].map((n, i) => html`<button class=${'chip' + (sl === i ? ' on' : '')} style="border-radius:16px;min-height:50px;padding:4px;background:${sl === i ? '' : '#24272A'}" onClick=${() => setSl(i)}>${n}</button>`)}</div>
    <button class="btn lime full mt2" onClick=${() => { set({ checkin: true, mood: m, sleep: sl }); close(); award('checkin', todayISO()); say('Чек-ин сохранён. Хорошего вечера'); }}>Сохранить</button>
  </div>`;
}
function CoachSheet({ close, say }) {
  const [t, setT] = useState('');
  const send = async () => {
    if (!t.trim()) return say('Напиши сообщение');
    if (!API.ok) { close(); return say('Открой приложение через Telegram, чтобы отправить'); }
    const r = await API.post('/api/message', { text: t.trim() });
    close(); say(r && r.ok ? 'Сообщение отправлено тренеру' : 'Не получилось отправить, попробуй позже');
  };
  return html`<div>
    <div class="row"><span class="dg" style="width:54px;height:54px;border-radius:18px;background:#C8F542;color:#0F1011;display:flex;align-items:center;justify-content:center;font-size:18px">АГ</span><div><div class="lbl">Твой тренер</div><div class="h2">Александр Гурлени</div></div></div>
    <label class="field mt2">Сообщение<textarea rows="4" value=${t} onInput=${(e) => setT(e.target.value)} placeholder="Вопрос по плану, просьба изменить меню или расписание…" style="width:100%;resize:none;border-radius:16px;border:1.5px solid #2E3236;background:#0F1011;padding:12px;font-size:15px"></textarea></label>
    <button class="btn lime full mt" onClick=${send}>Отправить</button>
    <p class="xs mu" style="text-align:center;margin:10px 0 0">Ответ придёт в чат с ботом в Telegram.</p>
  </div>`;
}

function FoodSheet({ s, set, ui, close, award, say }) {
  const cooked = ui.mode === 'cooked';
  const DB = cooked ? COOKED : F;
  const [q, setQ] = useState('');
  const [pick, setPick] = useState(null);
  const [g, setG] = useState(cooked ? '250' : '100');
  const [meal, setMeal] = useState(() => { const h = new Date().getHours(); return h < 11 ? 'b' : h < 15 ? 'l' : h < 18 ? 's' : 'd'; });
  const [custom, setCustom] = useState(null);
  const ql = q.trim().toLowerCase();
  const list = Object.entries(DB).filter(([, x]) => !ql || x[0].toLowerCase().includes(ql)).slice(0, 40);
  const item = custom ? ['custom', num(custom.k, 0), num(custom.p, 0), num(custom.f, 0), num(custom.c, 0)] : pick ? DB[pick] : null;
  const grams = num(g, 0);
  const calc = item ? foodCalc(item, grams) : null;
  const add = () => {
    if (!item || !grams) return say('Укажи вес');
    const d = todayISO();
    const name = custom ? (custom.n || 'Свой продукт') : item[0];
    const e = { id: Date.now() + '' + Math.random().toString(36).slice(2, 5), name, g: grams, ...calc, meal, cooked, grp: custom ? 'M' : item[8] };
    set({ diary: { ...s.diary, [d]: [...(s.diary[d] || []), e] } });
    award('diary', e.id);
    close(); say(`${name}: ${calc.k} ккал добавлено`);
  };
  const warn = s.split && item && !custom && (() => { const others = (s.diary[todayISO()] || []).filter((x) => x.meal === meal); const gp = item[8]; return (gp === 'P' && others.some((x) => x.grp === 'C')) || (gp === 'C' && others.some((x) => x.grp === 'P')) || gp === 'M'; })();
  return html`<div>
    <div class="lbl" style=${'color:' + (cooked ? '#4CC9F0' : '#C8F542')}>${cooked ? 'Готовая еда' : 'Продукт · сырой вес'}</div>
    <h3 class="h2" style="margin:6px 0 4px;font-size:22px">${cooked ? 'Добавить готовое блюдо' : 'Добавить продукт'}</h3>
    <p class="sm mu" style="margin:0 0 10px">${cooked ? 'Взвесь порцию в готовом виде. Значения справочные, приблизительные.' : 'Мясо, рыбу и крупы взвешивай в сыром виде, овощи и фрукты — как есть.'}</p>
    ${!item ? html`
      <input class="inp sm" placeholder=${cooked ? 'Поиск: плов, суп, пицца…' : 'Поиск: курица, гречка, огурец…'} value=${q} onInput=${(e) => setQ(e.target.value)} />
      <div class="mt0">${list.map(([id, x]) => html`<button class="list-row" style="width:100%;text-align:left" onClick=${() => { setPick(id); if (x[6]) setG(String(x[7])); }}>
        ${s.split ? html`<span class="tag" style=${'background:' + KIND[x[8]].c + ';min-width:26px;text-align:center'}>${KIND[x[8]].n[0]}</span>` : null}
        <span style="flex:1;font-weight:600">${x[0]}</span><span class="xs mu b">${x[1]} ккал/100 г</span></button>`)}</div>
      <button class="btn ghost full mt" onClick=${() => setCustom({ n: q, k: '', p: '', f: '', c: '' })}>${I.plus}Своё блюдо — ввести КБЖУ</button>
    ` : html`
      ${custom ? html`<div class="col">
        <label class="field">Название<input class="inp sm" value=${custom.n} onInput=${(e) => setCustom({ ...custom, n: e.target.value })} /></label>
        <div class="g4">${[['k', 'Ккал'], ['p', 'Белки'], ['f', 'Жиры'], ['c', 'Углев.']].map(([k, l]) => html`<label class="field" style="font-size:11px">${l}/100г<input class="inp sm" inputmode="decimal" value=${custom[k]} onInput=${(e) => setCustom({ ...custom, [k]: e.target.value })} style="padding:0 8px" /></label>`)}</div>
      </div>` : html`<div class="card tight row" style="background:#0F1011"><span style="flex:1"><span class="b" style="display:block">${item[0]}</span><span class="xs mu">${item[1]} ккал · Б ${item[2]} · Ж ${item[3]} · У ${item[4]} на 100 г</span></span><button class="btn small s2" onClick=${() => setPick(null)}>Другой</button></div>`}
      <label class="field mt">Вес, г${!custom && item[6] ? ` (1 ${item[6]} ≈ ${item[7]} г)` : ''}<input class="inp" inputmode="decimal" value=${g} onInput=${(e) => setG(e.target.value.replace(/[^0-9.,]/g, ''))} /></label>
      <div class="row mt0" style="gap:6px;flex-wrap:wrap">${(!custom && item[6] ? [1, 2, 3].map((n) => [n * item[7], n + ' ' + item[6]]) : [[50, '50 г'], [100, '100 г'], [150, '150 г'], [200, '200 г'], [300, '300 г']]).map(([v, l]) => html`<button class="chip" style="min-height:38px;font-size:13px;background:#24272A" onClick=${() => setG(String(v))}>${l}</button>`)}</div>
      ${calc ? html`<div class="g4 mt pop">${[['ккал', calc.k, '#C8F542'], ['белки', fmtD(calc.p), '#FF7A45'], ['жиры', fmtD(calc.f), '#FFC93C'], ['углев.', fmtD(calc.c), '#4CC9F0']].map(([l, v, c]) => html`<div style="padding:12px 4px;border-radius:14px;background:#0F1011;text-align:center"><div class="dg" style=${'font-size:18px;color:' + c}>${v}</div><div class="xs mu b">${l}</div></div>`)}</div>` : null}
      <div class="lbl mt2" style="margin-bottom:8px">Приём пищи</div>
      <div class="g4">${['b', 'l', 's', 'd'].map((m) => html`<button class=${'chip' + (meal === m ? ' on' : '')} style=${'border-radius:14px;padding:6px 2px;font-size:12px;' + (meal === m ? '' : 'background:#24272A')} onClick=${() => setMeal(m)}>${SLOT_TYPE[m][0] + SLOT_TYPE[m].slice(1).toLowerCase()}</button>`)}</div>
      ${warn ? html`<div class="card tight mt sm" style="background:rgba(255,122,69,.14);color:#FF7A45;font-weight:700">Раздельное питание: в этом приёме уже есть ${item[8] === 'P' ? 'углеводы' : item[8] === 'C' ? 'белок' : 'другие продукты'}${item[8] === 'M' ? ' — это смешанное блюдо' : ''}. Лучше перенести в другой приём.</div>` : null}
      <button class="btn lime full mt2" onClick=${add}>Добавить в дневник</button>
    `}
  </div>`;
}

function WorkoutSheet({ s, set, close, award, say }) {
  const [t, setT] = useState(0), [min, setMin] = useState('45'), [inten, setIn] = useState(1), [src, setSrc] = useState('est'), [kc, setKc] = useState('');
  const w = curWeight(s);
  const est = metKcal(ACTS[t].met[inten], num(min, 0), w);
  const kcal = src === 'watch' ? Math.round(num(kc, 0)) : est;
  const add = () => {
    if (!num(min, 0) || !kcal) return say('Укажи время и калории');
    const d = todayISO(), al = s.actLog[d] || { steps: 0, w: [] };
    set({ actLog: { ...s.actLog, [d]: { ...al, w: [...(al.w || []), { n: ACTS[t].n, min: Math.round(num(min, 0)), kcal, src }] } } });
    award('workout', String((al.w || []).length));
    close(); say(`${ACTS[t].n}: ${kcal} ккал`);
  };
  return html`<div>
    <div class="lbl" style="color:#C8F542">Активность</div><h3 class="h2" style="margin:6px 0 12px;font-size:22px">Добавить тренировку</h3>
    <div class="g3">${ACTS.map((a, i) => html`<button class=${'chip' + (t === i ? ' on' : '')} style=${'border-radius:14px;padding:8px 4px;font-size:12px;min-height:46px;' + (t === i ? '' : 'background:#24272A')} onClick=${() => setT(i)}>${a.n}</button>`)}</div>
    <label class="field mt2">Длительность, мин<input class="inp" inputmode="numeric" value=${min} onInput=${(e) => setMin(e.target.value.replace(/[^0-9]/g, ''))} /></label>
    <div class="lbl mt2" style="margin-bottom:8px">Калории</div>
    <div class="g2">${[['est', 'Оценить за меня'], ['watch', 'Знаю из часов']].map(([k, n]) => html`<button class=${'chip' + (src === k ? ' on' : '')} style=${'border-radius:14px;min-height:46px;' + (src === k ? '' : 'background:#24272A')} onClick=${() => setSrc(k)}>${n}</button>`)}</div>
    ${src === 'est' ? html`
      <div class="lbl mt" style="margin-bottom:8px">Интенсивность</div>
      <div class="g3">${['Лёгкая', 'Средняя', 'Высокая'].map((n, i) => html`<button class=${'chip' + (inten === i ? ' on' : '')} style=${'border-radius:14px;min-height:44px;' + (inten === i ? '' : 'background:#24272A')} onClick=${() => setIn(i)}>${n}</button>`)}</div>
      <div class="xs mu mt0">Лёгкая — можно петь; средняя — можно говорить; высокая — трудно говорить.</div>
    ` : html`<label class="field mt">Активные калории из часов / приложения<input class="inp" inputmode="numeric" value=${kc} onInput=${(e) => setKc(e.target.value.replace(/[^0-9]/g, ''))} placeholder="например, 320" /></label>
      <div class="xs mu mt0">Бери «Активные калории» (Active), а не «Всего» — в общих учтён обмен в покое.</div>`}
    <div class="card tight mt between" style="background:#0F1011"><span class="sm b">Будет записано</span><span class="dg" style="color:#FF7A45;font-size:20px">${fmtN(kcal)} ккал</span></div>
    <button class="btn lime full mt" onClick=${add}>Сохранить</button>
  </div>`;
}

function HintsSheet() {
  const blocks = [
    ['iPhone', ['Шаги: приложение «Здоровье» → Обзор → Шаги.', 'Калории тренировки: «Фитнес» или «Здоровье» → Активность → Активная энергия.']],
    ['Apple Watch', ['После тренировки в приложении «Фитнес» открой её и возьми «Активные калории».']],
    ['Android', ['Шаги: Google Fit (Health Connect) или Samsung Health → Шаги.', 'Калории: в карточке тренировки — «Сожжено» / «Активные калории».']],
    ['Mi Band, Huawei, Garmin', ['Приложения Mi Fitness / Zepp, Huawei Health, Garmin Connect → Активность → Шаги и калории тренировки.']],
    ['Нет часов и шагомера', ['Выбери «Оценить за меня» — посчитаем по типу, времени и интенсивности.', 'Ориентир по шагам: 10 минут обычной ходьбы ≈ 1 000 шагов.']]
  ];
  return html`<div>
    <div class="lbl" style="color:#4CC9F0">Подсказки</div><h3 class="h2" style="margin:6px 0 12px;font-size:22px">Где взять шаги и калории</h3>
    <div class="col">${blocks.map(([h, items]) => html`<div class="card tight" style="background:#0F1011"><div class="b" style="margin-bottom:6px">${h}</div>${items.map((t) => html`<div class="sm mu" style="margin-top:4px">• ${t}</div>`)}</div>`)}</div>
    <div class="card tight mt sm" style="background:rgba(200,245,66,.12)"><b>Важно:</b> сожжённые калории не нужно «отрабатывать» едой или голодом. Норма уже учитывает твой уровень активности.</div>
  </div>`;
}

function WardrobeSheet({ s, set, lv, body, say }) {
  const [cat, setCat] = useState('top');
  const cats = [['top', 'Верх'], ['bottom', 'Низ'], ['shoes', 'Обувь'], ['acc', 'Аксессуары']];
  const colorKey = { top: 'ctop', bottom: 'cbot', shoes: 'cshoe' }[cat];
  const items = AV.items[cat].filter((it) => !it.g || it.g === s.av.g);
  const setAv = (patch) => set((p) => ({ av: { ...p.av, ...patch } }));
  const act = (it) => {
    const owned = it.price === 0 || s.av.owned[it.id];
    if (lv.lvl < it.lvl) return say(`Откроется на уровне ${it.lvl + 1}`);
    if (!owned) {
      if (s.game.coins < it.price) return say(`Не хватает ${fmtN(it.price - s.game.coins)} коинов — тапай героя и выполняй задачи`);
      set((p) => ({ game: { ...p.game, coins: p.game.coins - it.price }, av: { ...p.av, owned: { ...p.av.owned, [it.id]: true }, [cat]: it.id } }));
      return say(`Куплено: ${it.n}, размер ${body.size}`);
    }
    setAv({ [cat]: it.id });
  };
  return html`<div>
    <div class="between"><div><div class="lbl" style="color:#C8F542">Гардероб</div><h3 class="h2" style="margin:4px 0 0;font-size:22px">Одежда по размеру</h3></div><span class="pill" style="margin-right:44px">${I.coin}${fmtN(s.game.coins)}</span></div>
    <div class="row mt" style="gap:12px;align-items:center">
      <div style="width:130px;flex:none;background:#0F1011;border-radius:22px"><${Avatar} a=${s.av} body=${body} w=${130} /></div>
      <div class="sm mu">Вся одежда подгоняется под текущую фигуру героя. Сейчас размер <b style="color:#C8F542">${body.size}</b>. Меняется вес — меняется и размер.</div>
    </div>
    <div class="g4 mt">${cats.map(([k, n]) => html`<button class=${'chip' + (cat === k ? ' on' : '')} style=${'border-radius:14px;padding:6px 2px;font-size:12px;' + (cat === k ? '' : 'background:#24272A')} onClick=${() => setCat(k)}>${n}</button>`)}</div>
    <div class="g3 mt">${items.map((it) => {
      const owned = it.price === 0 || s.av.owned[it.id], locked = lv.lvl < it.lvl, on = s.av[cat] === it.id;
      const prev = { ...s.av, [cat]: it.id };
      return html`<button class=${'item' + (on ? ' on' : '')} onClick=${() => act(it)} style=${locked ? 'opacity:.55' : ''}>
        ${locked ? html`<span class="lock">ур. ${it.lvl + 1}</span>` : !owned ? html`<span class="lock" style="color:#FFC93C">${fmtN(it.price)}</span>` : null}
        <div style=${'width:64px;height:102px;overflow:hidden;' + (locked ? 'filter:grayscale(1)' : '')}><${Avatar} a=${prev} body=${body} w=${64} bare=${true} /></div>
        <span class="xs b">${it.n}</span><span class="xs mu" style="font-size:10px">${on ? 'надето' : owned ? 'надеть' : locked ? 'закрыто' : 'купить'}</span>
      </button>`;
    })}</div>
    ${colorKey ? html`<div class="lbl mt2" style="margin-bottom:8px">Цвет</div>
      <div class="row" style="flex-wrap:wrap;gap:8px">${AV.colors.map((c, i) => html`<button aria-label=${'Цвет ' + (i + 1)} class=${'swatch' + (s.av[colorKey] === i ? ' on' : '')} style=${'background:' + c} onClick=${() => setAv({ [colorKey]: i })}></button>`)}</div>` : null}
  </div>`;
}
function LooksSheet({ s, set, body }) {
  const setAv = (patch) => set((p) => ({ av: { ...p.av, ...patch } }));
  return html`<div>
    <div class="lbl" style="color:#C8F542">Внешность</div><h3 class="h2" style="margin:4px 0 0;font-size:22px">Настрой героя</h3>
    <div style="display:flex;justify-content:center"><${Avatar} a=${s.av} body=${body} w=${170} /></div>
    <label class="field">Имя<input class="inp sm" maxlength="16" value=${s.av.name} onInput=${(e) => setAv({ name: e.target.value.slice(0, 16) })} /></label>
    <div class="g2 mt">${[['f', 'Девушка'], ['m', 'Парень']].map(([g, n]) => html`<button class=${'chip' + (s.av.g === g ? ' on' : '')} style=${'border-radius:14px;' + (s.av.g === g ? '' : 'background:#24272A')} onClick=${() => setAv({ g, hair: 0, top: 'tee', bottom: 'joggers' })}>${n}</button>`)}</div>
    <${Looks} s=${s} setAv=${setAv} />
  </div>`;
}
function WeightSheet({ s, set, close, award, say }) {
  const [v, setV] = useState(fmtD(curWeight(s)));
  return html`<div>
    <div class="lbl" style="color:#C8F542">Взвешивание</div><h3 class="h2" style="margin:6px 0 4px;font-size:22px">Сколько сегодня?</h3>
    <p class="sm mu" style="margin:0 0 12px">Лучше утром, натощак, в одно и то же время. Фигура героя изменится вместе с весом.</p>
    <input class="inp" inputmode="decimal" value=${v} onInput=${(e) => setV(e.target.value.replace(/[^0-9.,]/g, ''))} style="font-size:28px;text-align:center" />
    <button class="btn lime full mt" onClick=${() => { const w = num(v, 0); if (w < 30 || w > 300) return say('Проверь вес'); set({ wlog: { ...s.wlog, [todayISO()]: Math.round(w * 10) / 10 } }); award('weight', todayISO()); close(); say('Вес сохранён'); }}>Сохранить</button>
  </div>`;
}

function LevelUp({ s, lv, body, lvl, onClose }) {
  const items = Object.values(AV.items).flat().filter((it) => it.lvl === lvl && (!it.g || it.g === s.av.g));
  const conf = Array.from({ length: 28 }, (_, i) => ({ l: (i * 37) % 100, d: (i % 7) * 0.15, c: ['#C8F542', '#FF7A45', '#4CC9F0', '#FFC93C', '#FF7EB6'][i % 5] }));
  return html`<div class="sheet-wrap" style="z-index:50">
    <div class="sheet-bg" style="background:rgba(5,6,7,.85)"></div>
    ${conf.map((c) => html`<span class="confetti" style=${`left:${c.l}%;background:${c.c};animation-delay:${c.d}s`}></span>`)}
    <div class="pop" style="position:absolute;left:18px;right:18px;top:50%;transform:translateY(-50%);background:#C8F542;color:#0F1011;border-radius:30px;padding:20px;text-align:center">
      <div class="lbl" style="color:#0F1011">Новый уровень</div>
      <div class="h1" style="font-size:34px;margin-top:4px">${LEVELS[lvl].n}</div>
      <div style="display:flex;justify-content:center"><${Avatar} a=${s.av} body=${bodyOf(s, lvl)} w=${170} cls="idle" bare=${true} /></div>
      <div class="sm b">${s.av.name || 'Герой'} стал${s.av.g === 'f' ? 'а' : ''} спортивнее и увереннее. Так держать!</div>
      ${items.length ? html`<div class="xs b mt0">Открыто в гардеробе: ${items.map((x) => x.n).join(', ')}</div>` : null}
      <button class="btn dark full mt" onClick=${onClose}>Круто!</button>
    </div>
  </div>`;
}

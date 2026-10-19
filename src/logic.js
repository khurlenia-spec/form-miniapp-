// ===== Расчёты: норма, порции, меню, дневник, активность =====
const num = (v, d) => { const x = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(x) && x > 0 ? x : d; };
const pad2 = (n) => String(n).padStart(2, '0');
const iso = (y, m, d) => { const t = new Date(y, m, d); return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate()); };
const todayISO = () => { const n = new Date(); return iso(n.getFullYear(), n.getMonth(), n.getDate()); };
const fmtN = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const fmtD = (x, d = 1) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toString().replace('.', ',');
const wdOf = (dt) => (dt.getDay() + 6) % 7;
const MG = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MN = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MP = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WDF = ['ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА', 'ВОСКРЕСЕНЬЕ'];

const GOALS = [
  { n: 'Снизить процент жира', s: 'Похудеть, сохранив мышцы' },
  { n: 'Набрать мышечную массу', s: 'Стать сильнее и объёмнее' },
  { n: 'Рекомпозиция тела', s: 'Одновременно скинуть жир и набрать мышцы' },
  { n: 'Поддерживать форму', s: 'Сохранить вес и тонус' },
  { n: 'Наладить питание и привычки', s: 'Без строгих ограничений' }
];
const RESTR = ['Без лактозы', 'Без глютена', 'Вегетарианство', 'Без рыбы', 'Аллергия на орехи', 'Нет ограничений'];
const RESTR_TAGS = [['dairy'], ['gluten'], ['meat', 'fish'], ['fish'], ['nuts'], []];

const weightsSorted = (st) => Object.entries(st.wlog || {}).sort(([a], [b]) => a.localeCompare(b));
const curWeight = (st) => { const ws = weightsSorted(st); return ws.length ? ws[ws.length - 1][1] : num(st.w, 70); };

function target(st) {
  const age = num(st.age, 28), h = num(st.h, st.sex === 1 ? 165 : 178), w = curWeight(st);
  const bmr = 10 * w + 6.25 * h - 5 * age + (st.sex === 1 ? -161 : 5);
  const tdee = bmr * [1.375, 1.55, 1.725][st.act ?? 1];
  const g = st.goal ?? 3;
  const kcal = Math.max(Math.round(tdee * [0.85, 1.1, 0.92, 1, 1][g] / 10) * 10, Math.round(bmr / 10) * 10);
  const p = Math.round(w * [2.0, 1.8, 2.2, 1.6, 1.6][g]);
  const f = Math.round(w * 0.9);
  const c = Math.max(0, Math.round((kcal - p * 4 - f * 9) / 4));
  return { kcal, p, f, c, bmr: Math.round(bmr), tdee: Math.round(tdee), water: Math.round(w * 30 / 100) / 10, w, isDefault: !st.age && !st.h && !st.w };
}

function nut(ing, src = F) {
  const t = { k: 0, p: 0, f: 0, c: 0 };
  ing.forEach(([id, g]) => { const x = src[id]; t.k += x[1] * g / 100; t.p += x[2] * g / 100; t.f += x[3] * g / 100; t.c += x[4] * g / 100; });
  return t;
}

function scaleRecipe(r, slotK, slotP) {
  const base = nut(r.ing);
  const isP = (id) => F[id][2] * 4 / F[id][1] > 0.4;
  const bp = nut(r.ing.filter(([id]) => isP(id)));
  const bo = nut(r.ing.filter(([id]) => !isP(id)));
  let fP = Math.min(3.5, Math.max(0.5, slotK / base.k)), fO = fP;
  const det = bp.k * bo.p - bo.k * bp.p;
  if (slotP && bp.k > 0 && bo.k > 0 && Math.abs(det) > 1e-6) {
    const a = (slotK * bo.p - bo.k * slotP) / det, b = (bp.k * slotP - slotK * bp.p) / det;
    if (a > 0 && b > 0) { fP = Math.min(3, Math.max(0.5, a)); fO = Math.min(4, Math.max(0.4, (slotK - fP * bp.k) / bo.k)); }
  }
  const kNow = fP * bp.k + fO * bo.k;
  if (kNow < slotK * 0.97) { const up = Math.min(slotK / kNow, 4 / Math.max(fP, fO)); fP *= up; fO *= up; }
  const fct = (fP * bp.k + fO * bo.k) / base.k;
  const ing = r.ing.map(([id, g]) => {
    const x = F[id], f = isP(id) ? fP : fO;
    if (x[6]) { const n = Math.max(1, Math.round(g * f / x[7])); return [id, n * x[7], n]; }
    return [id, Math.max(5, Math.round(g * f / 5) * 5)];
  });
  const n = nut(ing);
  return { ...r, ingS: ing, fct, k: Math.round(n.k), p: Math.round(n.p), f: Math.round(n.f), c: Math.round(n.c) };
}

const recipeTags = (r) => { const t = {}; r.ing.forEach(([id]) => F[id][5].split(' ').filter(Boolean).forEach((x) => { t[x] = true; })); return t; };
const recipeShort = (r) => r.ing.map(([id]) => F[id][0].replace(/ \(.*\)/, '').replace(/,.*/, '').toLowerCase()).join(', ');
const SLOT_TYPE = { b: 'ЗАВТРАК', l: 'ОБЕД', s: 'ПЕРЕКУС', d: 'УЖИН' };
const SLOT_COLOR = { b: '#FFC93C', l: '#FF7A45', s: '#4CC9F0', d: '#9B8CFF' };
const KIND = { P: { n: 'Белковый', c: '#FF7A45' }, C: { n: 'Углеводный', c: '#4CC9F0' }, F: { n: 'Фрукты', c: '#FF7EB6' }, N: { n: 'Нейтральный', c: '#C8F542' }, M: { n: 'Смешанный', c: '#9EA3A8' } };

function slotsFor(st, T) {
  const m = st.meals ?? 2;
  if (m === 0) return T.kcal > 2300
    ? [{ cat: 'b', sh: 0.38, time: '10:00' }, { cat: 's', sh: 0.17, time: '14:30' }, { cat: 'd', sh: 0.45, time: '18:30' }]
    : [{ cat: 'b', sh: 0.45, time: '10:00' }, { cat: 'd', sh: 0.55, time: '18:30' }];
  if (m === 1) return [{ cat: 'b', sh: 0.30, time: '08:30' }, { cat: 'l', sh: 0.38, time: '13:00' }, { cat: 'd', sh: 0.32, time: '19:00' }];
  return [{ cat: 'b', sh: 0.25, time: '08:30' }, { cat: 'l', sh: 0.33, time: '13:00' }, { cat: 's', sh: 0.12, time: '16:30' }, { cat: 'd', sh: 0.30, time: '19:30' }];
}
const ROT = { b: [0, 1, 2, 3, 4, 0, 2], l: [0, 1, 2, 3, 4, 2, 0], s: [0, 1, 2, 3, 4, 0, 3], d: [0, 3, 1, 4, 2, 0, 3] };

function bannedTags(st) {
  const b = {};
  Object.keys(st.restr || {}).forEach((i) => { if (st.restr[i]) RESTR_TAGS[i].forEach((t) => { b[t] = true; }); });
  return b;
}
function recipePool(st, cat) {
  const pool = (st.split ? RS : R).filter((r) => r.cat === cat);
  const ban = bannedTags(st);
  const ok = pool.filter((r) => !Object.keys(recipeTags(r)).some((t) => ban[t]));
  return { pool, ok: ok.length ? ok : pool, isOk: (r) => !Object.keys(recipeTags(r)).some((t) => ban[t]) };
}
function dayPlan(st, T, d) {
  return slotsFor(st, T).map((sl) => {
    const key = (st.split ? 'S' : '') + d + '-' + sl.cat;
    const { pool, ok, isOk } = recipePool(st, sl.cat);
    let r = st.over && st.over[key] ? pool.find((x) => x.id === st.over[key]) : null;
    if (!r) r = pool[ROT[sl.cat][d] % pool.length];
    if (!isOk(r)) r = ok[d % ok.length];
    return { ...sl, key, type: SLOT_TYPE[sl.cat], color: SLOT_COLOR[sl.cat], r: scaleRecipe(r, T.kcal * sl.sh, T.p * sl.sh), isOver: !!(st.over && st.over[key]) };
  });
}
const sumR = (arr) => arr.reduce((a, x) => ({ k: a.k + x.k, p: a.p + x.p, f: a.f + x.f, c: a.c + x.c }), { k: 0, p: 0, f: 0, c: 0 });

function foodCalc(item, g) {
  return { k: Math.round(item[1] * g / 100), p: Math.round(item[2] * g / 10) / 10, f: Math.round(item[3] * g / 10) / 10, c: Math.round(item[4] * g / 10) / 10 };
}

function stepsKcal(steps, w) { return Math.round(steps * 0.04 * (w / 70)); }
function metKcal(met, min, w) { return Math.round(met * w * min / 60); }

function donut(p, f, c, r = 34) {
  const C = 2 * Math.PI * r;
  const e = [p * 4, f * 9, c * 4];
  const tot = e[0] + e[1] + e[2] || 1;
  let acc = 0;
  return e.map((v) => { const len = Math.max(0, v / tot * C - 2.5); const o = { da: len.toFixed(1) + ' ' + C.toFixed(1), off: (-acc).toFixed(1) }; acc += v / tot * C; return o; });
}

// Награды за реальные действия
const REWARDS = {
  meal: { xp: 10, c: 20, n: 'Приём пищи по плану' },
  diary: { xp: 5, c: 10, n: 'Запись в дневник', max: 6 },
  train: { xp: 50, c: 100, n: 'Тренировка' },
  checkin: { xp: 20, c: 40, n: 'Вечерний чек-ин' },
  water: { xp: 2, c: 5, n: 'Стакан воды', max: 10 },
  steps: { xp: 40, c: 80, n: '8 000 шагов' },
  workout: { xp: 30, c: 60, n: 'Активность записана', max: 2 },
  weight: { xp: 15, c: 30, n: 'Взвешивание' }
};
const STEP_GOAL = 8000;
const ENERGY_MAX = 200, ENERGY_MS = 12000;

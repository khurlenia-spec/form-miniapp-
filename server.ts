// FORM — Telegram Mini App server: страница приложения, API, вебхук бота.
// Разработка Александра Гурлени.
import { sql } from "bun";
import { createHmac, createHash, timingSafeEqual } from "node:crypto";

const TOKEN = (Bun.env.BOT_TOKEN || "").trim();
const DOMAIN = Bun.env.RAILWAY_PUBLIC_DOMAIN || "";
const APP_URL = DOMAIN ? `https://${DOMAIN}/` : "";
const COACH_CODE = (Bun.env.COACH_CODE || "").trim();
const HOOK = TOKEN ? createHash("sha256").update(TOKEN).digest("hex").slice(0, 32) : "";
const HTML = await Bun.file(new URL("./public/index.html", import.meta.url)).text();
// barcode scanner library, loaded by the page only when the scanner is opened
let ZXING: string | null = null;
try { ZXING = await Bun.file(new URL("./public/zxing.js", import.meta.url)).text(); } catch { ZXING = null; }

await sql`CREATE TABLE IF NOT EXISTS users (
  tg_id BIGINT PRIMARY KEY, first_name TEXT, username TEXT,
  state JSONB, meta JSONB, notify BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
await sql`CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT)`;
// shared product base: products found in Open Food Facts and products users entered themselves
await sql`CREATE TABLE IF NOT EXISTS foods (
  code TEXT PRIMARY KEY, name TEXT, per JSONB, q TEXT, src TEXT, by_id BIGINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;

// ---------- products: barcode lookup and search ----------
const OFF_BASE = (Bun.env.OFF_BASE || "https://world.openfoodfacts.org").replace(/\/$/, "");
const SAL_BASE = (Bun.env.SAL_BASE || "https://search.openfoodfacts.org").replace(/\/$/, "");
const OFF_UA = "FORM-miniapp/1.0 (Telegram Mini App; nutrition diary)";
const OFF_FIELDS = "code,product_name,product_name_ru,product_name_en,generic_name,brands,nutriments,quantity";
const r1 = (v: any) => (v == null || v === "" || !isFinite(+v) ? null : Math.round(+v * 10) / 10);
function offProduct(pr: any) {
  if (!pr) return null;
  const nu = pr.nutriments || {};
  const kc = nu["energy-kcal_100g"] != null ? +nu["energy-kcal_100g"] : nu.energy_100g != null ? +nu.energy_100g / 4.184 : null;
  const name = String(pr.product_name_ru || pr.product_name || pr.product_name_en || pr.generic_name || "").trim();
  const brand = pr.brands ? String(pr.brands).split(",")[0].trim() : "";
  const per = [kc, nu.proteins_100g, nu.fat_100g, nu.carbohydrates_100g].map(r1);
  // fill in calories from macros when only macros are given
  if (per[0] == null && per[1] != null && per[2] != null && per[3] != null) per[0] = Math.round(per[1]! * 4 + per[2]! * 9 + per[3]! * 4);
  return { code: String(pr.code || ""), n: (name || "") + (brand && !name.toLowerCase().includes(brand.toLowerCase()) ? " · " + brand : ""), per, q: pr.quantity || "" };
}
const okPer = (per: any) => Array.isArray(per) && per.length === 4 && per.every((v: any) => v != null && isFinite(+v) && +v >= 0) && +per[0] <= 950 && +per[1] <= 100 && +per[2] <= 100 && +per[3] <= 100;
async function getJSON(u: string, ms = 7000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(u, { headers: { "User-Agent": OFF_UA, Accept: "application/json" }, signal: ctl.signal }); if (!r.ok) return { _status: r.status }; return await r.json(); }
  catch { return null; } finally { clearTimeout(t); }
}
async function lookupCode(code: string) {
  const row = (await sql`SELECT name, per, q, src, updated_at FROM foods WHERE code = ${code}`)[0];
  let per = row?.per; if (typeof per === "string") { try { per = JSON.parse(per); } catch { per = null; } }
  // remembered products (also "not found" for 2 days, so we don't hammer the service)
  if (row && (okPer(per) || Date.now() - new Date(row.updated_at).getTime() < 2 * 86400000)) return okPer(per) ? { n: row.name, per, q: row.q || "", src: row.src } : row.name ? { n: row.name, per: null, q: row.q || "" } : null;
  const codes = [code]; if (code.length === 12) codes.push("0" + code); if (code.length === 13 && code[0] === "0") codes.push(code.slice(1));
  let found: any = null, offline = false;
  for (const c of codes) {
    const j: any = await getJSON(`${OFF_BASE}/api/v2/product/${c}.json?fields=${OFF_FIELDS}`);
    if (!j) { offline = true; continue; }
    if (j.status === 1 && j.product) { found = offProduct({ ...j.product, code: c }); break; }
  }
  if (offline && !found) return { offline: true };
  const good = found && okPer(found.per);
  await sql`INSERT INTO foods (code, name, per, q, src) VALUES (${code}, ${found?.n || null}, ${good ? JSON.stringify(found.per) : null}::text::jsonb, ${found?.q || null}, ${good ? "off" : "none"})
    ON CONFLICT (code) DO UPDATE SET name = COALESCE(EXCLUDED.name, foods.name), per = EXCLUDED.per, q = EXCLUDED.q, src = EXCLUDED.src, updated_at = now() WHERE foods.src <> 'user'`;
  return found ? { n: found.n, per: good ? found.per : null, q: found.q, src: "off" } : null;
}
const searchCache = new Map<string, { t: number; items: any[] }>();
async function searchFoods(q: string) {
  const key = q.toLowerCase();
  const hit = searchCache.get(key); if (hit && Date.now() - hit.t < 6 * 3600000) return hit.items;
  const like = "%" + key.replace(/[%_]/g, "") + "%";
  const mine = await sql`SELECT code, name, per, q FROM foods WHERE per IS NOT NULL AND lower(name) LIKE ${like} ORDER BY (src = 'user') DESC, updated_at DESC LIMIT 15`;
  const items: any[] = mine.map((r: any) => ({ code: r.code, n: r.name, per: typeof r.per === "string" ? JSON.parse(r.per) : r.per, q: r.q || "" }));
  const seen = new Set(items.map((x) => x.code));
  const add = (arr: any[]) => { for (const pr of arr || []) { const p = offProduct(pr); if (p && p.n && okPer(p.per) && !seen.has(p.code)) { seen.add(p.code); items.push(p); } } };
  const enc = encodeURIComponent(q);
  const sal: any = await getJSON(`${SAL_BASE}/search?q=${enc}&page_size=40&langs=ru,en&fields=${OFF_FIELDS}`, 6000);
  if (sal && Array.isArray(sal.hits)) add(sal.hits);
  if (items.length < 8) {
    const cgi: any = await getJSON(`${OFF_BASE}/cgi/search.pl?search_terms=${enc}&search_simple=1&action=process&json=1&page_size=40&fields=${OFF_FIELDS}`, 8000);
    if (cgi && Array.isArray(cgi.products)) add(cgi.products);
  }
  const out = items.slice(0, 40);
  if (out.length) { searchCache.set(key, { t: Date.now(), items: out }); if (searchCache.size > 500) searchCache.delete(searchCache.keys().next().value!); }
  return out;
}

async function tgApi(method: string, body: Record<string, unknown>) {
  if (!TOKEN) return null;
  try {
    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const j: any = await r.json();
    if (!j.ok) console.error("tg", method, j.description);
    return j;
  } catch (e) { console.error("tg", method, e); return null; }
}

async function getCoach(): Promise<number | null> {
  const r = await sql`SELECT v FROM settings WHERE k = 'coach_chat_id'`;
  return r.length ? Number(r[0].v) : null;
}

const openBtn = (text = "Открыть FORM") => ({ inline_keyboard: [[{ text, web_app: { url: APP_URL } }]] });

// Проверка подписи initData по алгоритму Telegram
function verify(initData: string): any | null {
  if (!initData || !TOKEN) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  if (!hash) return null;
  p.delete("hash");
  const dcs = [...p.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(TOKEN).digest();
  const calc = createHmac("sha256", secret).update(dcs).digest("hex");
  if (calc.length !== hash.length || !timingSafeEqual(Buffer.from(calc), Buffer.from(hash))) return null;
  const authDate = Number(p.get("auth_date") || 0);
  if (Date.now() / 1000 - authDate > 7 * 86400) return null;
  try { return JSON.parse(p.get("user") || "null"); } catch { return null; }
}

async function upsertUser(u: any) {
  await sql`INSERT INTO users (tg_id, first_name, username) VALUES (${u.id}, ${u.first_name || null}, ${u.username || null})
    ON CONFLICT (tg_id) DO UPDATE SET first_name = EXCLUDED.first_name, username = EXCLUDED.username`;
}

const esc = (s: string) => String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
const who = (u: any) => `${esc(u.first_name || "Клиент")}${u.username ? " (@" + esc(u.username) + ")" : ""}`;

function ago(d: Date) {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return "только что";
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

async function clientsReport() {
  const rows = await sql`SELECT tg_id, first_name, username, meta, updated_at FROM users ORDER BY updated_at DESC LIMIT 50`;
  if (!rows.length) return "Пока нет клиентов. Отправь им ссылку на бота.";
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Minsk" });
  const lines = rows.map((r: any) => {
    const m = r.meta || {};
    const fresh = m.date === today;
    const quiet = Date.now() - new Date(r.updated_at).getTime() > 3 * 86400000;
    const parts = [
      m.goal ? `🎯 ${esc(m.goal)}` : "🎯 профиль не заполнен",
      fresh ? `🍽 ${m.mealsDone}/${m.mealsTotal}` : "🍽 сегодня без отметок",
      `🏋️ неделя ${m.trWeek ?? "—"}${fresh && m.trToday ? " · сегодня ✓" : ""}`,
      fresh && m.checkin ? "✅ чек-ин" : "",
      m.planB ? `🅑 План Б: ${esc(m.planB)}` : "",
      m.lvl ? `⭐ ур. ${m.lvl}` : "",
      fresh && m.steps ? `👣 ${m.steps}` : "",
      fresh && m.diaryK ? `📒 +${m.diaryK} ккал` : "",
      m.sep ? "раздельное" : "",
    ].filter(Boolean);
    return `${quiet ? "⚠️ " : ""}<b>${who(r)}</b> · ${ago(r.updated_at)}\n${parts.join(" · ")}`;
  });
  return `<b>Клиенты FORM</b> (${rows.length})\n⚠️ — нет активности 3+ дня, стоит уточнить, нужна ли помощь.\n\n${lines.join("\n\n")}`;
}

async function onUpdate(up: any) {
  const msg = up.message;
  if (!msg || !msg.chat || msg.chat.type !== "private") return;
  const text: string = msg.text || "";
  const from = msg.from;
  const coach = await getCoach();
  const isCoach = coach === msg.chat.id;

  if (text.startsWith("/start")) {
    await upsertUser(from);
    await tgApi("sendMessage", {
      chat_id: msg.chat.id, parse_mode: "HTML", reply_markup: openBtn("Начать свой путь →"),
      text: `<b>FORM</b> — персональная система питания, тренировок и прогресса.\n\nСобери свою форму. Без хаоса.\n\nНажми кнопку, чтобы открыть приложение. Вопрос тренеру можно написать прямо в приложении.\n\n<i>Разработка Александра Гурлени</i>`,
    });
    return;
  }
  if (text.startsWith("/coach")) {
    const code = text.split(/\s+/)[1] || "";
    if (COACH_CODE && code === COACH_CODE) {
      await sql`INSERT INTO settings (k, v) VALUES ('coach_chat_id', ${String(msg.chat.id)}) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v`;
      await tgApi("sendMessage", { chat_id: msg.chat.id, text: "Готово: этот аккаунт — тренер.\n\n/clients — сводка по клиентам\nЧтобы ответить клиенту, ответь (reply) на его сообщение." });
    } else {
      await tgApi("sendMessage", { chat_id: msg.chat.id, text: "Неверный код тренера." });
    }
    return;
  }
  if (text.startsWith("/clients")) {
    if (!isCoach) { await tgApi("sendMessage", { chat_id: msg.chat.id, text: "Команда доступна только тренеру." }); return; }
    await tgApi("sendMessage", { chat_id: msg.chat.id, parse_mode: "HTML", text: await clientsReport(), reply_markup: openBtn() });
    return;
  }
  if (text.startsWith("/notify_off") || text.startsWith("/notify_on")) {
    const on = text.startsWith("/notify_on");
    await upsertUser(from);
    await sql`UPDATE users SET notify = ${on} WHERE tg_id = ${from.id}`;
    await tgApi("sendMessage", { chat_id: msg.chat.id, text: on ? "Напоминания включены." : "Напоминания выключены. Включить снова: /notify_on" });
    return;
  }
  // Ответ тренера клиенту — reply на пересланное сообщение
  if (isCoach && msg.reply_to_message) {
    const src = (msg.reply_to_message.text || "") as string;
    const m = src.match(/#id(\d+)/);
    if (m && text) {
      const r = await tgApi("sendMessage", { chat_id: Number(m[1]), parse_mode: "HTML", text: `💬 <b>Ответ тренера</b>\n\n${esc(text)}`, reply_markup: openBtn() });
      await tgApi("sendMessage", { chat_id: msg.chat.id, text: r && r.ok ? "Отправлено клиенту ✓" : "Не удалось отправить: клиент мог заблокировать бота." });
      return;
    }
  }
  // Сообщение клиента в чат бота — переслать тренеру
  if (!isCoach && text && coach) {
    await upsertUser(from);
    await tgApi("sendMessage", { chat_id: coach, parse_mode: "HTML", text: `💬 <b>${who(from)}</b>\n\n${esc(text)}\n\n<i>Ответь на это сообщение, чтобы написать клиенту.</i> #id${from.id}` });
    await tgApi("sendMessage", { chat_id: msg.chat.id, text: "Передал тренеру. Ответ придёт сюда." });
    return;
  }
  await tgApi("sendMessage", { chat_id: msg.chat.id, text: "Открой приложение кнопкой ниже.", reply_markup: openBtn() });
}

// Настройка бота при старте
if (TOKEN && APP_URL) {
  const wh = await tgApi("setWebhook", { url: `${APP_URL}tg/${HOOK}`, secret_token: HOOK, allowed_updates: ["message"], drop_pending_updates: false });
  console.log("setWebhook:", JSON.stringify(wh));
  const me = await tgApi("getMe", {});
  console.log("bot:", me && me.ok ? "@" + me.result.username : JSON.stringify(me));
  setTimeout(async () => { const info = await tgApi("getWebhookInfo", {}); console.log("webhookInfo:", JSON.stringify(info && info.result)); }, 20000);
  await tgApi("setChatMenuButton", { menu_button: { type: "web_app", text: "FORM", web_app: { url: APP_URL } } });
  await tgApi("setMyCommands", { commands: [
    { command: "start", description: "Открыть FORM" },
    { command: "notify_off", description: "Выключить напоминания" },
    { command: "notify_on", description: "Включить напоминания" },
  ] });
  console.log("bot configured for", APP_URL);
} else {
  console.log("BOT_TOKEN is not set — bot is idle, app works in demo mode");
}

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

Bun.serve({
  port: Number(Bun.env.PORT || 3000),
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    try {
      if (req.method === "GET" && (path === "/" || path === "/index.html")) {
        return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" } });
      }
      if (req.method === "GET" && path === "/zxing.js" && ZXING) {
        return new Response(ZXING, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=604800" } });
      }
      if (path === "/health") return json({ ok: true, bot: !!TOKEN });

      if (HOOK && path === `/tg/${HOOK}` && req.method === "POST") {
        if (req.headers.get("x-telegram-bot-api-secret-token") !== HOOK) return new Response("forbidden", { status: 403 });
        const up: any = await req.json();
        console.log("update", up.update_id, up.message?.from?.id, (up.message?.text || "").slice(0, 20));
        onUpdate(up).catch((e) => console.error("update", e));
        return json({ ok: true });
      }

      if (path.startsWith("/api/")) {
        const user = verify(req.headers.get("x-init-data") || "");
        if (!user) return json({ error: "unauthorized" }, 401);
        if (path === "/api/state" && req.method === "GET") {
          await upsertUser(user);
          const r = await sql`SELECT state FROM users WHERE tg_id = ${user.id}`;
          let st = r[0]?.state || null;
          if (typeof st === "string") { try { st = JSON.parse(st); } catch { st = null; } }
          return json({ state: st });
        }
        if (path === "/api/state" && req.method === "POST") {
          const b: any = await req.json();
          const st = JSON.stringify(b.state ?? null);
          if (st.length > 200000) return json({ error: "too large" }, 413);
          await upsertUser(user);
          await sql`UPDATE users SET state = ${st}::text::jsonb, meta = ${JSON.stringify(b.meta ?? null)}::text::jsonb, updated_at = now() WHERE tg_id = ${user.id}`;
          return json({ ok: true });
        }
        if (path === "/api/food" && req.method === "GET") {
          const code = String(url.searchParams.get("code") || "").replace(/\D/g, "").slice(0, 14);
          if (code.length < 6) return json({ error: "bad code" }, 400);
          const p: any = await lookupCode(code);
          if (p && p.offline) return json({ offline: true });
          return json({ product: p });
        }
        if (path === "/api/food" && req.method === "POST") {
          const b: any = await req.json();
          const code = String(b.code || "").replace(/\D/g, "").slice(0, 14);
          const n = String(b.n || "").trim().slice(0, 120);
          const per = Array.isArray(b.per) ? b.per.map(r1) : null;
          if (code.length < 6 || !n || !okPer(per) || +per[1] + +per[2] + +per[3] > 105) return json({ error: "bad product" }, 400);
          await sql`INSERT INTO foods (code, name, per, q, src, by_id) VALUES (${code}, ${n}, ${JSON.stringify(per)}::text::jsonb, ${String(b.q || "").slice(0, 40)}, 'user', ${user.id})
            ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, per = EXCLUDED.per, q = EXCLUDED.q, src = 'user', by_id = EXCLUDED.by_id, updated_at = now() WHERE foods.src <> 'off'`;
          return json({ ok: true });
        }
        if (path === "/api/food/search" && req.method === "GET") {
          const q = String(url.searchParams.get("q") || "").trim().slice(0, 60);
          if (q.length < 2) return json({ items: [] });
          return json({ items: await searchFoods(q) });
        }
        if (path === "/api/message" && req.method === "POST") {
          const b: any = await req.json();
          const text = String(b.text || "").slice(0, 3000).trim();
          if (!text) return json({ error: "empty" }, 400);
          const coach = await getCoach();
          if (!coach) return json({ ok: false, error: "no coach" });
          const r = await tgApi("sendMessage", { chat_id: coach, parse_mode: "HTML", text: `💬 <b>${who(user)}</b> · из приложения\n\n${esc(text)}\n\n<i>Ответь на это сообщение, чтобы написать клиенту.</i> #id${user.id}` });
          return json({ ok: !!(r && r.ok) });
        }
      }
      return new Response("Not found", { status: 404 });
    } catch (e: any) {
      // the client closed the app while a request was still being sent — nothing to fix on our side
      if (e && (e.name === "AbortError" || /connection was closed/i.test(String(e.message)))) return new Response(null, { status: 499 });
      console.error(e);
      return json({ error: "server" }, 500);
    }
  },
});
console.log("FORM server listening");

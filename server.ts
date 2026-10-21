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

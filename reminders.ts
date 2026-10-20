// FORM — напоминания от героя. Запускается каждые 30 минут.
// В момент приёма пищи герой «проголодался» и просит покормить его (отметить еду),
// вечером — чек-ин, утром — поддержка тех, кто давно не заходил.
// Разработка Александра Гурлени.
import { sql } from "bun";

const TOKEN = (Bun.env.BOT_TOKEN || "").trim();
const APP_URL = (Bun.env.APP_URL || "").trim();
if (!TOKEN || !APP_URL) {
  console.log("BOT_TOKEN or APP_URL not set — nothing to do");
  process.exit(0);
}

await sql`CREATE TABLE IF NOT EXISTS reminder_log (tg_id BIGINT NOT NULL, k TEXT NOT NULL, at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY (tg_id, k))`;

const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Minsk", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).split(":");
const nowMin = Number(parts[0]) * 60 + Number(parts[1]);
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Minsk" });
const inWindow = (hhmm: string) => { const m = Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5)); return m <= nowMin && m > nowMin - 30; };
const btn = (text: string) => ({ inline_keyboard: [[{ text, web_app: { url: APP_URL } }]] });
const MEAL: Record<string, string> = { "ЗАВТРАК": "завтрак", "ОБЕД": "обед", "ПЕРЕКУС": "перекус", "УЖИН": "ужин" };

async function once(id: number, key: string) {
  const r = await sql`INSERT INTO reminder_log (tg_id, k) VALUES (${id}, ${key}) ON CONFLICT DO NOTHING RETURNING k`;
  return r.length > 0;
}
async function send(id: number, text: string, b: string) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: id, text, reply_markup: btn(b) }),
  });
  const j: any = await r.json();
  if (!j.ok && j.error_code === 403) await sql`UPDATE users SET notify = FALSE WHERE tg_id = ${id}`;
  return !!j.ok;
}

const users = await sql`SELECT tg_id, first_name, meta, updated_at FROM users WHERE notify = TRUE`;
let sent = 0;
for (const u of users as any[]) {
  const id = Number(u.tg_id);
  const m = u.meta || {};
  const quietDays = Math.floor((Date.now() - new Date(u.updated_at).getTime()) / 86400000);
  const hero = m.hero || (m.g === "f" ? "Твоя героиня" : "Твой герой");
  const fem = m.g === "f";
  try {
    // 1) приёмы пищи — герой проголодался
    if (quietDays < 7 && Array.isArray(m.slots)) {
      for (const sl of m.slots) {
        if (!sl || !sl.t || !inWindow(sl.t)) continue;
        const eaten = m.date === today && sl.e;
        if (eaten) continue;
        const meal = MEAL[sl.l] || "еда";
        if (await once(id, `meal:${today}:${sl.t}`)) {
          const text = `🍽 ${hero} ${fem ? "проголодалась" : "проголодался"}! Время: ${meal} (${sl.t}).\n\nПокорми ${fem ? "её" : "его"} — отметь приём пищи в FORM. Чем точнее питание, тем быстрее ${fem ? "она" : "он"} меняется.`;
          if (await send(id, text, "Покормить")) sent++;
        }
      }
    }
    // 1b) вода — если отстаёт от графика (10/12/14/16/18), но не одновременно с едой
    let mealNow = Array.isArray(m.slots) && m.slots.some((sl: any) => sl && sl.t && inWindow(sl.t));
    for (const wt of ["10:00", "12:00", "14:00", "16:00", "18:00"]) {
      if (!inWindow(wt) || mealNow || quietDays >= 3) continue;
      const h = Number(wt.slice(0, 2));
      const expected = Math.max(1, Math.min(8, Math.floor((h * 60 - 480) / 90) + 1));
      const water = m.date === today ? Number(m.water || 0) : 0;
      if (water >= expected - 1) continue;
      if (await once(id, `water:${today}:${wt}`)) {
        const text = `💧 ${hero} ${fem ? "хочет" : "хочет"} пить! Сегодня выпито ${water} из 8 стаканов.\n\nВыпей стакан воды и отметь его в FORM.`;
        if (await send(id, text, "Отметить стакан")) sent++;
      }
    }
    // 2) вечерний чек-ин в 20:00
    if (inWindow("20:00") && quietDays < 3 && !(m.date === today && m.checkin)) {
      if (await once(id, `checkin:${today}`)) {
        if (await send(id, `🌙 ${hero} ждёт вечерний чек-ин: как прошёл день? Это займёт минуту.`, "Вечерний чек-ин")) sent++;
      }
    }
    // 3) мягкое возвращение в 10:00, если давно не заходил
    if (inWindow("10:00") && quietDays >= 3 && quietDays <= 9 && quietDays % 3 === 0) {
      if (await once(id, `back:${today}`)) {
        if (await send(id, `💚 ${hero} скучает. Хочешь вернуться к плану? Давай начнём с одного простого шага.`, "Вернуться")) sent++;
      }
    }
    // 4) доброе утро новичкам без расписания приёмов
    if (inWindow("09:00") && quietDays < 3 && !(Array.isArray(m.slots) && m.slots.length)) {
      if (await once(id, `morning:${today}`)) {
        if (await send(id, `Доброе утро${u.first_name ? ", " + u.first_name : ""}! Твой план на сегодня готов.`, "Мой план")) sent++;
      }
    }
  } catch (e) { console.error(id, e); }
  await Bun.sleep(60);
}
console.log(`reminders ${String(Math.floor(nowMin / 60)).padStart(2, "0")}:${String(nowMin % 60).padStart(2, "0")} — sent ${sent} of ${users.length}`);
process.exit(0);

// FORM — напоминания (запускается по расписанию: 09:00 и 20:00 по Минску).
// Разработка Александра Гурлени.
import { sql } from "bun";

const TOKEN = (Bun.env.BOT_TOKEN || "").trim();
const APP_URL = (Bun.env.APP_URL || "").trim();
if (!TOKEN || !APP_URL) {
  console.log("BOT_TOKEN or APP_URL not set — nothing to do");
  process.exit(0);
}

const hour = Number(new Date().toLocaleString("en-GB", { timeZone: "Europe/Minsk", hour: "2-digit", hour12: false }));
const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Minsk" });
const morning = hour < 14;
const btn = (text: string) => ({ inline_keyboard: [[{ text, web_app: { url: APP_URL } }]] });

const users = await sql`SELECT tg_id, first_name, meta, updated_at FROM users WHERE notify = TRUE`;
let sent = 0;
for (const u of users as any[]) {
  const m = u.meta || {};
  const quietDays = Math.floor((Date.now() - new Date(u.updated_at).getTime()) / 86400000);
  let text = "";
  let b = "Открыть FORM";
  if (morning) {
    if (quietDays >= 3 && quietDays <= 9 && quietDays % 3 === 0) {
      text = "Хочешь вернуться к плану? Давай начнём с одного простого шага 💚";
      b = "Вернуться";
    } else if (quietDays < 3) {
      text = `Доброе утро${u.first_name ? ", " + u.first_name : ""}! Твой план на сегодня готов.`;
      b = "Мой план";
    }
  } else if (quietDays < 3 && !(m.date === today && m.checkin)) {
    text = "Как прошёл день? Отметь питание и самочувствие — это займёт минуту.";
    b = "Вечерний чек-ин";
  }
  if (!text) continue;
  try {
    const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: Number(u.tg_id), text, reply_markup: btn(b) }),
    });
    const j: any = await r.json();
    if (j.ok) sent++;
    else if (j.error_code === 403) await sql`UPDATE users SET notify = FALSE WHERE tg_id = ${u.tg_id}`;
  } catch (e) { console.error(e); }
  await Bun.sleep(60);
}
console.log(`reminders (${morning ? "morning" : "evening"}): sent ${sent} of ${users.length}`);
process.exit(0);

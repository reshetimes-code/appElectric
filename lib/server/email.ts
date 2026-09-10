import nodemailer from "nodemailer";
import type { CustomerOrder } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

// Sends the "new order" email to the admin inbox via Gmail SMTP. Requires
// SMTP_USER (a Gmail address) + SMTP_PASS (an "App Password" for that
// account — https://myaccount.google.com/apppasswords, not the regular Gmail
// password) in the environment. Without them, sending is skipped and a
// warning is logged — the order itself is never blocked by email delivery.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[email] SMTP_USER/SMTP_PASS not set — skipping email "${opts.subject}" to ${opts.to}`);
    return;
  }
  try {
    await t.sendMail({
      from: `"AppElectric" <${process.env.SMTP_USER}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
  } catch (err) {
    // Never let an email failure surface to the customer placing the order.
    console.error("[email] failed to send:", err);
  }
}

/** Fire-and-forget: notifies the admin inbox that a customer just placed an order. */
export function sendNewOrderEmail(order: CustomerOrder, productNames: Map<string, string>) {
  const to = process.env.ADMIN_NOTIFY_EMAIL || "okpedi@gmail.com";
  const lineLabel = (line: CustomerOrder["lines"][number]) => productNames.get(line.productId) ?? "מוצר לא ידוע";
  const itemsText = order.lines.map((line) => `  • ${line.quantity} × ${lineLabel(line)}`).join("\n");
  const itemsHtml = order.lines.map((line) => `<li>${line.quantity} × ${lineLabel(line)}</li>`).join("");

  const text = [
    `התקבלה הזמנה חדשה: ${order.orderNumber}`,
    `לקוח: ${order.customer.name} | ${order.customer.phone}`,
    order.customer.email ? `אימייל: ${order.customer.email}` : "",
    `כתובת: ${order.customer.address}, ${order.customer.city}`,
    `אופן משלוח: ${order.deliveryOption}`,
    `סה"כ: ${formatPrice(order.subtotal)}`,
    "",
    "פריטים:",
    itemsText,
    order.notes ? `\nהערות: ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 15px; color: #1f1b16;">
      <h2 style="margin: 0 0 12px;">🛒 הזמנה חדשה: ${order.orderNumber}</h2>
      <p style="margin: 0 0 4px;"><b>לקוח:</b> ${order.customer.name} — ${order.customer.phone}</p>
      ${order.customer.email ? `<p style="margin: 0 0 4px;"><b>אימייל:</b> ${order.customer.email}</p>` : ""}
      <p style="margin: 0 0 4px;"><b>כתובת:</b> ${order.customer.address}, ${order.customer.city}</p>
      <p style="margin: 0 0 4px;"><b>אופן משלוח:</b> ${order.deliveryOption}</p>
      <p style="margin: 0 0 12px;"><b>סה"כ:</b> ${formatPrice(order.subtotal)}</p>
      <p style="margin: 0 0 4px;"><b>פריטים:</b></p>
      <ul style="margin: 0 0 12px; padding-inline-start: 1.25em;">${itemsHtml}</ul>
      ${order.notes ? `<p style="margin: 0 0 12px;"><b>הערות:</b> ${order.notes}</p>` : ""}
      <p style="color: #6b6259; font-size: 13px;">נשלח אוטומטית ממערכת AppElectric.</p>
    </div>
  `;

  return sendMail({ to, subject: `הזמנה חדשה באתר — ${order.orderNumber}`, html, text });
}

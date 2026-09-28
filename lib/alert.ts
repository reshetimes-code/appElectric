import Swal from "sweetalert2";
import { toWhatsappNumber } from "@/lib/utils";

// Central SweetAlert2 wrapper, themed to match the site (RTL, brand colors,
// same corner radius as cards/buttons) — used everywhere the app used to
// fall back to a native alert()/confirm() or a small inline red-text notice.
const base = Swal.mixin({
  confirmButtonColor: "var(--color-brand-600)",
  cancelButtonColor: "var(--color-charcoal-400, #9c9188)",
  buttonsStyling: true,
  customClass: {
    popup: "!rounded-[1rem] !font-[inherit]",
    confirmButton: "!rounded-[0.625rem]",
    cancelButton: "!rounded-[0.625rem]",
  },
  didOpen: (popup) => {
    popup.setAttribute("dir", "rtl");
  },
});

export function showError(message: string, title = "שגיאה") {
  return base.fire({ icon: "error", title, text: message, confirmButtonText: "הבנתי" });
}

export function showSuccess(message: string, title = "בוצע בהצלחה") {
  return base.fire({ icon: "success", title, text: message, confirmButtonText: "מעולה", timer: 2500, timerProgressBar: true });
}

/** One consolidated popup listing every field that failed validation. */
export function showValidationErrors(messages: string[], title = "יש לתקן כמה שדות") {
  return base.fire({
    icon: "warning",
    title,
    html: `<ul style="text-align:start;margin:0;padding-inline-start:1.25em;display:flex;flex-direction:column;gap:.25em;">${messages
      .map((m) => `<li>${m}</li>`)
      .join("")}</ul>`,
    confirmButtonText: "הבנתי",
  });
}

/**
 * Admin-only: pops up when a new customer order is detected (see
 * components/admin/OrderNotificationBell.tsx). Unlike showSuccess it doesn't
 * auto-dismiss — it's reporting something that just happened elsewhere, not
 * confirming an action the admin took, so it should stay until acknowledged.
 * Resolves true if the admin clicked through to view the order.
 */
export async function notifyNewOrder(opts: { orderNumber: string; customerName: string; total: string }) {
  const result = await base.fire({
    icon: "info",
    title: "התקבלה הזמנה חדשה! 🛒",
    html: `<div style="text-align:start">
      <p style="margin:0 0 .25em"><b>מספר הזמנה:</b> ${opts.orderNumber}</p>
      <p style="margin:0 0 .25em"><b>לקוח:</b> ${opts.customerName}</p>
      <p style="margin:0"><b>סה"כ:</b> ${opts.total}</p>
    </div>`,
    confirmButtonText: "צפייה בהזמנה",
    showCancelButton: true,
    cancelButtonText: "סגור",
    reverseButtons: true,
  });
  return result.isConfirmed;
}

/**
 * Popup offering a choice of webmail providers to compose in, since a plain
 * mailto: link silently does nothing on a machine with no desktop mail client
 * configured (the common case once Gmail/Outlook are used via the browser).
 *
 * `pdfHref`, if given, adds a "download PDF" link (opening the PO document
 * with auto-print, see AutoPrint.tsx) so the order can be attached to
 * whichever compose window was opened. No compose link (mailto or any
 * webmail deep-link) can pre-attach a file — browsers don't allow it — so
 * this is necessarily a separate, manual step; the popup says so.
 */
export function showEmailProviderChooser(to: string, subject: string, body: string, pdfHref?: string) {
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const composeOptions: { label: string; href: string }[] = [
    { label: "Gmail", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}` },
    { label: "Outlook", href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}` },
    { label: "אפליקציית מייל במחשב", href: `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}` },
  ];
  const linkStyle =
    "display:block;padding:.7em 1em;border-radius:0.625rem;border:1px solid var(--color-sand-300,#e2cca4);text-decoration:none;color:var(--color-charcoal-900,#1c150f);font-weight:500;";
  const composeHtml = composeOptions.map((o) => `<a href="${o.href}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${o.label}</a>`).join("");
  const pdfHtml = pdfHref
    ? `<a href="${pdfHref}" target="_blank" rel="noopener noreferrer" style="${linkStyle}border-color:var(--color-brand-600,#3a701e);color:var(--color-brand-700,#2f591a);">הורדת ההזמנה כ-PDF (לצירוף ידני)</a>`
    : "";
  const note = pdfHref
    ? `<p style="margin:.8em 0 0;font-size:.75rem;color:var(--color-charcoal-500,#63533f);">דפדפנים לא מאפשרים צירוף קובץ אוטומטי להודעת מייל — הורידו את ה-PDF ואז צרפו אותו ידנית בחלון הכתיבה שנפתח.</p>`
    : "";
  return base.fire({
    title: "שליחה באמצעות",
    html: `<div style="display:flex;flex-direction:column;gap:.6em;text-align:start;">${composeHtml}${pdfHtml}</div>${note}`,
    showConfirmButton: false,
    showCloseButton: true,
  });
}

/**
 * Popup for picking who to WhatsApp a message to: any contact from `recipients`
 * (e.g. every supplier, not just the one this document was created for), or a
 * number typed in on the spot. Each pre-set recipient is a plain wa.me link;
 * the manual field needs a click handler to read its value, wired in didOpen.
 */
export function showWhatsappRecipientChooser(recipients: { label: string; whatsapp: string }[], text: string) {
  const encodedText = encodeURIComponent(text);
  const linkStyle =
    "display:block;padding:.7em 1em;border-radius:0.625rem;border:1px solid var(--color-sand-300,#e2cca4);text-decoration:none;color:var(--color-charcoal-900,#1c150f);font-weight:500;";
  const recipientsHtml = recipients
    .filter((r) => r.whatsapp.trim())
    .map((r) => `<a href="https://wa.me/${toWhatsappNumber(r.whatsapp)}?text=${encodedText}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${r.label}</a>`)
    .join("");
  return base.fire({
    title: "שליחה בוואטסאפ אל",
    html: `
      <div style="display:flex;flex-direction:column;gap:.6em;text-align:start;">
        ${recipientsHtml}
      </div>
      <div style="margin-top:1em;padding-top:1em;border-top:1px solid var(--color-sand-200,#f0e3cd);text-align:start;">
        <label style="display:block;font-size:.75rem;color:var(--color-charcoal-500,#63533f);margin-bottom:.4em;">או הזינו מספר ידנית</label>
        <div style="display:flex;gap:.5em;">
          <input id="wa-manual-number" type="tel" dir="ltr" placeholder="0501234567" style="flex:1;min-width:0;height:2.75rem;padding:0 .75em;border-radius:0.625rem;border:1px solid var(--color-sand-300,#e2cca4);font:inherit;" />
          <button id="wa-manual-open" type="button" style="height:2.75rem;padding:0 1em;border-radius:0.625rem;border:none;background:var(--color-brand-600,#3a701e);color:#fff;font-weight:500;cursor:pointer;">פתיחת צ'אט</button>
        </div>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    didOpen: (popup) => {
      popup.setAttribute("dir", "rtl");
      const input = popup.querySelector<HTMLInputElement>("#wa-manual-number");
      const button = popup.querySelector<HTMLButtonElement>("#wa-manual-open");
      const open = () => {
        const number = toWhatsappNumber(input?.value ?? "");
        if (!number) return;
        window.open(`https://wa.me/${number}?text=${encodedText}`, "_blank");
        Swal.close();
      };
      button?.addEventListener("click", open);
      input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          open();
        }
      });
    },
  });
}

/** Replaces window.confirm() for a destructive action; resolves true if the user confirmed. */
export async function confirmDelete(message: string, title = "לאשר מחיקה?") {
  const result = await base.fire({
    icon: "warning",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: "כן, למחוק",
    cancelButtonText: "ביטול",
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
  });
  return result.isConfirmed;
}

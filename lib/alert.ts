import Swal from "sweetalert2";

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
 */
export function showEmailProviderChooser(to: string, subject: string, body: string) {
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const options: { label: string; href: string }[] = [
    { label: "Gmail", href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}` },
    { label: "Outlook", href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}` },
    { label: "אפליקציית מייל במחשב", href: `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}` },
  ];
  return base.fire({
    title: "שליחה באמצעות",
    html: `<div style="display:flex;flex-direction:column;gap:.6em;text-align:start;">${options
      .map(
        (o) =>
          `<a href="${o.href}" target="_blank" rel="noopener noreferrer" style="display:block;padding:.7em 1em;border-radius:0.625rem;border:1px solid var(--color-sand-300,#e2cca4);text-decoration:none;color:var(--color-charcoal-900,#1c150f);font-weight:500;">${o.label}</a>`,
      )
      .join("")}</div>`,
    showConfirmButton: false,
    showCloseButton: true,
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

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

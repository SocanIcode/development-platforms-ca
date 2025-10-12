// /src/js/ui/feedback.js
let alertRoot = null;
function ensureRoot() {
  if (!alertRoot) alertRoot = document.getElementById("alerts");
  return alertRoot;
}

const base =
  "rounded-lg px-4 py-2 shadow-md text-sm max-w-sm border transition";

export function toastSuccess(msg = "Success") {
  const r = ensureRoot();
  if (!r) return alert(msg);
  const el = document.createElement("div");
  el.className = `${base} bg-green-50 border-green-300 text-green-800`;
  el.textContent = msg;
  r.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

export function toastError(msg = "Something went wrong") {
  const r = ensureRoot();
  if (!r) return alert(msg);
  const el = document.createElement("div");
  el.className = `${base} bg-red-50 border-red-300 text-red-800`;
  el.textContent = msg;
  r.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

/** Show or create a small error line inside a form */
export function showFormError(form, msg) {
  if (!form) return toastError(msg);
  let p = form.querySelector('[data-role="form-error"]');
  if (!p) {
    p = document.createElement("p");
    p.setAttribute("data-role", "form-error");
    p.className = "mt-2 text-sm text-red-600";
    form.appendChild(p);
  }
  p.textContent = msg || "Something went wrong";
}

/** Clear inline form error */
export function clearFormError(form) {
  const p = form?.querySelector?.('[data-role="form-error"]');
  if (p) p.textContent = "";
}

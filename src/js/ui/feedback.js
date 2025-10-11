function makeToast(text, type = "success") {
  const el = document.createElement("div");
  el.textContent = text;
  el.className = `toast ${type === "error" ? "toast-error" : "toast-success"}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

export function toastSuccess(text) {
  makeToast(text, "success");
}
export function toastError(text) {
  makeToast(text, "error");
}

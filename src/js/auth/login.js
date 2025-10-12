import {
  toastError,
  toastSuccess,
  showFormError,
  clearFormError,
} from "../ui/feedback.js";
import { supabase } from "../lib/supabaseClient.js";

export function bindLoginForm(formId = "loginForm") {
  const form = document.getElementById(formId);
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormError(form);

    const fd = new FormData(form);
    const email = fd.get("email");
    const password = fd.get("password");

    if (!email || !password)
      return showFormError(form, "Email and password are required.");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return showFormError(form, error.message);
      toastSuccess("Logged in!");
      setTimeout(() => (window.location.href = "/index.html"), 500);
    } catch (err) {
      showFormError(form, err.message || "Failed to login");
    }
  });
}

import {
  toastError,
  toastSuccess,
  showFormError,
  clearFormError,
} from "../ui/feedback.js";
import { supabase } from "../lib/supabaseClient.js";

export function bindRegisterForm(formId = "registerForm") {
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
      const emailRedirectTo = `${window.location.origin}/src/login.html`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (error) return showFormError(form, error.message);

      toastSuccess("Registration submitted. Check your email to confirm.");
      form.reset();
    } catch (err) {
      showFormError(form, err.message || "Failed to register");
    }
  });
}

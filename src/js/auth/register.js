// register.js
import { supabase } from "../lib/supabaseClient.js";
import { toastError, toastSuccess } from "../ui/feedback.js";

export function bindRegisterForm(formId = "registerForm") {
  const form = document.getElementById(formId);
  if (!form || form.dataset.bound) return; // <-- prevents duplicate listeners
  form.dataset.bound = "1";

  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // prevent double submit
    submitBtn?.setAttribute("disabled", "true");

    const fd = new FormData(form);
    const name = fd.get("name");
    const email = fd.get("email")?.trim();
    const password = fd.get("password");

    const emailRedirectTo = "http://localhost:5174/src/login.html";
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo },
      });

      if (error) {
        toastError(error.message);
        submitBtn?.removeAttribute("disabled");
        return;
      }

      toastSuccess("✅ Registration successful! Check your email to confirm.");
      form.reset();

      setTimeout(
        () => (window.location.href = "http://localhost:5174/src/login.html"),
        2000
      );
    } catch (err) {
      toastError(err.message || "Sign-up failed");
      submitBtn?.removeAttribute("disabled");
    }
  });
}

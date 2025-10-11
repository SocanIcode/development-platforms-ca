import { supabase } from "../lib/supabaseClient.js";
import { toastError, toastSuccess } from "../ui/feedback.js";

export function bindLoginForm(formId = "loginForm") {
  const form = document.getElementById(formId);
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = fd.get("email")?.toString().trim();
    const password = fd.get("password");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return toastError(error.message);

    toastSuccess("Logged in!");
    // redirect handled by onAuthStateChange in loginPage.js
  });
}

import { bindLoginForm } from "../auth/login.js";
import { supabase } from "../lib/supabaseClient.js";

export async function loadLoginPage() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    location.replace("/index.html");
    return;
  }

  // Navigate after real sign-in event
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") location.replace("/index.html");
  });

  bindLoginForm("loginForm");
}

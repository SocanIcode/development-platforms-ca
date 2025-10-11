import { supabase } from "../lib/supabaseClient.js";

function toggle(sel, show) {
  document
    .querySelectorAll(sel)
    .forEach((el) => el.classList.toggle("hidden", !show));
}
function applyAuthUI(isIn) {
  toggle("[data-auth='logged-in']", isIn);
  toggle("[data-auth='logged-out']", !isIn);
}

export async function initAuthState() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  applyAuthUI(!!session);

  supabase.auth.onAuthStateChange((_evt, s) => applyAuthUI(!!s));

  // bind logout *after* DOM exists
  const btn = document.getElementById("logoutBtn");
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = "1";
    btn.addEventListener("click", async () => {
      await supabase.auth.signOut({ scope: "global" });
      await new Promise((r) => setTimeout(r, 50));
      location.replace("/src/login.html");
    });
  }
}

export async function requireAuthOrRedirect(loginHref = "/src/login.html") {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    location.replace(loginHref);
    return null;
  }
  return session;
}

export async function redirectIfAuthenticated(target = "/index.html") {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) location.replace(target);
}

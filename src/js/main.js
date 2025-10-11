import { supabase } from "./lib/supabaseClient.js";
import { initAuthState } from "./auth/authState.js";
import { loadHome } from "./pages/home.js";
import { loadArticlePage } from "./pages/articlePage.js";
import { loadCreate } from "./pages/create.js";
import { loadLoginPage } from "./pages/loginPage.js";
import { loadRegisterPage } from "./pages/registerPage.js";
import { loadAccountPage } from "./pages/account.js";

function initialsFrom(nameOrEmail = "") {
  const s = (nameOrEmail || "").trim();
  const base = s.includes("@") ? s.split("@")[0] : s;
  const parts = base.split(/\s+/).filter(Boolean);
  const letters =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : base.slice(0, 2);
  return letters.toUpperCase();
}

async function enhanceNavbar() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const nameEl = document.getElementById("navName");
  const imgEl = document.getElementById("navAvatar");
  const initEl = document.getElementById("navInitials");

  [imgEl, initEl].forEach((el) => el?.classList.add("hidden"));
  if (nameEl) nameEl.textContent = "";

  if (!user) return; // logged out

  const display = user.user_metadata?.name || user.email;
  if (nameEl) nameEl.textContent = display;

  const avatar = user.user_metadata?.avatar_url;
  if (avatar && imgEl) {
    imgEl.src = avatar;
    imgEl.classList.remove("hidden");
  } else if (initEl) {
    initEl.textContent = initialsFrom(display);
    initEl.classList.remove("hidden");
  }
}

function currentFile() {
  return decodeURI(location.pathname).split("/").pop() || "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAuthState();
  await enhanceNavbar();
  supabase.auth.onAuthStateChange(() => enhanceNavbar());

  switch (currentFile()) {
    case "index.html":
      await loadHome();
      break;
    case "article.html":
      await loadArticlePage();
      break;
    case "create.html":
      await loadCreate();
      break;
    case "login.html":
      await loadLoginPage();
      break;
    case "register.html":
      await loadRegisterPage();
      break;
    case "account.html":
      await loadAccountPage();
      break;
  }
});

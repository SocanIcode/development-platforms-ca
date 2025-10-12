import { safeRun } from "../api/helpers.js";
import { toastSuccess } from "../ui/feedback.js";
import { supabase } from "../lib/supabaseClient.js";
import { requireAuthOrRedirect } from "../auth/authState.js";

export async function loadCreate() {
  await safeRun(async () => {
    const session = await requireAuthOrRedirect("/src/login.html");
    if (!session) return;

    const form = document.getElementById("createForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = fd.get("title")?.trim();
      const content = fd.get("content")?.trim();

      await safeRun(async () => {
        const { data } = await supabase
          .from("articles")
          .insert([{ title, content }])
          .select("id,title,content,author_id,created_at")
          .single();

        toastSuccess("Article created!");
        form.reset();
        setTimeout(() => (window.location.href = "/index.html"), 500);
      }, "Failed to create article");
    });
  });
}

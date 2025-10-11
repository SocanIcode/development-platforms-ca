import { requireAuthOrRedirect } from "../auth/authState.js";
import { supabase } from "../lib/supabaseClient.js";
import { toastError, toastSuccess } from "../ui/feedback.js";

export async function loadCreate() {
  const session = await requireAuthOrRedirect("/src/login.html");
  if (!session) return;

  const form = document.getElementById("createForm");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  const imageEl = document.getElementById("imageFile");
  const previewEl = document.getElementById("imagePreview");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const title = fd.get("title")?.toString().trim();
    const content = fd.get("content")?.toString().trim();

    // Quick log to confirm reads
    console.log("[create] values:", { title, content });

    if (!title || !content) return toastError("Please fill all fields");

    let image_url = null;

    // Optional upload (skip cleanly if bucket/column not ready)
    const file = imageEl?.files?.[0];
    if (file) {
      try {
        const path = `${session.user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from("article-images")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage
          .from("article-images")
          .getPublicUrl(path);
        image_url = pub.publicUrl;
      } catch (upErr) {
        console.warn(
          "[create] image upload failed (skipping):",
          upErr?.message || upErr
        );

        image_url = null;
      }
    }

    try {
      const row = { title, content };
      if (image_url) row.image_url = image_url;

      const selectCols =
        "id,title,content,author_id,created_at" +
        (image_url ? ",image_url" : "");

      const { data, error } = await supabase
        .from("articles")
        .insert([row])
        .select(selectCols)
        .single();

      if (error) throw error;

      toastSuccess("Article created!");
      form.reset();
      previewEl?.classList?.add("hidden");

      setTimeout(() => location.replace("/index.html"), 300);
    } catch (err) {
      console.error("[create] insert error", err);
      toastError(err.message || "Failed to create article");
    }
  });
}

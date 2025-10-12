import { supabase } from "../lib/supabaseClient.js";
import { toastError } from "../ui/feedback.js";

export async function loadArticlePage() {
  const root = document.getElementById("articleView");
  if (!root) return;

  const id = new URL(location.href).searchParams.get("id");
  if (!id) {
    root.innerHTML = "<p>Article not found.</p>";
    return;
  }

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("id,title,content,image_url,author_id,created_at")
      .eq("id", id)
      .single();

    if (error) throw error;

    const date = new Date(data.created_at).toLocaleString();

    const img = data.image_url
      ? `
      <div class="flex justify-center mb-6">
        <img 
          src="${data.image_url}" 
          alt="cover" 
          class="max-w-2xl w-full rounded-xl shadow-md object-cover"
        />
      </div>`
      : "";
    const cat = data.category
      ? `<span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">${escapeHtml(
          data.category
        )}</span>`
      : "";

    root.innerHTML = `
      <div class="max-w-2xl mx-auto px-4">
        <h1 class="text-3xl font-bold mb-3 text-gray-900 text-center">
          ${escapeHtml(data.title)}
        </h1>

        <div class="text-sm text-gray-500 mb-6 text-center">
          ${date}
        </div>

        ${img}

        <div class="text-gray-800 leading-relaxed whitespace-pre-wrap text-justify">
          ${escapeHtml(data.content ?? "")}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    toastError(err.message || "Failed to load article");
    root.innerHTML = "<p>Unable to load article.</p>";
  }
}

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

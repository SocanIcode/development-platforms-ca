import { listArticles } from "../api/articles.js";
import { renderArticles } from "../ui/renderArticles.js";
import { toastError } from "../ui/feedback.js";

export async function loadHome() {
  const root = document.getElementById("articlesList"); // ← match your HTML
  if (!root) {
    console.warn("[home] #articlesList not found");
    return;
  }

  try {
    // handle
    const items = await listArticles();
    renderArticles(root, items ?? []);
  } catch (e) {
    console.error(e);
    toastError(e.message || "Failed to load articles");
  }
}

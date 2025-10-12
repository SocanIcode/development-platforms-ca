// /src/js/pages/account.js
import { requireAuthOrRedirect } from "../auth/authState.js";
import { supabase } from "../lib/supabaseClient.js";
import {
  listMyArticles,
  updateArticle,
  deleteArticle,
} from "../api/articles.js";
import { toastError, toastSuccess } from "../ui/feedback.js";

let CURRENT = null; // currently edited article
let openModal; // shared modal opener reference

export async function loadAccountPage() {
  const session = await requireAuthOrRedirect("/src/login.html");
  if (!session) return;

  try {
    const items = await listMyArticles(session.user.id);
    renderMyArticles(items);
    bindListActions(session.user.id);
    bindModal(session.user.id);
  } catch (e) {
    console.error(e);
    toastError(e.message || "Failed to load your articles");
  }
}

/* ----------------------- Render article cards ----------------------- */
function renderMyArticles(list) {
  const root = document.getElementById("myArticles");
  if (!root) return;

  if (!list?.length) {
    root.innerHTML = `<p class="text-gray-500">You haven’t posted anything yet.</p>`;
    return;
  }

  root.innerHTML = list.map((a) => cardHtml(a)).join("");
}

function cardHtml(a) {
  const img = a.image_url
    ? `<img src="${esc(
        a.image_url
      )}" class="w-full h-40 object-cover rounded-lg mb-3" alt="cover" />`
    : "";
  const date = new Date(a.created_at).toLocaleString();

  return `
    <article data-id="${a.id}" 
              class="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-8"
>
      ${img}
      <div class="max-w-xl mx-auto  p-8 space-y-8"">
        <div class="min-w-0">
          <h3 class="text-center text-2xl font-bold text-[#191819] mb-4">${esc(
            a.title
          )}</h3>
           <div class="mt-2 text-xs text-gray-500">${date}</div>
          <p class="block text-md  justify font-medium text-gray-700">${esc(
            a.content || ""
          )}</p>
        </div>
        <div class="flex items-center gap-4">
          <button type="button" 
           class="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-100 px-6 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-600"
            data-action="edit">Edit</button>
          <button type="button" 
            class="px-3 py-1 rounded bg-red-600 text-white" 
            data-action="delete">Delete</button>
        </div>
      </div>
     
    </article>
  `;
}

/* ----------------------- Edit & Delete logic ----------------------- */
function bindListActions(userId) {
  const root = document.getElementById("myArticles");
  if (!root || root.dataset.bound) return;
  root.dataset.bound = "1";

  root.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const card = btn.closest("article");
    const id = card?.dataset?.id;
    if (!id) return;

    const action = btn.dataset.action;

    // 🟣 EDIT
    if (action === "edit") {
      const title = card.querySelector("h3")?.textContent || "";
      const content = card.querySelector("p")?.textContent || "";
      const imgEl = card.querySelector("img");
      const image_url = imgEl ? imgEl.src : null;

      CURRENT = { id, title, content, image_url };
      openModal?.(CURRENT); // call shared modal function
    }

    // 🔴 DELETE
    if (action === "delete") {
      if (!confirm("Delete this article?")) return;
      btn.disabled = true;
      try {
        await deleteArticle(id);
        card.remove();
        toastSuccess("Deleted");
        if (!root.children.length) {
          root.innerHTML = `<p class="text-gray-500">You haven’t posted anything yet.</p>`;
        }
      } catch (e3) {
        console.error(e3);
        toastError(e3.message || "Delete failed");
      } finally {
        btn.disabled = false;
      }
    }
  });
}

/* ----------------------- Modal logic ----------------------- */
function bindModal(userId) {
  const modal = document.getElementById("editModal");
  const form = document.getElementById("editForm");
  const closeBtn = document.getElementById("editClose");
  const cancelBtn = document.getElementById("editCancel");
  const fileEl = document.getElementById("editImageFile");
  const previewEl = document.getElementById("editPreview");
  const removeChk = document.getElementById("editRemoveImage");
  const backdrop = document.getElementById("editBackdrop");

  if (!modal || !form) {
    console.error("Modal or form not found in DOM");
    return;
  }

  //  Show/Hide helpers
  const hide = () => {
    modal.classList.add("hidden");
    form.reset();
    previewEl.classList.add("hidden");
    CURRENT = null;
  };
  const show = () => modal.classList.remove("hidden");

  //  Live preview
  fileEl?.addEventListener("change", () => {
    const f = fileEl.files?.[0];
    if (f) {
      previewEl.src = URL.createObjectURL(f);
      previewEl.classList.remove("hidden");
      removeChk.checked = false;
    } else if (!CURRENT?.image_url) {
      previewEl.classList.add("hidden");
    }
  });

  //  Hide on close/cancel/backdrop
  closeBtn?.addEventListener("click", hide);
  cancelBtn?.addEventListener("click", hide);
  backdrop?.addEventListener("click", hide);

  //  Save/update form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!CURRENT) return;

    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value.trim();
    const content = document.getElementById("editContent").value.trim();

    if (!title || !content)
      return toastError("Title and content are required.");

    const saveBtn = document.getElementById("editSave");
    saveBtn.disabled = true;

    let image_url = CURRENT?.image_url ?? null;

    // remove image
    if (removeChk.checked) image_url = null;

    // upload new file
    const file = fileEl?.files?.[0];
    if (file) {
      try {
        const path = `${userId}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from("article-images")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage
          .from("article-images")
          .getPublicUrl(path);
        image_url = pub.publicUrl;
      } catch (e2) {
        console.warn("[edit] image upload skipped:", e2?.message || e2);
      }
    }

    try {
      const updated = await updateArticle(id, { title, content, image_url });

      // update card
      const card = document.querySelector(`article[data-id="${id}"]`);
      if (card) {
        card.querySelector("h3").textContent = updated.title;
        card.querySelector("p").textContent = updated.content || "";

        const oldImg = card.querySelector("img");
        if (updated.image_url) {
          if (oldImg) oldImg.src = updated.image_url;
          else
            card.insertAdjacentHTML(
              "afterbegin",
              `<img src="${esc(
                updated.image_url
              )}" class="w-full h-40 object-cover rounded-lg mb-3" alt="cover" />`
            );
        } else if (oldImg) {
          oldImg.remove();
        }
      }

      toastSuccess("Article updated!");
      hide();
    } catch (err) {
      console.error(err);
      toastError(err.message || "Failed to update article");
    } finally {
      saveBtn.disabled = false;
    }
  });

  /* ----------------- Modal opener (shared reference) ----------------- */
  openModal = function (a) {
    document.getElementById("editId").value = a.id;
    document.getElementById("editTitle").value = a.title || "";
    document.getElementById("editContent").value = a.content || "";

    const preview = document.getElementById("editPreview");
    const remove = document.getElementById("editRemoveImage");
    const file = document.getElementById("editImageFile");

    remove.checked = false;
    file.value = "";

    if (a.image_url) {
      preview.src = a.image_url;
      preview.classList.remove("hidden");
    } else {
      preview.classList.add("hidden");
    }

    show();
  };
}

/* ----------------------- Escape helper ----------------------- */
function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

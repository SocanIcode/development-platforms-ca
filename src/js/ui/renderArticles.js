export function renderArticles(rootEl, list = []) {
  if (!rootEl) return;
  if (!list.length) {
    rootEl.innerHTML = `<p class="text-gray-500">No articles yet.</p>`;
    return;
  }
  rootEl.innerHTML = list.map(card).join("");
}

function card(a) {
  const href = `/src/article.html?id=${encodeURIComponent(a.id)}`;
  const img = a.image_url
    ? `<img src="${esc(a.image_url)}" 
            alt="cover" 
            class="w-full h-48 object-cover rounded-t-xl"/>`
    : "";

  const date = new Date(a.created_at).toLocaleDateString();

  return `
    <article
      class="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition
             overflow-hidden flex flex-col"
    >
      ${img}
      <div class="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 class="font-semibold text-lg text-gray-900 mb-2">
            <a href="${href}" class="hover:underline">${esc(a.title)}</a>
          </h3>
          <p class="text-sm text-gray-700 line-clamp-4">
            ${esc(a.content ?? "")}
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>${date}</span>
          <a href="${href}" class="text-indigo-600 hover:underline">Read more →</a>
        </div>
      </div>
    </article>
  `;
}

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

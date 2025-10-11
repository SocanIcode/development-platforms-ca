export function renderArticles(rootEl, list = []) {
  if (!rootEl) return;
  if (!list.length) {
    rootEl.innerHTML = `<p class="text-gray-500">No articles yet.</p>`;
    return;
  }

  rootEl.innerHTML = list.map((a) => card(a)).join("");
}

function card(a) {
  const img = a.image_url
    ? `<img src="${esc(a.image_url)}"
             alt="cover"
             class="w-full h-48 object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none lg:w-48 lg:h-auto">`
    : "";

  const date = new Date(a.created_at).toLocaleString();
  const href = `/src/article.html?id=${encodeURIComponent(a.id)}`;

  return `
  <article class="card overflow-hidden flex flex-col lg:flex-row">
    <!-- image -->
    ${img}

    <!-- text -->
    <div class="p-4 flex-1">
      <h3 class="font-semibold text-lg text-gray-900">
        <a href="${href}" class="hover:underline">${esc(a.title)}</a>
      </h3>

      <p class="mt-2 text-sm text-gray-700 line-clamp-4">
        ${esc(a.content ?? "")}
      </p>

      <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>${date}</span>
        <a href="${href}" class="text-indigo-600 hover:underline">Read more →</a>
      </div>
    </div>
  </article>`;
}

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

import { supabase } from "../lib/supabaseClient.js";
import { handle } from "./helpers.js";

const TABLE = "articles";

export async function listArticles() {
  return handle(
    await supabase
      .from(TABLE)
      .select("id,title,content,image_url,author_id,created_at")
      .order("created_at", { ascending: false })
  );
}

export async function getArticle(id) {
  return handle(
    await supabase
      .from(TABLE)
      .select("id,title,content,image_url,author_id,created_at")
      .eq("id", id)
      .single()
  );
}

export async function createArticle({ title, content, image_url = null }) {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Not authenticated");

  const row = { title, content, author_id: u.user.id };
  if (image_url) row.image_url = image_url;

  return handle(
    await supabase
      .from(TABLE)
      .insert([row])
      .select("id,title,content,image_url,author_id,created_at")
      .single()
  );
}

export async function listMyArticles(userId) {
  return handle(
    await supabase
      .from(TABLE)
      .select("id,title,content,image_url,author_id,created_at")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
  );
}

export async function updateArticle(id, { title, content, image_url }) {
  const patch = {};
  if (typeof title === "string") patch.title = title;
  if (typeof content === "string") patch.content = content;
  if (typeof image_url === "string") patch.image_url = image_url;

  return handle(
    await supabase
      .from(TABLE)
      .update(patch)
      .eq("id", id)
      .select("id,title,content,image_url,author_id,created_at")
      .single()
  );
}

/** Delete an article */
export async function deleteArticle(id) {
  return handle(await supabase.from(TABLE).delete().eq("id", id));
}

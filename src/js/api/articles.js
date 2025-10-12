import { supabase } from "../lib/supabaseClient.js";
import { handle } from "./helpers.js";

const TABLE = "articles";

export async function listArticles() {
  return handle(
    await supabase
      .from(TABLE)
      .select("id,title,content,image_url,category,author_id,created_at")
      .order("created_at", { ascending: false })
  );
}

export async function getArticle(id) {
  return handle(
    await supabase
      .from(TABLE)
      .select("id,title,content,image_url,category,author_id,created_at")
      .eq("id", id)
      .single()
  );
}

export async function createArticle({
  title,
  content,
  image_url = null,
  category = null,
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Not authenticated");

  const payload = { title, content, image_url, category, author_id: u.user.id };

  return handle(
    await supabase
      .from(TABLE)
      .insert([payload])
      .select("id,title,content,image_url,category,author_id,created_at")
      .single()
  );
}

export async function updateArticle(id, fields) {
  // fields may include: title, content, image_url, category
  return handle(
    await supabase
      .from(TABLE)
      .update(fields)
      .eq("id", id)
      .select("id,title,content,image_url,category,author_id,created_at")
      .single()
  );
}

export async function deleteArticle(id) {
  return handle(await supabase.from(TABLE).delete().eq("id", id));
}

export async function listMyArticles(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,title,content,image_url,category,author_id,created_at")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

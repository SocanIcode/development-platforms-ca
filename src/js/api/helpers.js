import { toastError } from "../ui/feedback.js";

/**
 * Normalize Supabase or HTTP errors into a consistent format.
 * Returns { status, message }.
 */
function normalizeError(err, fallback = "Something went wrong") {
  const status =
    err?.status ??
    err?.statusCode ??
    (typeof err?.code === "number" ? err.code : null) ??
    null;

  const message =
    err?.message ||
    err?.error_description ||
    err?.error ||
    (typeof err === "string" ? err : null) ||
    fallback;

  return { status, message };
}

/**
 * Map HTTP / generic status to user-friendly text
 */
function friendlyMessage(status, message) {
  if (status === 400) return "Bad request — please check your input.";
  if (status === 401) return "Unauthorized — please login again.";
  if (status === 403) return "Forbidden — you don't have permission.";
  if (status === 404) return "Not found — the requested item doesn't exist.";
  if (status >= 500) return "Server error — please try again later.";
  return message || "Unexpected error.";
}

/**
 * Handle a Supabase (or fetch) result object.
 * If there's an error, normalize + show toast + throw.
 */
export function handle(result, contextMsg = "Request failed") {
  const { data, error } = result;
  if (error) {
    const { status, message } = normalizeError(error, contextMsg);
    const friendly = friendlyMessage(status, message);
    toastError(friendly);
    const err = new Error(friendly);
    err.status = status;
    throw err;
  }
  return data;
}

/**
 * Safe wrapper to run async functions.
 * Logs, normalizes, and rethrows — so outer UI can catch and display it.
 */
export async function safeRun(fn, contextMsg = "Unexpected error") {
  try {
    return await fn();
  } catch (e) {
    const { status, message } = normalizeError(e, contextMsg);
    const friendly = friendlyMessage(status, message);
    toastError(friendly);
    console.error("[safeRun]", e);
    throw e; // rethrow so caller logic still runs .catch if needed
  }
}

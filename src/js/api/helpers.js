export function handle(result) {
  const { data, error } = result;
  if (error) throw error;
  return data;
}

export function safeRun(fn) {
  return fn().catch((e) => {
    console.error(e);
    throw e;
  });
}

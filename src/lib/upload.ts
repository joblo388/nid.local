// Image upload wrapper — uses Vercel Blob if BLOB_READ_WRITE_TOKEN is set,
// falls back to base64 data URL otherwise.
// To enable: set BLOB_READ_WRITE_TOKEN in .env (from vercel.com/dashboard → Storage → Blob)

export async function uploadImage(file: File, maxBytes = 2_000_000): Promise<string> {
  if (file.size > maxBytes) {
    throw new Error(`L'image doit faire moins de ${Math.round(maxBytes / 1_000_000)} MB.`);
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  // Fallback: base64 in DB
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsDataURL(file);
  });
}

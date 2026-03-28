import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const maxBytesRaw = formData.get("maxBytes");
  const maxBytes = maxBytesRaw ? Number(maxBytesRaw) : 2_000_000;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  try {
    const url = await uploadImage(file, maxBytes);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[upload] Error:", err);
    const message = err instanceof Error ? err.message : "Erreur lors du téléversement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

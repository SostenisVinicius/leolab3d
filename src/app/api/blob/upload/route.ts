import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: 8 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ userId: session.user.id, pathname }),
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha no upload" },
      { status: 400 },
    );
  }
}

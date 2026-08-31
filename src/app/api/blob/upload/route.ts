import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { IMAGE_UPLOAD_MAX_SIZE, IMAGE_UPLOAD_TYPES } from "@/lib/image-upload";
import { isPublicQuoteUploadPath } from "@/lib/quote-attachments";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Referências de orçamento vêm do formulário público e ficam presas à
        // pasta do WhatsApp informado. Qualquer outro caminho exige administrador.
        const isQuoteReference = isPublicQuoteUploadPath(pathname);
        const session = await getSession();
        if (!isQuoteReference) {
          if (!session) throw new Error("Não autorizado");
          if ((session.user as { role?: string }).role !== "admin") {
            throw new Error("Acesso administrativo necessário");
          }
        }
        return {
          allowedContentTypes: [...IMAGE_UPLOAD_TYPES],
          maximumSizeInBytes: IMAGE_UPLOAD_MAX_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session?.user.id ?? null, pathname }),
        };
      },
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

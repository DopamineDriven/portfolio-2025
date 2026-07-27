import { NextResponse } from "next/server";
import { resumeData } from "@/utils/__generated__/resume-blob";

export async function GET() {
  const res = await fetch(resumeData.resumeBlob.url, {
    next: { revalidate: 3600 }
  });

  if (!res.ok || !res.body) {
    return new NextResponse("Resume unavailable", { status: 502 });
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="andrew-ross-resume.pdf"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}

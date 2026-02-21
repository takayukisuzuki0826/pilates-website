import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createLessonNote } from "@/lib/google-sheets";

export async function POST(req: NextRequest) {
  let body: { customerId?: string; date?: string; content?: string; nextAction?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { customerId, date, content, nextAction } = body;

  if (!customerId || !date || !content?.trim()) {
    return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
  }

  try {
    await createLessonNote({
      noteId: "note_" + nanoid(),
      customerId,
      date,
      content: content.trim(),
      nextAction: nextAction?.trim() || "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}

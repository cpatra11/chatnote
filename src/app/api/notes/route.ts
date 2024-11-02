import prisma from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/pinecone";
import {
  createNotesSchema,
  deleteNodeSchema,
  updateNotesSchema,
} from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "No notes provided to create!" },
        { status: 400 },
      );
    }
    const parsedResult = createNotesSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
    }
    const { title, content } = parsedResult.data;

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const embedding = await getEmbeddingForNote(title, content);
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to Create Notes" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = updateNotesSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
    }
    const { id, title, content } = parsedResult.data;

    const note = await prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = await auth();

    if (!userId || userId !== note.userId) {
      return NextResponse.json(
        { error: "User not authorized to update" },
        { status: 401 },
      );
    }

    const embedding = await getEmbeddingForNote(title, content);
    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id: updatedNote.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updatedNote;
    });

    return NextResponse.json({ note: updatedNote }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = deleteNodeSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json({ error: "Invalid Input!" }, { status: 400 });
    }
    const { id } = parsedResult.data;

    const note = await prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = await auth();

    if (!userId || userId !== note.userId) {
      return NextResponse.json(
        { error: "User not authorized to update" },
        { status: 401 },
      );
    }
    await prisma.$transaction(async (tx) => {
      await prisma.note.delete({
        where: { id },
      });

      await notesIndex._deleteOne(id);
    });

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete notes" },
      { status: 500 },
    );
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  const text = title + "\n\n" + (content || "");
  if (!text.trim()) {
    throw new Error("Input text for embedding cannot be empty");
  }
  return getEmbedding(text);
}

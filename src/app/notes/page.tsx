import Note from "@/components/Note";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const NotesPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UserId undefined");
  }

  const allNotes = await prisma.note.findMany({
    where: {
      userId,
    },
  });
  // const allNotes = [];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full p-10 text-center">
          {"You don't have any notes here!! Why dont't you ?"}
          <span className="font-bold">{" create one "}</span>{" "}
        </div>
      )}
    </div>
  );
};

export default NotesPage;

import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY as string;

if (!apiKey) {
  throw new Error("Please set PINECONE_API_KEY in your environment variables.");
}

const pinecone = new Pinecone({
  apiKey,
});

export const notesIndex = pinecone.Index("chir");

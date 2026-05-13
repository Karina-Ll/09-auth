import type { Metadata } from "next";
import { fetchNoteById } from "../../../lib/api";
import NotePreview from "../../../components/NotePreview/NotePreview";
import css from "./NoteDetails.module.css";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content
      ? note.content.slice(0, 150)
      : `View note: ${note.title}`,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content
        ? note.content.slice(0, 150)
        : `View note: ${note.title}`,
      url: `https://notehub.com/notes/${id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <main className={css.container}>
      <NotePreview note={note} />
    </main>
  );
}
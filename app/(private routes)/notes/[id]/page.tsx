import type { Metadata } from "next";
import { fetchNoteById } from "../../../../lib/api/serverApi";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `${note.title} | NoteHub`,
    description: note.content ? note.content.slice(0, 150) : `View note: ${note.title}`,
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
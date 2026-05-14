import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { NoteTag } from "../../../../types/note";

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const { slug: tagSegments } = await params;
  const tagValue = tagSegments?.[0];
  const tag = tagValue && tagValue !== "all" ? tagValue : "All";

  return {
    title: `${tag} notes | NoteHub`,
    description: `Browse your ${tag} notes in NoteHub`,
    openGraph: {
      title: `${tag} notes | NoteHub`,
      description: `Browse your ${tag} notes in NoteHub`,
      url: `https://notehub.com/notes/filter/${tagValue ?? "all"}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug: tagSegments } = await params;
  const tagValue = tagSegments?.[0];
  const tag =
    tagValue && tagValue !== "all" ? (tagValue as NoteTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
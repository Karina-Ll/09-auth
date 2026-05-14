import axiosInstance from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";
import { cookies } from "next/headers";

async function getHeaders() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;
  const headers = await getHeaders();
  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    headers,
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const response = await axiosInstance.get<Note>(`/notes/${id}`, { headers });
  return response.data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const response = await axiosInstance.get<User>("/users/me", { headers });
  return response.data;
}

export async function checkSession() {
  const headers = await getHeaders();
  const response = await axiosInstance.get("/auth/session", { headers });
  return response;
}
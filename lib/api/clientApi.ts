import axiosInstance from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

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

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function fetchNotes(params: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;
  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
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
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", data);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(credentials: AuthCredentials): Promise<User> {
  const response = await axiosInstance.post<User>("/auth/register", credentials);
  return response.data;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await axiosInstance.post<User>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response = await axiosInstance.get<User | null>("/auth/session");
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await axiosInstance.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const response = await axiosInstance.patch<User>("/users/me", data);
  return response.data;
}
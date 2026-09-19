import axios from 'axios';
import type { Note, FetchNotesResponse } from '../types/note';

export interface NoteService {
  fetchNotes(page?: number, perPage?: number, search?: string): Promise<FetchNotesResponse>;
  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
  deleteNote(noteId: string): Promise<void>;
}

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export const noteService: NoteService = {
  async fetchNotes(page = 1, perPage = 12, search = ''): Promise<FetchNotesResponse> {
    const response = await axios.get(`${BASE_URL}/notes`, {
      params: { page, perPage, search: search || undefined },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const response = await axios.post(`${BASE_URL}/notes`, note, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  },

  async deleteNote(noteId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
  },
};
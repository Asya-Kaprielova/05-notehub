import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { noteService } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import type { NoteFormValues } from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const handleSearchDebounced = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    handleSearchDebounced(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => noteService.fetchNotes(page, perPage, search),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: NoteFormValues) => noteService.createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => noteService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes</p>}

      {notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={id => deleteNoteMutation.mutate(id)}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={values => createNoteMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
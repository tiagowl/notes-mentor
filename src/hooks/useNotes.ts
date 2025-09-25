import { useState, useEffect } from 'react';
import { Note, CreateNoteData, UpdateNoteData } from '../types/Note';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'notes-mentor-notes';

export const useNotes = () => {
  const [storedNotes, setStoredNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar notas do localStorage
  useEffect(() => {
    try {
      const parsedNotes = storedNotes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  }, [storedNotes]);

  // Salvar notas no localStorage
  const saveNotes = (newNotes: Note[]) => {
    try {
      setStoredNotes(newNotes);
      setNotes(newNotes);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
    }
  };

  // Criar nova nota
  const createNote = (noteData: CreateNoteData): Note => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      isArchived: false,
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    return newNote;
  };

  // Atualizar nota
  const updateNote = (id: string, updateData: UpdateNoteData): Note | null => {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex === -1) return null;

    const updatedNote = {
      ...notes[noteIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;
    saveNotes(updatedNotes);
    return updatedNote;
  };

  // Deletar nota
  const deleteNote = (id: string): boolean => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    return true;
  };

  // Buscar nota por ID
  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  // Buscar notas por termo
  const searchNotes = (searchTerm: string): Note[] => {
    if (!searchTerm.trim()) return notes;
    
    const term = searchTerm.toLowerCase();
    return notes.filter(note => {
      // Remove HTML tags from content for search
      const textContent = note.content.replace(/<[^>]*>/g, '').toLowerCase();
      
      return note.title.toLowerCase().includes(term) ||
        textContent.includes(term) ||
        note.tags.some(tag => tag.toLowerCase().includes(term));
    });
  };

  // Obter notas favoritas
  const getFavoriteNotes = (): Note[] => {
    return notes.filter(note => note.isFavorite && !note.isArchived);
  };

  // Obter notas arquivadas
  const getArchivedNotes = (): Note[] => {
    return notes.filter(note => note.isArchived);
  };

  // Obter notas ativas (não arquivadas)
  const getActiveNotes = (): Note[] => {
    return notes.filter(note => !note.isArchived);
  };

  // Alternar favorito
  const toggleFavorite = (id: string): Note | null => {
    const note = getNoteById(id);
    if (!note) return null;
    
    return updateNote(id, { isFavorite: !note.isFavorite });
  };

  // Alternar arquivo
  const toggleArchive = (id: string): Note | null => {
    const note = getNoteById(id);
    if (!note) return null;
    
    return updateNote(id, { isArchived: !note.isArchived });
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    searchNotes,
    getFavoriteNotes,
    getArchivedNotes,
    getActiveNotes,
    toggleFavorite,
    toggleArchive,
  };
};

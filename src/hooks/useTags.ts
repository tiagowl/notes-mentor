import { useState, useEffect } from 'react';
import { Tag, CreateTagData, UpdateTagData } from '../types/Tag';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'notes-mentor-tags';

// Cores predefinidas para as tags
export const TAG_COLORS = [
  '#667eea', // Azul
  '#f093fb', // Rosa
  '#4facfe', // Azul claro
  '#43e97b', // Verde
  '#fa709a', // Rosa escuro
  '#ffecd2', // Amarelo claro
  '#a8edea', // Verde água
  '#d299c2', // Roxo claro
  '#ff9a9e', // Rosa
  '#fecfef', // Rosa claro
  '#f6d365', // Amarelo
  '#fda085', // Laranja
];

export const useTags = () => {
  const [storedTags, setStoredTags] = useLocalStorage<Tag[]>(STORAGE_KEY, []);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar tags do localStorage
  useEffect(() => {
    try {
      const parsedTags = storedTags.map((tag: any) => ({
        ...tag,
        createdAt: new Date(tag.createdAt),
        updatedAt: new Date(tag.updatedAt),
      }));
      setTags(parsedTags);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    } finally {
      setLoading(false);
    }
  }, [storedTags]);

  // Salvar tags no localStorage
  const saveTags = (newTags: Tag[]) => {
    try {
      setStoredTags(newTags);
      setTags(newTags);
    } catch (error) {
      console.error('Erro ao salvar tags:', error);
    }
  };

  // Criar nova tag
  const createTag = (tagData: CreateTagData): Tag => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      ...tagData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTags = [...tags, newTag];
    saveTags(updatedTags);
    return newTag;
  };

  // Atualizar tag
  const updateTag = (id: string, updateData: UpdateTagData): Tag | null => {
    const tagIndex = tags.findIndex(tag => tag.id === id);
    if (tagIndex === -1) return null;

    const updatedTag = {
      ...tags[tagIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedTags = [...tags];
    updatedTags[tagIndex] = updatedTag;
    saveTags(updatedTags);
    return updatedTag;
  };

  // Deletar tag
  const deleteTag = (id: string): boolean => {
    const updatedTags = tags.filter(tag => tag.id !== id);
    saveTags(updatedTags);
    return true;
  };

  // Buscar tag por ID
  const getTagById = (id: string): Tag | undefined => {
    return tags.find(tag => tag.id === id);
  };

  // Buscar tag por nome
  const getTagByName = (name: string): Tag | undefined => {
    return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
  };

  // Verificar se uma tag existe
  const tagExists = (name: string, projectId?: string): boolean => {
    return tags.some(tag => 
      tag.name.toLowerCase() === name.toLowerCase() &&
      (projectId ? tag.projectId === projectId : true)
    );
  };

  // Obter tags mais usadas (baseado nas notas)
  const getMostUsedTags = (noteTags: string[]): Tag[] => {
    const tagUsage = new Map<string, number>();
    
    noteTags.forEach(tagName => {
      const count = tagUsage.get(tagName) || 0;
      tagUsage.set(tagName, count + 1);
    });

    return tags
      .filter(tag => tagUsage.has(tag.name))
      .sort((a, b) => (tagUsage.get(b.name) || 0) - (tagUsage.get(a.name) || 0));
  };

  // Obter cor aleatória para nova tag
  const getRandomColor = (): string => {
    const usedColors = tags.map(tag => tag.color);
    const availableColors = TAG_COLORS.filter(color => !usedColors.includes(color));
    
    if (availableColors.length === 0) {
      return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
    }
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagByName,
    tagExists,
    getMostUsedTags,
    getRandomColor,
  };
};

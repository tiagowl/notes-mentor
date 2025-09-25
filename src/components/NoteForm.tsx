import React, { useState, useEffect } from 'react';
import { Note, CreateNoteData } from '../types/Note';
import { X, Save, Tag, Plus, Folder } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { useProjects } from '../hooks/useProjects';
import { RichTextEditor } from './RichTextEditor';

interface NoteFormProps {
  note?: Note;
  onSave: (noteData: CreateNoteData) => void;
  onCancel: () => void;
  onOpenTagManager?: () => void;
  onOpenProjectManager?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  note,
  onSave,
  onCancel,
  onOpenTagManager,
  onOpenProjectManager,
}) => {
  const { tags: availableTags } = useTags();
  const { projects } = useProjects();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedProjectId(note.projectId);
      setSelectedTags(note.tags);
    } else {
      // Reset form for new note
      setTitle('');
      setContent('');
      setSelectedProjectId('');
      setSelectedTags([]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove HTML tags to check if content is empty
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (!title.trim() || !textContent) {
      alert('Título e conteúdo são obrigatórios!');
      return;
    }

    if (!selectedProjectId) {
      alert('Selecione um projeto!');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags,
      projectId: selectedProjectId,
    });
  };

  // Filtrar tags disponíveis baseado na entrada e projeto selecionado
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
    !selectedTags.includes(tag.name) &&
    (selectedProjectId ? tag.projectId === selectedProjectId : true)
  );

  const addTag = (tagName: string) => {
    if (tagName && !selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setShowTagSuggestions(e.target.value.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length > 0) {
        addTag(filteredTags[0].name);
      }
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find(t => t.name === tagName);
    return tag?.color || '#667eea';
  };

  return (
    <div className="note-form-overlay">
      <div className="note-form">
        <div className="form-header">
          <h2>{note ? 'Editar Nota' : 'Nova Nota'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da nota..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Conteúdo *</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Digite o conteúdo da nota..."
              height={200}
            />
          </div>

          <div className="form-group">
            <div className="project-header">
              <label htmlFor="project">Projeto *</label>
              {onOpenProjectManager && (
                <button
                  type="button"
                  onClick={onOpenProjectManager}
                  className="manage-projects-btn"
                  title="Gerenciar projetos"
                >
                  <Folder size={16} />
                  Gerenciar Projetos
                </button>
              )}
            </div>
            
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
              className="project-select"
            >
              <option value="">Selecione um projeto...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            
            {projects.length === 0 && (
              <div className="no-projects-message">
                <p>Nenhum projeto criado ainda.</p>
                {onOpenProjectManager && (
                  <button
                    type="button"
                    onClick={onOpenProjectManager}
                    className="create-first-project-btn"
                  >
                    <Plus size={16} />
                    Criar Primeiro Projeto
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="tags-header">
              <label htmlFor="tags">Tags</label>
              {onOpenTagManager && (
                <button
                  type="button"
                  onClick={onOpenTagManager}
                  className="manage-tags-btn"
                  title="Gerenciar tags"
                >
                  <Tag size={16} />
                  Gerenciar Tags
                </button>
              )}
            </div>
            
            <div className="tags-input-container">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
                placeholder="Digite para buscar tags..."
                className="tags-input"
              />
              
              {showTagSuggestions && filteredTags.length > 0 && (
                <div className="tag-suggestions">
                  {filteredTags.slice(0, 5).map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className="tag-suggestion"
                      onClick={() => addTag(tag.name)}
                    >
                      <span
                        className="suggestion-color"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="suggestion-name">{tag.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="selected-tags">
                <div className="selected-tags-header">
                  <span>Tags selecionadas ({selectedTags.length})</span>
                </div>
                <div className="tags-list">
                  {selectedTags.map((tag, index) => (
                    <span key={index} className="tag" style={{ backgroundColor: getTagColor(tag) }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {!selectedProjectId && (
              <div className="no-project-selected-message">
                <p>Selecione um projeto para ver as tags disponíveis.</p>
              </div>
            )}
            
            {selectedProjectId && availableTags.filter(tag => tag.projectId === selectedProjectId).length === 0 && (
              <div className="no-tags-message">
                <p>Nenhuma tag criada para este projeto ainda.</p>
                {onOpenTagManager && (
                  <button
                    type="button"
                    onClick={onOpenTagManager}
                    className="create-first-tag-btn"
                  >
                    <Plus size={16} />
                    Criar Primeira Tag
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              <Save size={16} />
              {note ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

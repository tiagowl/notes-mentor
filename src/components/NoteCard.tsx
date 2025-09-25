import React from 'react';
import { Note } from '../types/Note';
import { Edit, Trash2, Star, Calendar, Tag, Archive } from 'lucide-react';
import { useTags } from '../hooks/useTags';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleArchive,
}) => {
  const { getTagByName } = useTags();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    // Remove HTML tags for truncation
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return content;
    return textContent.substring(0, maxLength) + '...';
  };

  const getTagColor = (tagName: string) => {
    const tag = getTagByName(tagName);
    return tag?.color || '#667eea';
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            className={`favorite-btn ${note.isFavorite ? 'favorited' : ''}`}
            onClick={() => onToggleFavorite(note.id)}
            title={note.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star size={16} />
          </button>
          <button
            className="archive-btn"
            onClick={() => onToggleArchive(note.id)}
            title="Arquivar nota"
          >
            <Archive size={16} />
          </button>
          <button
            className="edit-btn"
            onClick={() => onEdit(note)}
            title="Editar nota"
          >
            <Edit size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(note.id)}
            title="Deletar nota"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="note-content">
        <div 
          className="note-content-html"
          dangerouslySetInnerHTML={{ __html: truncateContent(note.content) }}
        />
      </div>
      
      {note.tags.length > 0 && (
        <div className="note-tags">
          <Tag size={14} />
          {note.tags.map((tag, index) => (
            <span 
              key={index} 
              className="tag"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="note-meta">
        <div className="note-date">
          <Calendar size={14} />
          <span>Criado em {formatDate(note.createdAt)}</span>
        </div>
        {note.updatedAt.getTime() !== note.createdAt.getTime() && (
          <div className="note-date">
            <span>Atualizado em {formatDate(note.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

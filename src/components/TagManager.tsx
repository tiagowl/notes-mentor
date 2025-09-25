import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, Save, Folder } from 'lucide-react';
import { useTags, TAG_COLORS } from '../hooks/useTags';
import { useProjects } from '../hooks/useProjects';
import { Tag, CreateTagData } from '../types/Tag';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProjectManager?: () => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ isOpen, onClose, onOpenProjectManager }) => {
  const {
    tags,
    createTag,
    updateTag,
    deleteTag,
    tagExists,
    getRandomColor,
  } = useTags();

  const { projects } = useProjects();

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(getRandomColor());
  const [newTagProjectId, setNewTagProjectId] = useState<string>('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [editTagProjectId, setEditTagProjectId] = useState<string>('');

  const handleCreateTag = () => {
    const name = newTagName.trim();
    if (!name) return;

    if (!newTagProjectId) {
      alert('Selecione um projeto!');
      return;
    }

    if (tagExists(name, newTagProjectId)) {
      alert('Uma tag com este nome já existe neste projeto!');
      return;
    }

    const tagData: CreateTagData = {
      name,
      color: newTagColor,
      projectId: newTagProjectId,
    };

    createTag(tagData);
    setNewTagName('');
    setNewTagColor(getRandomColor());
    setNewTagProjectId('');
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
    setEditTagProjectId(tag.projectId);
  };

  const handleSaveEdit = () => {
    if (!editingTag) return;

    const name = editTagName.trim();
    if (!name) return;

    if (!editTagProjectId) {
      alert('Selecione um projeto!');
      return;
    }

    if (name !== editingTag.name && tagExists(name, editTagProjectId)) {
      alert('Uma tag com este nome já existe neste projeto!');
      return;
    }

    updateTag(editingTag.id, {
      name,
      color: editTagColor,
      projectId: editTagProjectId,
    });

    setEditingTag(null);
    setEditTagName('');
    setEditTagColor('');
    setEditTagProjectId('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditTagName('');
    setEditTagColor('');
    setEditTagProjectId('');
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta tag?')) {
      deleteTag(id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingTag) {
        handleSaveEdit();
      } else {
        handleCreateTag();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tag-manager-overlay">
      <div className="tag-manager">
        <div className="tag-manager-header">
          <h2>Gerenciar Tags</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="tag-manager-content">
          {/* Criar nova tag */}
          <div className="create-tag-section">
            <h3>Criar Nova Tag</h3>
            <div className="create-tag-form">
              <div className="form-group">
                <label htmlFor="new-tag-name">Nome da Tag</label>
                <input
                  id="new-tag-name"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o nome da tag..."
                  maxLength={20}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-tag-project">Projeto</label>
                <select
                  id="new-tag-project"
                  value={newTagProjectId}
                  onChange={(e) => setNewTagProjectId(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Selecione um projeto...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Cor da Tag</label>
                <div className="color-picker">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {projects.length === 0 && (
                <div className="no-projects-message">
                  <p>Nenhum projeto criado ainda.</p>
                  {onOpenProjectManager && (
                    <button
                      type="button"
                      onClick={onOpenProjectManager}
                      className="create-first-project-btn"
                    >
                      <Folder size={16} />
                      Criar Primeiro Projeto
                    </button>
                  )}
                </div>
              )}
              
              <button
                className="create-tag-btn"
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || !newTagProjectId}
              >
                <Plus size={16} />
                Criar Tag
              </button>
            </div>
          </div>

          {/* Lista de tags existentes */}
          <div className="existing-tags-section">
            <h3>Tags Existentes ({tags.length})</h3>
            {tags.length === 0 ? (
              <div className="empty-tags">
                <p>Nenhuma tag criada ainda.</p>
                <p>Crie sua primeira tag acima!</p>
              </div>
            ) : (
              <div className="tags-list">
                {tags.map((tag) => (
                  <div key={tag.id} className="tag-item">
                    {editingTag?.id === tag.id ? (
                      <div className="edit-tag-form">
                        <input
                          type="text"
                          value={editTagName}
                          onChange={(e) => setEditTagName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="edit-tag-input"
                          maxLength={20}
                        />
                        <div className="edit-color-picker">
                          {TAG_COLORS.map((color) => (
                            <button
                              key={color}
                              className={`color-option ${editTagColor === color ? 'selected' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setEditTagColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="edit-actions">
                          <button
                            className="save-edit-btn"
                            onClick={handleSaveEdit}
                            disabled={!editTagName.trim()}
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="cancel-edit-btn"
                            onClick={handleCancelEdit}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="tag-preview">
                          <span
                            className="tag-color"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="tag-name">{tag.name}</span>
                        </div>
                        <div className="tag-actions">
                          <button
                            className="edit-tag-btn"
                            onClick={() => handleEditTag(tag)}
                            title="Editar tag"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="delete-tag-btn"
                            onClick={() => handleDeleteTag(tag.id)}
                            title="Deletar tag"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="tag-manager-footer">
          <button className="close-manager-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

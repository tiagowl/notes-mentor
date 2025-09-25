import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2, Save, Folder } from 'lucide-react';
import { useProjects, PROJECT_COLORS } from '../hooks/useProjects';
import { Project, CreateProjectData } from '../types/Project';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    projectExists,
    getRandomColor,
  } = useProjects();

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(getRandomColor());
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editProjectColor, setEditProjectColor] = useState('');

  const handleCreateProject = () => {
    const name = newProjectName.trim();
    const description = newProjectDescription.trim();
    
    if (!name) return;

    if (projectExists(name)) {
      alert('Um projeto com este nome já existe!');
      return;
    }

    const projectData: CreateProjectData = {
      name,
      description,
      color: newProjectColor,
    };

    createProject(projectData);
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectColor(getRandomColor());
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description);
    setEditProjectColor(project.color);
  };

  const handleSaveEdit = () => {
    if (!editingProject) return;

    const name = editProjectName.trim();
    const description = editProjectDescription.trim();
    
    if (!name) return;

    if (name !== editingProject.name && projectExists(name)) {
      alert('Um projeto com este nome já existe!');
      return;
    }

    updateProject(editingProject.id, {
      name,
      description,
      color: editProjectColor,
    });

    setEditingProject(null);
    setEditProjectName('');
    setEditProjectDescription('');
    setEditProjectColor('');
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditProjectName('');
    setEditProjectDescription('');
    setEditProjectColor('');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este projeto? Todas as tags e notas associadas serão perdidas!')) {
      deleteProject(id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingProject) {
        handleSaveEdit();
      } else {
        handleCreateProject();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="project-manager-overlay">
      <div className="project-manager">
        <div className="project-manager-header">
          <h2>Gerenciar Projetos</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="project-manager-content">
          {/* Criar novo projeto */}
          <div className="create-project-section">
            <h3>Criar Novo Projeto</h3>
            <div className="create-project-form">
              <div className="form-group">
                <label htmlFor="new-project-name">Nome do Projeto</label>
                <input
                  id="new-project-name"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o nome do projeto..."
                  maxLength={30}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-project-description">Descrição</label>
                <textarea
                  id="new-project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Digite uma descrição para o projeto..."
                  rows={3}
                  maxLength={100}
                />
              </div>
              
              <div className="form-group">
                <label>Cor do Projeto</label>
                <div className="color-picker">
                  {PROJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${newProjectColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewProjectColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <button
                className="create-project-btn"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                <Plus size={16} />
                Criar Projeto
              </button>
            </div>
          </div>

          {/* Lista de projetos existentes */}
          <div className="existing-projects-section">
            <h3>Projetos Existentes ({projects.length})</h3>
            {projects.length === 0 ? (
              <div className="empty-projects">
                <Folder size={48} className="empty-icon" />
                <p>Nenhum projeto criado ainda.</p>
                <p>Crie seu primeiro projeto acima!</p>
              </div>
            ) : (
              <div className="projects-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-item">
                    {editingProject?.id === project.id ? (
                      <div className="edit-project-form">
                        <input
                          type="text"
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="edit-project-input"
                          maxLength={30}
                        />
                        <textarea
                          value={editProjectDescription}
                          onChange={(e) => setEditProjectDescription(e.target.value)}
                          className="edit-project-description"
                          rows={2}
                          maxLength={100}
                        />
                        <div className="edit-color-picker">
                          {PROJECT_COLORS.map((color) => (
                            <button
                              key={color}
                              className={`color-option ${editProjectColor === color ? 'selected' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setEditProjectColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                        <div className="edit-actions">
                          <button
                            className="save-edit-btn"
                            onClick={handleSaveEdit}
                            disabled={!editProjectName.trim()}
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
                        <div className="project-preview">
                          <span
                            className="project-color"
                            style={{ backgroundColor: project.color }}
                          />
                          <div className="project-info">
                            <span className="project-name">{project.name}</span>
                            {project.description && (
                              <span className="project-description">{project.description}</span>
                            )}
                          </div>
                        </div>
                        <div className="project-actions">
                          <button
                            className="edit-project-btn"
                            onClick={() => handleEditProject(project)}
                            title="Editar projeto"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="delete-project-btn"
                            onClick={() => handleDeleteProject(project.id)}
                            title="Deletar projeto"
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

        <div className="project-manager-footer">
          <button className="close-manager-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};



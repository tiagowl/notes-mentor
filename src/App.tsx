import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Menu, Star, Archive, Tag, Sun, Moon, Folder } from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { useTags } from './hooks/useTags';
import { useProjects } from './hooks/useProjects';
import { NoteCard } from './components/NoteCard';
import { NoteForm } from './components/NoteForm';
import { SearchBar } from './components/SearchBar';
import { TagManager } from './components/TagManager';
import { ProjectManager } from './components/ProjectManager';
import { Note, CreateNoteData } from './types/Note';
import { checkForErrors, debugLog } from './utils/productionCheck';
import './App.css';

type ViewMode = 'all' | 'favorites' | 'archived';
type Theme = 'light' | 'dark';

function App() {
  const {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getFavoriteNotes,
    getArchivedNotes,
    toggleFavorite,
    toggleArchive,
  } = useNotes();

  const { tags } = useTags();
  const { projects } = useProjects();

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme preferences from localStorage
  useEffect(() => {
    // Verificar erros de JavaScript
    checkForErrors();
    
    // Debug log para produção
    debugLog('App inicializado');
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setShowForm(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleSaveNote = (noteData: CreateNoteData) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      createNote(noteData);
    }
    setShowForm(false);
    setEditingNote(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(undefined);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta nota?')) {
      deleteNote(id);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleToggleArchive = (id: string) => {
    toggleArchive(id);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSearchTerm(''); // Clear search when changing view mode
    setSelectedTag(null); // Clear selected tag when changing view mode
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? null : tagName);
    setSearchTerm(''); // Clear search when selecting a tag
    setViewMode('all'); // Reset to all notes view
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleOpenTagManager = () => {
    setShowTagManager(true);
  };

  const handleCloseTagManager = () => {
    setShowTagManager(false);
  };

  const handleOpenProjectManager = () => {
    setShowProjectManager(true);
  };

  const handleCloseProjectManager = () => {
    setShowProjectManager(false);
  };

  // Filter notes based on view mode, search, selected tag, and selected project
  const filteredNotes = React.useMemo(() => {
    let filtered = notes;
    
    // Apply project filter first
    if (selectedProject) {
      filtered = filtered.filter(note => note.projectId === selectedProject);
    }
    
    // Apply view mode filter
    switch (viewMode) {
      case 'favorites':
        filtered = filtered.filter(note => note.isFavorite && !note.isArchived);
        break;
      case 'archived':
        filtered = filtered.filter(note => note.isArchived);
        break;
      default:
        filtered = filtered.filter(note => !note.isArchived);
    }
    
    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchResults = searchNotes(searchTerm);
      if (selectedProject) {
        filtered = searchResults.filter(note => note.projectId === selectedProject);
      }
      
      if (viewMode === 'favorites') {
        filtered = filtered.filter(note => note.isFavorite && !note.isArchived);
      } else if (viewMode === 'archived') {
        filtered = filtered.filter(note => note.isArchived);
      } else {
        filtered = filtered.filter(note => !note.isArchived);
      }
      
      // Apply tag filter to search results
      if (selectedTag) {
        filtered = filtered.filter(note => note.tags.includes(selectedTag));
      }
    }
    
    // Sort by update date (most recent first)
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [notes, searchTerm, viewMode, selectedTag, selectedProject, searchNotes]);

  const getViewTitle = () => {
    if (selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (selectedTag) {
        return `${project?.name || 'Projeto'}: ${selectedTag}`;
      }
      return project?.name || 'Projeto';
    }
    
    if (selectedTag) {
      return `Tag: ${selectedTag}`;
    }
    
    switch (viewMode) {
      case 'favorites':
        return 'Notas Favoritas';
      case 'archived':
        return 'Notas Arquivadas';
      default:
        return 'Todas as Notas';
    }
  };

  const getViewIcon = () => {
    if (selectedProject) {
      return <Folder size={20} />;
    }
    
    if (selectedTag) {
      return <Tag size={20} />;
    }
    
    switch (viewMode) {
      case 'favorites':
        return <Star size={20} />;
      case 'archived':
        return <Archive size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <BookOpen size={48} className="loading-icon" />
          <p>Carregando suas notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <BookOpen size={32} />
            <span>Notes</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Projetos</div>
            <button 
              className="nav-item"
              onClick={handleOpenProjectManager}
              title="Gerenciar projetos"
            >
              <Folder size={20} />
              <span>Gerenciar Projetos</span>
              <span className="nav-item-count">{projects.length}</span>
            </button>
            {projects.length > 0 && (
              <div className="projects-list">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`project-sidebar-item ${selectedProject === project.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                    title={`Filtrar por projeto: ${project.name}`}
                  >
                    <span
                      className="project-sidebar-color"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="project-sidebar-name">{project.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            <button
              className={`nav-item ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('all')}
            >
              <BookOpen size={20} />
              <span>Todas as Notas</span>
              <span className="nav-item-count">{notes.length}</span>
            </button>
            <button
              className={`nav-item ${viewMode === 'favorites' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('favorites')}
            >
              <Star size={20} />
              <span>Favoritas</span>
              <span className="nav-item-count">{getFavoriteNotes().length}</span>
            </button>
            <button
              className={`nav-item ${viewMode === 'archived' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('archived')}
            >
              <Archive size={20} />
              <span>Arquivadas</span>
              <span className="nav-item-count">{getArchivedNotes().length}</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Tags</div>
            <button 
              className="nav-item"
              onClick={handleOpenTagManager}
              title="Gerenciar tags"
            >
              <Tag size={20} />
              <span>Gerenciar Tags</span>
              <span className="nav-item-count">{selectedProject ? tags.filter(tag => tag.projectId === selectedProject).length : tags.length}</span>
            </button>
            {selectedProject && tags.filter(tag => tag.projectId === selectedProject).length > 0 && (
              <div className="all-tags-list">
                {tags
                  .filter(tag => tag.projectId === selectedProject)
                  .map((tag) => (
                    <div 
                      key={tag.id} 
                      className={`tag-sidebar-item ${selectedTag === tag.name ? 'selected' : ''}`}
                      onClick={() => handleTagClick(tag.name)}
                      title={`Filtrar por tag: ${tag.name}`}
                    >
                      <span
                        className="tag-sidebar-color"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="tag-sidebar-name">{tag.name}</span>
                    </div>
                  ))}
              </div>
            )}
            {!selectedProject && (
              <div className="no-project-selected-message">
                <p>Selecione um projeto para ver as tags</p>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-selector">
            <div className="theme-group">
              <div className="theme-group-label">Tema</div>
              <div className="theme-options">
                <button
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                  title="Tema Claro"
                >
                  <Sun size={16} />
                </button>
                <button
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                  title="Tema Escuro"
                >
                  <Moon size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="header-title">{getViewTitle()}</h1>
          </div>
          <div className="header-actions">
          <button className="new-note-btn" onClick={handleCreateNote}>
              <Plus size={18} />
            Nova Nota
          </button>
        </div>
      </header>

        <main className="content-area">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
            showFavoritesOnly={viewMode === 'favorites'}
            onToggleFavorites={() => handleViewModeChange(viewMode === 'favorites' ? 'all' : 'favorites')}
        />

        <div className="notes-section">
          <div className="notes-header">
              <h2 className="notes-title">
                {getViewIcon()}
                {getViewTitle()}
              <span className="notes-count">({filteredNotes.length})</span>
            </h2>
          </div>

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} className="empty-icon" />
            <h3>
              {searchTerm || viewMode !== 'all' || selectedTag || selectedProject
                ? 'Nenhuma nota encontrada'
                : 'Nenhuma nota criada ainda'}
            </h3>
            <p>
              {searchTerm || viewMode !== 'all' || selectedTag || selectedProject
                ? 'Tente ajustar sua busca ou filtros'
                : 'Crie sua primeira nota clicando no botão "Nova Nota"'}
            </p>
            {!searchTerm && viewMode === 'all' && !selectedTag && !selectedProject && (
              <button className="create-first-note-btn" onClick={handleCreateNote}>
                <Plus size={20} />
                Criar Primeira Nota
              </button>
            )}
          </div>
        ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onToggleFavorite={handleToggleFavorite}
                    onToggleArchive={handleToggleArchive}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      </div>

      {/* Form Modal */}
      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={handleCancelForm}
          onOpenTagManager={handleOpenTagManager}
          onOpenProjectManager={handleOpenProjectManager}
        />
      )}

      {/* Tag Manager Modal */}
      <TagManager
        isOpen={showTagManager}
        onClose={handleCloseTagManager}
        onOpenProjectManager={handleOpenProjectManager}
      />

      {/* Project Manager Modal */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={handleCloseProjectManager}
      />
    </div>
  );
}

export default App;
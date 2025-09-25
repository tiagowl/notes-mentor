import React from 'react';
import { Search, Star } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
}) => {
  return (
    <div className="search-section">
      <div className="search-bar">
        <div className="search-input-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar notas por título, conteúdo ou tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={onToggleFavorites}
            title={showFavoritesOnly ? 'Mostrar todas as notas' : 'Mostrar apenas favoritos'}
          >
            <Star size={16} />
            Favoritos
          </button>
        </div>
      </div>
    </div>
  );
};

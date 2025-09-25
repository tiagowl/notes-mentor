import { useState, useEffect } from 'react';
import { Project, CreateProjectData, UpdateProjectData } from '../types/Project';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'notes-mentor-projects';

// Cores predefinidas para os projetos
export const PROJECT_COLORS = [
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
  '#8b5cf6', // Roxo
  '#06b6d4', // Ciano
  '#84cc16', // Lima
  '#f97316', // Laranja escuro
];

export const useProjects = () => {
  const [storedProjects, setStoredProjects] = useLocalStorage<Project[]>(STORAGE_KEY, []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar projetos do localStorage
  useEffect(() => {
    try {
      const parsedProjects = storedProjects.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));
      setProjects(parsedProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  }, [storedProjects]);

  // Salvar projetos no localStorage
  const saveProjects = (newProjects: Project[]) => {
    try {
      setStoredProjects(newProjects);
      setProjects(newProjects);
    } catch (error) {
      console.error('Erro ao salvar projetos:', error);
    }
  };

  // Criar novo projeto
  const createProject = (projectData: CreateProjectData): Project => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    return newProject;
  };

  // Atualizar projeto
  const updateProject = (id: string, updateData: UpdateProjectData): Project | null => {
    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex === -1) return null;

    const updatedProject = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = updatedProject;
    saveProjects(updatedProjects);
    return updatedProject;
  };

  // Deletar projeto
  const deleteProject = (id: string): boolean => {
    const updatedProjects = projects.filter(project => project.id !== id);
    saveProjects(updatedProjects);
    return true;
  };

  // Buscar projeto por ID
  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  // Buscar projeto por nome
  const getProjectByName = (name: string): Project | undefined => {
    return projects.find(project => project.name.toLowerCase() === name.toLowerCase());
  };

  // Verificar se um projeto existe
  const projectExists = (name: string): boolean => {
    return projects.some(project => project.name.toLowerCase() === name.toLowerCase());
  };

  // Obter cor aleatória para novo projeto
  const getRandomColor = (): string => {
    const usedColors = projects.map(project => project.color);
    const availableColors = PROJECT_COLORS.filter(color => !usedColors.includes(color));
    
    if (availableColors.length === 0) {
      return PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
    }
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectByName,
    projectExists,
    getRandomColor,
  };
};



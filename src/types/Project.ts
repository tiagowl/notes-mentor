export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}



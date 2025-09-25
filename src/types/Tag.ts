export interface Tag {
  id: string;
  name: string;
  color: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagData {
  name: string;
  color: string;
  projectId: string;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
  projectId?: string;
}

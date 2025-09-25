export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  projectId: string;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  projectId: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  projectId?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

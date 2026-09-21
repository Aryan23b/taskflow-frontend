export interface Project {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  ownerName: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  ownerId: number;
}
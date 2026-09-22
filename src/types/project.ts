export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  ownerName?: string;
}

export type Project = ProjectResponse;

export interface ProjectRequest {
  name: string;
  description?: string;
  ownerId: number;
}
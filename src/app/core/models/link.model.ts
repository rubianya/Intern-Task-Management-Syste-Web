export interface LinkResponse {
  id: number;
  taskId: number;
  url: string;
  label: string;
  createdBy: string | number; 
  createdAt: string | Date;
}

export interface LinkRequest {
  url: string;
  label: string;
}
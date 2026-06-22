export interface Task {
    id?: number;
    title: string;
    description: string;
    status?: string;
    priority: string;
    assigned_to?: number;
    created_by?: number;
    dueDate: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string;
  assignedToId: number;
  status?: string;
  priority?: string;
}
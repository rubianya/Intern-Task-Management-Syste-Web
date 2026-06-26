export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | Date;
    assignedToUserFullName: string; 
    createByFullName: string;     
}

export interface TaskRequest {
    title: string;
    description: string;
    status?: string;
    priority?: string;
    dueDate: string | Date;
    assignedToIds: number[]; 
}

export interface StatusHistoryResponse {
  id: number;
  taskId: number;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string;
  changedAt: string | Date;
}
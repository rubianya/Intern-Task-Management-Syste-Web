export interface TaskResponse {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string | Date;
    assignedToUserFullName: string; 
    createByFullName: string;     
}

export interface TaskRequest {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate: string | Date;
    assignedToIds: number[];
    isGroupTask: boolean;
}
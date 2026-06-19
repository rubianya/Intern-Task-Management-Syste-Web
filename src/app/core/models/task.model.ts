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
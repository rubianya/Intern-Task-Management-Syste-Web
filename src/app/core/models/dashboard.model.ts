export interface DashboardSummaryResponse {
  totalTasks: number;
  todoTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}

export interface InternDashboardResponse {
  internId: number;
  internName: string;
  totalTasks: number;
  todoTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}
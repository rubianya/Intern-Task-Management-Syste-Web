export interface InternDashboardResponse {
  internId: number;
  internName: string;
  totalTasks: number;
  todoTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}

export interface MentorDashboardResponse {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  doneTasks: number;
}

export interface AdminDashboardResponse {
  totalUsers: number;
  totalAdmin: number;
  totalMentor: number;
  totalIntern: number;
}

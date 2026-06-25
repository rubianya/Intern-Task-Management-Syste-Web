export interface CommentResponse {
  id: number;
  taskId: number;
  taskTitle: string;
  userId: number;
  comment: string;
  userName: string; // รับค่าจาก user.getFull_name()
  createdAt: string | Date;
}

export interface CommentRequest {
  comment: string;
}
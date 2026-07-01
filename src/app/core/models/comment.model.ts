export interface CommentResponse {
  id: number;
  taskId: number;
  taskTitle: string;
  userId: number;
  comment: string;
  userName: string;
  createdAt: string | Date;
}

export interface CommentRequest {
  comment: string;
}
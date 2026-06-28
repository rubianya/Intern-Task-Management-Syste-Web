export interface StatusHistoryResponse {
  id: number;
  taskId: number;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string;
  changedAt: string | Date;
}
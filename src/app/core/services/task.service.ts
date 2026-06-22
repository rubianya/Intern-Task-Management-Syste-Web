import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { TaskRequest } from '../models/task.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // 1. ดึงงานทั้งหมด (สำหรับ Dashboard รวม)
  getAllTasks(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
  }
// 2. ดึงงานตาม ID
  getTaskById(id: number): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`);
  }

  // 3. สร้างงานใหม่
  createTask(task: TaskRequest): Observable<ApiResponse<Task[]>> {
    return this.http.post<ApiResponse<Task[]>>(this.apiUrl, task);
  }

  // 4. อัปเดตงานทั้งก้อน
  updateTask(id: number, task: TaskRequest): Observable<ApiResponse<Task[]>> {
    return this.http.put<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`, task);
  }

  // 5. อัปเดตแค่สถานะ
  updateTaskStatus(id: number, status: string): Observable<ApiResponse<Task[]>> {
    return this.http.patch<ApiResponse<Task[]>>(`${this.apiUrl}/${id}/status`, { status });
  }

  // 6. ลบงาน
  deleteTask(id: number): Observable<ApiResponse<Task[]>> {
    return this.http.delete<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`);
  }

}
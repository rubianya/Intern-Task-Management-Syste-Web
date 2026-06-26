import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { TaskRequest } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // ดึงงานทั้งหมด (สำหรับ Dashboard รวม)
  getAllTasks(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
  }

  // ดึงข้อมูลงานเฉพาะตัวเอง
  getAllTasksUser(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/users`);
  }
  // ดึงงานตาม ID
  getTaskById(id: number): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`);
  }

  // สร้างงานใหม่
  createTask(task: TaskRequest): Observable<ApiResponse<Task[]>> {
    return this.http.post<ApiResponse<Task[]>>(this.apiUrl, task);
  }

  // อัปเดตงานทั้งก้อน
  updateTask(id: number, task: TaskRequest): Observable<ApiResponse<Task[]>> {
    return this.http.put<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`, task);
  }

  // อัปเดตแค่สถานะ
  updateTaskStatus(id: number, status: string): Observable<ApiResponse<Task[]>> {
    return this.http.patch<ApiResponse<Task[]>>(`${this.apiUrl}/${id}/status`, { status });
  }

  // ลบงาน
  deleteTask(id: number): Observable<ApiResponse<Task[]>> {
    return this.http.delete<ApiResponse<Task[]>>(`${this.apiUrl}/${id}`);
  }

  // ดึงประวัติสถานะงาน
  getTaskHistories(taskId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/status-histories/task/${taskId}`);
  }

}
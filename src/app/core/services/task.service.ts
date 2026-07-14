import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskResponse } from '../models/task.model';
import { TaskRequest } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // ดึงงานทั้งหมด (สำหรับ Dashboard รวม)
  getAllTasks(): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.get<ApiResponse<TaskResponse[]>>(this.apiUrl);
  }

  // ดึงข้อมูลงานเฉพาะตัวเอง
  getAllTasksUser(): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.get<ApiResponse<TaskResponse[]>>(`${this.apiUrl}/users`);
  }

  // ดึงงานตาม ID
  getTaskById(id: number): Observable<ApiResponse<TaskResponse>> {
    return this.http.get<ApiResponse<TaskResponse>>(`${this.apiUrl}/${id}`);
  }

  // สร้างงานใหม่
  createTask(task: TaskRequest): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.post<ApiResponse<TaskResponse[]>>(this.apiUrl, task);
  }

  // อัปเดตงานทั้งก้อน
  updateTask(id: number, task: TaskRequest): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.put<ApiResponse<TaskResponse[]>>(`${this.apiUrl}/${id}`, task);
  }

  // อัปเดตแค่สถานะ
  updateTaskStatus(id: number, status: string): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.patch<ApiResponse<TaskResponse[]>>(`${this.apiUrl}/${id}/status`, { status });
  }

  // ลบงาน (อันตราย!!! ลบงานจริง )
  deleteTask(id: number): Observable<ApiResponse<TaskResponse[]>> {
    return this.http.delete<ApiResponse<TaskResponse[]>>(`${this.apiUrl}/${id}`);
  }

}
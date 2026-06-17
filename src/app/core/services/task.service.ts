import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8081/api/tasks';

  constructor(private http: HttpClient) {}

  // 1. ดึงงานทั้งหมด (สำหรับ Dashboard รวม)
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // 2. ดึงงานเฉพาะที่ Mentor คนนี้เป็นคนสร้าง
  getTasksByMentor(mentorId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/mentor/${mentorId}`);
  }

  // 3. สร้างงานใหม่ & มอบหมายงาน
  createTask(taskData: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  // 4. อัปเดตสถานะ หรือ ส่ง Comment ตรวจงาน
  updateTask(taskId: number, taskData: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, taskData);
  }
}
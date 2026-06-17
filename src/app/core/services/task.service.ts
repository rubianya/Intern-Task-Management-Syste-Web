import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MentorDash } from '../../features/dashboard/components/mentor-dash/mentor-dash';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8081/api/tasks';

  constructor(private http: HttpClient) {}

  // 1. ดึงงานทั้งหมด (สำหรับ Dashboard รวม)
  getAllTasks(): Observable<MentorDash[]> {
    return this.http.get<MentorDash[]>(this.apiUrl);
  }

  // 2. ดึงงานเฉพาะที่ Mentor คนนี้เป็นคนสร้าง
  getTasksByMentor(mentorId: number): Observable<MentorDash[]> {
    return this.http.get<MentorDash[]>(`${this.apiUrl}/mentor/${mentorId}`);
  }

  // 3. สร้างงานใหม่ & มอบหมายงาน
  createTask(taskData: MentorDash): Observable<MentorDash> {
    return this.http.post<MentorDash>(this.apiUrl, taskData);
  }

  // 4. อัปเดตสถานะ หรือ ส่ง Comment ตรวจงาน
  updateTask(taskId: number, taskData: MentorDash): Observable<MentorDash> {
    return this.http.put<MentorDash>(`${this.apiUrl}/${taskId}`, taskData);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AdminDashboardResponse, InternDashboardResponse, MentorDashboardResponse,  } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลภาพรวมระบบ
  getSummary(): Observable<ApiResponse<MentorDashboardResponse>> {
    return this.http.get<ApiResponse<MentorDashboardResponse>>(`${this.apiUrl}/summary`);
  }

  // ดึงข้อมูลสรุปผู้ใช้สำหรับ Admin
  getAdminUserSummary(): Observable<ApiResponse<AdminDashboardResponse>> {
    return this.http.get<ApiResponse<AdminDashboardResponse>>(`${this.apiUrl}/admin/users`);
  }

  // ดึงข้อมูล Dashboard สำหรับ Intern (ผู้ใช้ที่กำลัง Login)
  getMyDashboard(): Observable<ApiResponse<InternDashboardResponse>> {
    return this.http.get<ApiResponse<InternDashboardResponse>>(`${this.apiUrl}/interns/me`);
  }

  // ดึงข้อมูล Dashboard ของ Intern สำหรับ Mentor
  getInternDashboardByMentor(internId: number): Observable<ApiResponse<InternDashboardResponse>> {
    return this.http.get<ApiResponse<InternDashboardResponse>>(`${this.apiUrl}/mentor/interns/${internId}`);
  }

  // ดึงข้อมูลสรุปงานของ Mentor (สำหรับ Mentor ที่ Login)
  getMentorSummary(): Observable<ApiResponse<MentorDashboardResponse>> {
    return this.http.get<ApiResponse<MentorDashboardResponse>>(`${this.apiUrl}/mentor/summary`);
  }
}
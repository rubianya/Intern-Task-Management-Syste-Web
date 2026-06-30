import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { InternDashboardResponse, DashboardSummaryResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  // 1. ดึงข้อมูลภาพรวมระบบ (สำหรับ Admin / โชว์รวมๆ)
  getSummary(): Observable<ApiResponse<DashboardSummaryResponse>> {
    return this.http.get<ApiResponse<DashboardSummaryResponse>>(`${this.apiUrl}/summary`);
  }

  // 2. ดึงข้อมูล Dashboard สำหรับ Intern (ผู้ใช้ที่กำลัง Login)
  getMyDashboard(): Observable<ApiResponse<InternDashboardResponse>> {
    return this.http.get<ApiResponse<InternDashboardResponse>>(`${this.apiUrl}/interns/me`);
  }

  // 3. ดึงข้อมูล Dashboard ของ Intern สำหรับ Mentor
  getInternDashboardByMentor(internId: number): Observable<ApiResponse<InternDashboardResponse>> {
    return this.http.get<ApiResponse<InternDashboardResponse>>(`${this.apiUrl}/mentor/interns/${internId}`);
  }

  // 4. ดึงข้อมูลสรุปงานของ Mentor (สำหรับ Mentor ที่ Login)
  getMentorSummary(): Observable<ApiResponse<DashboardSummaryResponse>> {
    return this.http.get<ApiResponse<DashboardSummaryResponse>>(`${this.apiUrl}/mentor/summary`);
  }
}
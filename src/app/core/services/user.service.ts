import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserResponse } from "../models/user.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // ดึงข้อมูลโปรไฟล์
    getUserProfile(): Observable<ApiResponse<UserResponse>> {
        return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/users/profile`); 
    }

    // อัปเดตโปรไฟล์
    updateProfile(id: number, userData: Partial<UserResponse>): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/users/${id}`, userData); 
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด สำหรับ Admin
    getAllUsers(): Observable<ApiResponse<UserResponse[]>> {
        return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/users`);
    } 

    // ดึงข้อมูลเฉพาะ Intern ที่ Active สำหรับ Mentor
    getActiveInterns(): Observable<ApiResponse<UserResponse[]>> {
        return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/users/interns`);
    }

    // เพิ่มผู้ใช้ใหม่
    createUser(userData: UserResponse): Observable<ApiResponse<UserResponse>> {
        return this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/users`, userData);
    }

    // อัปเดตข้อมูลผู้ใช้
    updateUser(id: number, userData: UserResponse): Observable<ApiResponse<UserResponse>> {
        return this.http.put<ApiResponse<UserResponse>>(`${this.apiUrl}/users/${id}`, userData);
    }

    // เปลี่ยนสถานะบัญชีใช้งาน (A, I, S)
    changeUserStatus(id: number, status: { status: string }): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}/users/${id}/status`, status);
    }
    
    // ลบผู้ใช้ (อันตราย!!! ลบข้อมูลออกจริง)
    deleteUser(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/delete/${id}`);
    }
}
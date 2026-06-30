import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // ดึงข้อมูลโปรไฟล์
    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/profile`); 
    }

    // อัปเดตโปรไฟล์
    updateProfile(id: number, data: Partial<User>): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}`, data); 
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    } 

    // เพิ่มผู้ใช้ใหม่
    createUser(userData: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, userData);
    }

    // อัปเดตข้อมูลผู้ใช้
    updateUser(id: number, userData: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData);
    }

    // ลบผู้ใช้
    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }

    // เปลี่ยนสถานะการใช้งานบัญชี
    toggleActive(id: number, userData: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${id}/active`,userData);
    }
    
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../features/dashboard/components/users-management/users-management";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8081/api';

    constructor(private http: HttpClient) {}

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
    switchActive(id: number, userData: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}//users/${id}/active`,userData);
    }
    
}
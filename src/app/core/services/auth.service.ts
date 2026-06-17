import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // 1. ยิง API Login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // 2. ยิง API ดึงข้อมูล User Profile
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`); 
  }

  // 3. ยิง API อัปเดตข้อมูลโปรไฟล์
  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data); 
  }

}
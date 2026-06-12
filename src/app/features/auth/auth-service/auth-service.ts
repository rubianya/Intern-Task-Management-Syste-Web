import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        // ใช้การตรวจสอบที่ปลอดภัย
        if (res?.active === true) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('active', 'true');
        } else {
          throw new Error('Account disabled');
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && localStorage.getItem('active') === 'true';
  }

  logout(): void {
    localStorage.clear();
  }
}

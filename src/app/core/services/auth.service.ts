import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogingResponse, LoginRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LogingResponse> {
    return this.http.post<LogingResponse>(`${this.apiUrl}/login`, credentials);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`); 
  }

  updateProfile(id: number, data: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data); 
  }

}
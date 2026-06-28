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

  login(login: LoginRequest): Observable<LogingResponse> {
    return this.http.post<LogingResponse>(`${this.apiUrl}/login`, login);
  }

}
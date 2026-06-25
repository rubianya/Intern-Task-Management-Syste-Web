import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import { CommentRequest, CommentResponse } from '../models/comment.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // ดึงคอมเมนต์ทั้งหมดของงานนั้นๆ
  getCommentsByTaskId(taskId: number): Observable<ApiResponse<CommentResponse[]>> {
    return this.http.get<ApiResponse<CommentResponse[]>>(`${this.apiUrl}/${taskId}/comments`);
  }

  // ส่งคอมเมนต์ใหม่
  addComment(taskId: number, request: CommentRequest): Observable<ApiResponse<CommentResponse>> {
    return this.http.post<ApiResponse<CommentResponse>>(`${this.apiUrl}/${taskId}/comments`, request);
  }
  
}
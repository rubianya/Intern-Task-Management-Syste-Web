import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../models/api-response.model";
import { LinkRequest, LinkResponse } from "../models/link.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LinkService {
    
    private apiUrl = `${environment.apiUrl}/tasks`;
    
    constructor(private http: HttpClient) {}

    // ดึงลิงก์ของงาน
    getLinksByTaskId(taskId: number): Observable<ApiResponse<LinkResponse[]>> {
        return this.http.get<ApiResponse<LinkResponse[]>>(`${this.apiUrl}/${taskId}/links`);
    }

    // เพิ่มลิงก์ใหม่
    addLinkToTask(taskId: number, request: LinkRequest): Observable<ApiResponse<LinkResponse>> {
        return this.http.post<ApiResponse<LinkResponse>>(`${this.apiUrl}/${taskId}/links`, request);
    }

    // ลบลิ้งค์เฉพาะของเรา
    deleteLink(taskId: number, linkId: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${taskId}/links/${linkId}`);
    }
        
}
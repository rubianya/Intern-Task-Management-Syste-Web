import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class statusHistoryService {

    private apiUrl = `${environment.apiUrl}/status-histories`;
    
    constructor(private http: HttpClient) {}

    // ดึงประวัติสถานะงาน
    getTaskHistories(taskId: number): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${environment.apiUrl}/${taskId}`);
    }

    // // อัปเดตประวัติสถานะงาน
    // updateHistories(taskId: number): Observable<ApiResponse<any[]>> {
    //     return this.http.put<ApiResponse<any[]>>(`${environment.apiUrl}/${taskId}`);
    // }
    

}
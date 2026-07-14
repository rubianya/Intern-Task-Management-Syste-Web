import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AdminDashboardResponse } from '../../../../../core/models/dashboard.model';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dash.html',
  styleUrl: './admin-dash.css',
})
export class AdminDash implements OnInit {
  userSummary: AdminDashboardResponse | null = null;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.dashboardService.getAdminUserSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.userSummary = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching user summary', err)
    });
  }

  goToUserManagement(role?: string, status?: string): void {
    const queryParams: any = {};
    
    if (role) queryParams.role = role;
    if (status) queryParams.status = status;

    this.router.navigate(['/dashboard/users-management'], { queryParams });
  }

}

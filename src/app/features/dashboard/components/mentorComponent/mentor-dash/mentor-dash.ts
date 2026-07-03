import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { TaskService } from '../../../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { MentorDashboardResponse } from '../../../../../core/models/dashboard.model';
import { TaskResponse } from '../../../../../core/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-dash.html',
  styleUrl: './mentor-dash.css',
})
export class MentorDash implements OnInit {

  dashboardStats: MentorDashboardResponse = {
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    doneTasks: 0
  };

  pendingTasksList: TaskResponse[] = [];

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadPendingTasks();
  }

  loadDashboardStats(): void {
    this.dashboardService.getMentorSummary().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.dashboardStats = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching mentor dashboard stats:', error);
      }
    });
  }

  viewTasksByStatus(status: string): void {
    if (status === '') {
      this.router.navigate(['/dashboard/task-management']);
    } else {
      this.router.navigate(['/dashboard/task-management'], { queryParams: { status: status } });
    }
  }

  loadPendingTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.pendingTasksList = response.data.filter((task: TaskResponse) => task.status === 'PENDING');
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching tasks for dashboard pending table:', error);
      }
    });
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/mentor-task-detail', taskId]);
  }

}
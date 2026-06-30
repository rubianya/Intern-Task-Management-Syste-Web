import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../../core/services/task.service';
import { TaskResponse } from '../../../../../core/models/task.model';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { InternDashboardResponse } from '../../../../../core/models/dashboard.model';

@Component({
  selector: 'app-intern-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intern-dash.html',
  styleUrl: './intern-dash.css',
})
export class InternDash implements OnInit {
  tasks: TaskResponse[] = [];
  dashboardStats: InternDashboardResponse | null = null;

  constructor(
    private taskService: TaskService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tasks = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  loadDashboardStats(): void {
    this.dashboardService.getMyDashboard().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dashboardStats = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
      }
    });
  }

  get upcomingTasks(): TaskResponse[] {
    if (!this.tasks) return [];
    return [...this.tasks]
      .filter(task => task.status === 'TODO' || task.status === 'IN_PROGRESS')
      .sort((a, b) => {
        const dateA = new Date(a.dueDate || '9999-12-31').getTime();
        const dateB = new Date(b.dueDate || '9999-12-31').getTime();
        return dateA - dateB;
      })
  }

  viewTasksByStatus(status: string): void {
    if (status === 'ALL') {
      this.router.navigate(['/dashboard/my-task']);
    } else {
      this.router.navigate(['/dashboard/my-task'], { queryParams: { status: status } });
    }
  }

  getDueDateClass(dueDate: string | Date | null, status: string): string {
    if (!dueDate || status === 'DONE') return 'due-normal';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'due-overdue';
    if (diffDays <= 3) return 'due-urgent';
    return 'due-normal';
  }

  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/intern-task-detail', taskId]);
  }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../../core/services/task.service';
import { TaskResponse } from '../../../../../core/models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intern-dash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intern-dash.html',
  styleUrl: './intern-dash.css',
})
export class InternDash implements OnInit {
  tasks: TaskResponse[] = [];
  dashboardStats = { total: 0, todo: 0, inProgress: 0, review: 0, done:0 };

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tasks = response.data;
          this.calculateStats();
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  calculateStats(): void {
    this.dashboardStats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'TODO').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      review: this.tasks.filter(t => t.status === 'REVIEW').length,
      done: this.tasks.filter(t => t.status === 'DONE').length
    };
  }

  get upcomingTasks(): TaskResponse[] {
    if (!this.tasks) return [];
    return [...this.tasks]
      .filter(task => task.status !== 'DONE')
      .sort((a, b) => {
        const dateA = new Date(a.dueDate || '9999-12-31').getTime();
        const dateB = new Date(b.dueDate || '9999-12-31').getTime();
        return dateA - dateB;
      })
      .slice(0, 5);
  }

  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/task-detail', taskId]); // ปรับ Route ตามระบบของคุณ
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

}

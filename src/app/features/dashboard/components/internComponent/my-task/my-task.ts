import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { TaskService } from '../../../../../core/services/task.service';

@Component({
  selector: 'app-my-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-task.html',
  styleUrl: './my-task.css',
})
export class MyTask implements OnInit {
  tasks: any[] = [];
  dashboardStats = { total: 0, todo: 0, inProgress: 0, review: 0 };
  
  searchTerm: string = '';
  filterStatus: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  get filteredTasks() {
    if (!this.tasks) return [];
    
    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus ? task.status === this.filterStatus : true;
      return matchesSearch && matchesStatus;
    });
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
      review: this.tasks.filter(t => t.status === 'REVIEW').length
    };
  }

  getDueDateClass(dueDate: string | Date | null, status: string): string {
    if (!dueDate || status === 'DONE') return 'due-normal';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'due-overdue';
    else if (diffDays >= 0 && diffDays <= 2) return 'due-warning';
    return 'due-normal';
  }

  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/task-detail', taskId]);
  }

}
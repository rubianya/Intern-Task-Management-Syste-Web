import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { TaskService } from '../../../../../core/services/task.service';
import { TaskResponse } from '../../../../../core/models/task.model';

@Component({
  selector: 'app-my-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-task.html',
  styleUrl: './my-task.css',
})
export class MyTask implements OnInit {
  tasks: TaskResponse[] = [];
  dashboardStats = { total: 0, todo: 0, inProgress: 0, review: 0 };
  
  searchTerm: string = '';
  filterStatus: string = '';
  sortOrder: 'asc' | 'desc' | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  toggleSort() {
    if (this.sortOrder === null) this.sortOrder = 'asc';
    else if (this.sortOrder === 'asc') this.sortOrder = 'desc';
    else this.sortOrder = null;
  }

  get filteredTasks() {
    if (!this.tasks) return [];
    
    let result = [...this.tasks].filter(task => {
      const term = this.searchTerm.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(term) || 
            (task.createByFullName && task.createByFullName.toLowerCase().includes(term));
      const matchesStatus = this.filterStatus ? task.status === this.filterStatus : true;
      return matchesSearch && matchesStatus;
    });

    if (this.sortOrder) {
      result.sort((a, b) => {
        const dateA = new Date(a.dueDate || '9999-12-31').getTime();
        const dateB = new Date(b.dueDate || '9999-12-31').getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response: { success: boolean, data: TaskResponse[] }) => {
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
  this.dashboardStats = { total: this.tasks.length, todo: 0, inProgress: 0, review: 0 };
  this.tasks.forEach(t => {
    if (t.status === 'TODO') this.dashboardStats.todo++;
    else if (t.status === 'IN_PROGRESS') this.dashboardStats.inProgress++;
    else if (t.status === 'REVIEW') this.dashboardStats.review++;
  });
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
    this.router.navigate(['/dashboard/intern-task-detail', taskId]);
  }

}
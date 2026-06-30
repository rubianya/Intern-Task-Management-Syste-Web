import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
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
  searchTerm: string = '';
  filterStatus: string = '';
  sortOrder: 'asc' | 'desc' | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.filterStatus = params['status']; 
      }
    });
  }

  toggleSort() {
    if (this.sortOrder === null) this.sortOrder = 'asc';
    else if (this.sortOrder === 'asc') this.sortOrder = 'desc';
    else this.sortOrder = null;
  }

  get filteredTasks(): TaskResponse[] {
    let result = [...this.tasks];
    if (this.filterStatus) {
      result = result.filter(task => task.status === this.filterStatus);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title?.toLowerCase().includes(term) || 
        task.createByFullName?.toLowerCase().includes(term)
      );
    }
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
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  getDueDateClass(dueDate: string | Date | null, status: string): string {
    if (!dueDate || status === 'DONE') return 'due-normal';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'due-overdue';
    if (diffDays <= 2) return 'due-urgent';
    return 'due-normal';
  }

  goToTaskDetail(id: number): void {
    this.router.navigate(['/dashboard/intern-task-detail', id]);
  }

}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskResponse } from '../../../../../core/models/task.model';

@Component({
  selector: 'app-all-users-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './all-users-tasks.html',
  styleUrl: './all-users-tasks.css',
})
export class AllUsersTasks implements OnInit {
  tasks: TaskResponse[] = [];
  searchTerm: string = '';
  filterStatus: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.tasks = response.data;
          this.cdr.detectChanges();
        } else if (Array.isArray(response)) {
          this.tasks = response;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/users-tasks-detail', taskId]);
  }

  get filteredTasks() {
    let filtered = this.tasks;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.createByFullName?.toLowerCase().includes(term) ||
        (task.assignedToUserFullNames && task.assignedToUserFullNames.some(name => name.toLowerCase().includes(term)))
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(task => task.status === this.filterStatus);
    }
    return filtered;
  }

  get paginatedTasks(): TaskResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTasks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.itemsPerPage) || 1;
  }

  get startIndex(): number {
    return this.filteredTasks.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredTasks.length ? this.filteredTasks.length : end;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { UserService } from '../../../../../core/services/user.service';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskRequest, TaskResponse } from '../../../../../core/models/task.model';
import { UserResponse } from '../../../../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-management.html',
  styleUrl: './task-management.css',
})
export class TaskManagement implements OnInit {

  tasks: TaskResponse[] = []; 
  interns: UserResponse[] = [];
  searchTerm: string = '';
  filterIntern: string = '';
  filterStatus: string = '';
  isModalOpen = false;
  taskForm!: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  isEditMode: boolean = false;
  editingTaskId: number | null = null;

  dashboardStats: any = {
    totalTasks: 0, todoTasks: 0, inProgressTasks: 0, pendingTasks: 0, doneTasks: 0
  };

  constructor(
    private taskService: TaskService, 
    private dashboardService: DashboardService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIntern();
    this.loadTasks();
    this.loadDashboardStats();
    this.initForm();

    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.filterStatus = params['status'];
        this.onFilterChange();
        this.cdr.detectChanges();
      }
    });
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM', Validators.required],
      status: ['TODO'],
      dueDate: ['', Validators.required],
      assignedToIds: [[] as number[], null],
      isGroupTask: [false]
    });
  }

  loadIntern(): void {
    this.userService.getActiveInterns().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.interns = response.data.filter((intern: UserResponse) => intern.status === 'A');
          this.filterIntern = '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load interns', err)
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.tasks = response.data;
          this.cdr.detectChanges();
        } else if (Array.isArray(response)) {
          this.tasks = response;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('โหลดข้อมูลผิดพลาด:', err);
      }
    });
  }

  loadDashboardStats(): void {
    this.dashboardService.getMentorSummary().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dashboardStats = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load dashboard stats', err)
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  get filteredInterns() {
    if (!this.filterIntern) {
      return this.interns;
    }
    
    const searchTerm = this.filterIntern.toLowerCase();

    return this.interns.filter(intern => 
      intern.fullName.toLowerCase().includes(searchTerm)
    );
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

  openCreateTaskModal(): void {
    this.isEditMode = false;
    this.editingTaskId = null;
    this.taskForm.reset({ priority: 'MEDIUM', status: 'TODO', assignedToIds: [], isGroupTask: false });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.taskForm.reset();
  }

  toggleInternSelection(internId: number) {
    const currentAssignedToIds = this.taskForm.get('assignedToIds')?.value as number[];
    if (currentAssignedToIds.includes(internId)) {
      this.taskForm.patchValue({
        assignedToIds: currentAssignedToIds.filter(id => id !== internId)
      });
    } else {
      this.taskForm.patchValue({
        assignedToIds: [...currentAssignedToIds, internId]
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      alert('ฟอร์มยังไม่สมบูรณ์! กรุณาตรวจสอบช่องที่มีดอกจัน (*)');
      return;
    }
    
    const taskData: TaskRequest = this.taskForm.value as TaskRequest;

    if (this.isEditMode && this.editingTaskId !== null) {
      this.taskService.updateTask(this.editingTaskId, taskData).subscribe({
        next: (response) => {
          alert('แก้ไขข้อมูลงานเรียบร้อยแล้ว!');
          this.closeModal();
          this.loadTasks(); 
          this.loadDashboardStats(); 
        },
        error: (err) => {
          console.error('Failed to update task', err);
          alert('เกิดข้อผิดพลาดในการแก้ไขงาน');
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (response) => {
          alert('มอบหมายงานให้ Intern เรียบร้อยแล้ว!');
          this.closeModal();
          this.loadTasks(); 
          this.loadDashboardStats(); 
        },
        error: (err) => {
          console.error('Failed to assign tasks', err);
          alert('เกิดข้อผิดพลาดในการมอบหมายงาน');
        }
      });
    }
  }

  openEditTaskModal(task: TaskResponse): void {
    this.isEditMode = true;
    this.editingTaskId = task.id;
    this.isModalOpen = true;

    const selectedIds = task.assignedToUserFullNames 
      ? this.interns
          .filter(intern => task.assignedToUserFullNames.includes(intern.fullName))
          .map(intern => intern.id)
      : [];

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedToIds: selectedIds,
      isGroupTask: task.assignedToUserFullNames && task.assignedToUserFullNames.length > 1
    });
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/mentor-task-detail', taskId]);
  }

  deleteTask(taskId: number): void {
    if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      const targetStatus = 'SUSPEND';
      this.taskService.updateTaskStatus(taskId, targetStatus).subscribe({
        next: (response) => {
          if (response.success) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            alert('ลบข้อมูลงานออกจากระบบสำเร็จเรียบร้อยแล้ว');
            this.loadTasks();
            this.loadDashboardStats(); 
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการลบงาน:', err);
          alert('ไม่สามารถลบงานได้เนื่องจากสิทธิ์ระบบหรือข้อผิดพลาดของเครือข่าย');
        }
      });
    }
  }
}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { UserService } from '../../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskRequest, TaskResponse } from '../../../../../core/models/task.model';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-management.html',
  styleUrl: './task-management.css',
})
export class TaskManagement implements OnInit {

  tasks: TaskResponse[] = []; 
  interns: User[] = [];
  filteredInterns: User[] = [];
  searchTerm: string = '';
  dashboardStats = { total: 0, todo: 0, inProgress: 0, pending:0, done: 0 };

  isModalOpen = false;
  taskForm!: FormGroup;

  constructor(
    private taskService: TaskService, 
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIntern();
    this.loadTasks();
    this.initForm();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['Medium', Validators.required],
      status: ['TODO', Validators.required],
      assignedToIds: [[], [Validators.required, Validators.minLength(1)]],
      dueDate: ['', Validators.required]
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.tasks = response.data;
          this.calculateStats();
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  loadIntern(): void {
    this.userService.getActiveInterns().subscribe({
      next: (response: any) => {
        const userList: User[] = response.data || response; 

        if (Array.isArray(userList)) {
          this.interns = userList.filter((user: User) => 
            user.role && user.role.toLowerCase() === 'intern'
          );
          this.filteredInterns = [...this.interns];
          console.log('Filtered Interns:', this.filteredInterns);
        }
      },
      error: (err) => {
        console.error('Failed to load interns', err);
      }
    });
  }

  filterInterns(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInterns = [...this.interns]; 
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredInterns = this.interns.filter(intern => 
        (intern.full_name || '').toLowerCase().includes(term)
      );
    }
  }

  openCreateTaskModal(): void {
    this.isModalOpen = true;
    this.searchTerm = ''; 
    this.filteredInterns = [...this.interns];
    
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'TODO',
      assignedToIds: [],
      dueDate: ''
    });
  }

  calculateStats(): void {
    this.dashboardStats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'TODO').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      pending: this.tasks.filter(t => t.status === 'PENDING').length,
      done: this.tasks.filter(t => t.status === 'DONE').length
    };
  }
  
  getRole(): string | null {
    return localStorage.getItem('role');
  } 

  deleteTask(taskId: number): void {
    const role = this.getRole();

    if (role === 'Admin' || role === 'Mentor') {
      alert('คุณไม่มีสิทธิ์ลบงานนี้! สิทธิ์ในการลบงานจำกัดเฉพาะ Mentor หรือ Admin เท่านั้นครับ');
      return;
    }

    if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (response) => {
          if (response.success) {
            alert(response.message);   
            this.loadTasks(); 
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
          const errorMessage = err.error?.message || 'เกิดข้อผิดพลาดในการลบงาน';
          alert(errorMessage);
        }
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleInternSelection(internIds: number, event: any): void {
    let selectedIds = [...(this.taskForm.get('assignedToIds')?.value || [])] as number[];

    if (event.target.checked) {
      if (!selectedIds.includes(internIds)) {
        selectedIds.push(internIds);
      }
    } else {
      selectedIds = selectedIds.filter(id => id !== internIds);
    }

    this.taskForm.get('assignedToIds')?.setValue(selectedIds);
    this.taskForm.get('assignedToIds')?.markAsTouched();
    this.taskForm.get('assignedToIds')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      alert('ฟอร์มยังไม่สมบูรณ์! กรุณาตรวจสอบช่องที่มีดอกจัน (*)');
      return;
    }
    
    const formValue = this.taskForm.value;
    const selectedInternIds: number[] = formValue.assignedToIds;

    if (!selectedInternIds || selectedInternIds.length === 0) {
      alert('กรุณาตเลือก Intern อย่างน้อย 1 คน');
      return;
    }

    const taskData: TaskRequest = {
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate,
      assignedToIds: selectedInternIds
    };

    this.taskService.createTask(taskData).subscribe({
      next: (response: any) => {
        alert(`มอบหมายงานให้ Intern จำนวน ${selectedInternIds.length} คน เรียบร้อยแล้ว!`);
        this.closeModal();
        this.loadTasks(); 
      },
      error: (err) => {
        console.error('Failed to assign tasks', err);
        const errorMsg = err.error?.errors?.assignedToIds || err.error?.message || 'เกิดข้อผิดพลาด';
        alert('ไม่สามารถบันทึกได้: ' + errorMsg);
      }
    });
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/dashboard/mentor-task-detail', taskId]); 
  }
}
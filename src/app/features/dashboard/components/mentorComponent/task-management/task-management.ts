import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../../core/services/task.service';
import { UserService } from '../../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskRequest } from '../../../../../core/models/task.model';
import { CommentRequest, CommentResponse } from '../../../../../core/models/comment.model';
import { CommentService } from '../../../../../core/services/comment.service';

@Component({
  selector: 'app-task-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-management.html',
  styleUrl: './task-management.css',
})
export class TaskManagement implements OnInit {

  tasks: any[] = []; 
  interns: any[] = [];
  filteredInterns: any[] = [];
  searchTerm: string = '';
  dashboardStats = { total: 0, todo: 0, inProgress: 0, done: 0 };

  isModalOpen = false;
  taskForm!: FormGroup;

  isDetailModalOpen = false;
  selectedTask: any = null;
  taskComments: CommentResponse[] = [];
  taskHistories: any[] = [];
  newComment: string = '';

  constructor(
    private taskService: TaskService, 
    private userService: UserService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadIntern();
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
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        const users = response.data ? response.data : response;
        this.interns = users.filter((u: any) => u.role?.toUpperCase() === 'INTERN' && u.active);
        this.filteredInterns = [...this.interns]; // 👈 3. กำหนดค่าเริ่มต้นให้เท่ากับรายชื่อทั้งหมด
      },
      error: (err) => console.error('Failed to load interns', err)
    });
  }

  filterInterns(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInterns = [...this.interns]; // ถ้าไม่ได้พิมพ์อะไร ให้โชว์ทั้งหมด
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredInterns = this.interns.filter(intern => 
        (intern.full_name || intern.fullName || '').toLowerCase().includes(term)
      );
    }
  }

  openCreateTaskModal(): void {
    this.isModalOpen = true;
    this.searchTerm = ''; // 
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
      done: this.tasks.filter(t => t.status === 'DONE' || t.status === 'REVIEW').length
    };
  }

  deleteTask(taskId: number): void {
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
          alert('เกิดข้อผิดพลาดในการลบงาน');
        }
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleInternSelection(internId: number, event: any): void {
    const selectedIds = (this.taskForm.get('assignedToIds')?.value || []) as number[];

    if (event.target.checked) {
      if (!selectedIds.includes(internId)) {
        selectedIds.push(internId);
      }
    } else {
      const index = selectedIds.indexOf(internId);
      if (index > -1) {
        selectedIds.splice(index, 1);
      }
    }

    this.taskForm.get('assignedToIds')?.setValue(selectedIds);
    this.taskForm.get('assignedToIds')?.markAsTouched();
    this.taskForm.get('assignedToIds')?.updateValueAndValidity();
    
    console.log('Intern IDs ที่ถูกเลือกหลังเปลี่ยนสถานะ:', this.taskForm.get('assignedToIds')?.value);
  }

  onSubmit(): void {
    console.log('--- คลิกปุ่ม Assign Task แล้ว ---');
    console.log('ค่าในฟอร์มปัจจุบัน:', this.taskForm.value);
    console.log('ฟอร์มผ่านเงื่อนไขหรือไม่:', this.taskForm.valid);

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      alert('⚠️ ฟอร์มยังไม่สมบูรณ์! กรุณาตรวจสอบช่องที่มีดอกจัน (*)');
      return;
    }
    
    const formValue = this.taskForm.value;
    const selectedInternIds: number[] = formValue.assignedToIds;

    if (!selectedInternIds || selectedInternIds.length === 0) {
      alert('⚠️ กรุณาติ๊กเลือก Intern อย่างน้อย 1 คนครับ');
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
        alert(`มอบหมายงานให้ Intern จำนวน ${selectedInternIds.length} คน เรียบร้อยแล้ว! 🚀`);
        this.closeModal();
        this.loadTasks(); 
      },
      error: (err) => {
        console.error('Failed to assign tasks', err);
        const errorMsg = err.error?.errors?.assignedToIds || err.error?.message || 'เกิดข้อผิดพลาด';
        alert('❌ ไม่สามารถบันทึกได้: ' + errorMsg);
      }
    });
  }

  openTaskDetail(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.selectedTask = response.data;
          this.isDetailModalOpen = true;
          this.loadComments(taskId);
          this.taskHistories = [
            { changedBy: 'System', oldStatus: null, newStatus: 'TODO', changedAt: new Date(this.selectedTask.createdAt || new Date()) }
          ];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to fetch task details', err)
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedTask = null;
    this.taskComments = [];
    this.taskHistories = [];
    this.newComment = '';
  }

  changeTaskStatus(newStatus: string): void {
    if (!this.selectedTask) return;
    this.taskService.updateTaskStatus(this.selectedTask.id, newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          const oldStatus = this.selectedTask.status;
          this.selectedTask.status = newStatus;
          this.taskHistories.unshift({
            changedBy: 'You (Mentor)',
            oldStatus: oldStatus,
            newStatus: newStatus,
            changedAt: new Date()
          });
          this.loadTasks();
          alert(`เปลี่ยนสถานะงานเป็น ${newStatus} สำเร็จ!`);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert(err.error?.message || 'ไม่สามารถเปลี่ยนสถานะได้');
      }
    });
  }

  loadComments(taskId: number): void {
    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (response) => {
        if (response.success) {
          this.taskComments = response.data
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  submitComment(): void {
    if (!this.newComment.trim() || !this.selectedTask) return;

    const request: CommentRequest = {
      comment: this.newComment
    };
    
    this.commentService.addComment(this.selectedTask.id, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.taskComments.push(response.data)
          this.newComment = '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to submit comment', err);
        alert(err.error?.message || 'ไม่สามารถส่งคอมเมนต์ได้');
      }
    });
  }
  
}

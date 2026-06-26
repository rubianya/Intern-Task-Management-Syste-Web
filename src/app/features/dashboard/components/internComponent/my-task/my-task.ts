import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../../core/services/task.service';
import { CommentService } from '../../../../../core/services/comment.service';
import { CommentRequest, CommentResponse } from '../../../../../core/models/comment.model';
import { FormsModule } from '@angular/forms';

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
  isDetailModalOpen = false;
  selectedTask: any = null;
  taskComments: CommentResponse[] = [];
  taskHistories: any[] = [];
  newComment: string = '';

  constructor(
    private taskService: TaskService,
    private commentService: CommentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyTasks();
  }

  loadMyTasks(): void {
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

  calculateStats(): void {
    this.dashboardStats = {
      total: this.tasks.length,
      todo: this.tasks.filter(t => t.status === 'TODO').length,
      inProgress: this.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      review: this.tasks.filter(t => t.status === 'REVIEW' || t.status === 'DONE').length
    };
  }

  // 🟢 1. ฟังก์ชันเปิด Modal ดึงข้อมูลงาน แชท และสร้างไทม์ไลน์จำลอง
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

  // 🟢 2. โหลดคอมเมนต์
  loadComments(taskId: number): void {
    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (response) => {
        if (response.success) {
          this.taskComments = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  // 🟢 3. ส่งคอมเมนต์
  submitComment(): void {
    if (!this.newComment.trim() || !this.selectedTask) return;
    const request: CommentRequest = { comment: this.newComment };

    this.commentService.addComment(this.selectedTask.id, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.taskComments.push(response.data);
          this.newComment = '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => alert(err.error?.message || 'ไม่สามารถส่งคอมเมนต์ได้')
    });
  }

  // 🟢 4. อัปเดตสถานะงาน (รองรับทั้งการกดจากตารางหน้าแรก และกดจากใน Modal)
  updateMyTaskStatus(taskId: number, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert(`อัปเดตสถานะเป็น ${newStatus} เรียบร้อยแล้ว!`);
          this.loadMyTasks(); // อัปเดตตารางด้านนอก
          
          // ถ้าเปิด Modal อยู่ ให้อัปเดต UI ไทม์ไลน์และสถานะใน Modal ทันที
          if (this.selectedTask && this.selectedTask.id === taskId) {
            const oldStatus = this.selectedTask.status;
            this.selectedTask.status = newStatus;
            
            this.taskHistories.unshift({
              changedBy: 'You (Intern)',
              oldStatus: oldStatus,
              newStatus: newStatus,
              changedAt: new Date()
            });
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => alert(err.error?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ')
    });
  }
}

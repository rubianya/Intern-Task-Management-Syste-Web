import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { CommentService } from '../../../../../core/services/comment.service';
import { LinkService } from '../../../../../core/services/link.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  taskId!: number;
  selectedTask: any = null;
  taskLinks: any[] = [];
  taskComments: any[] = [];
  
  newComment: string = '';
  newLinkLabel: string = '';
  newLinkUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService,
    private linkService: LinkService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.taskId = +idParam;
      this.loadAllData(this.taskId);
    }
  }

  loadAllData(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.selectedTask = res.data;
          this.cdr.detectChanges();
        }
      }
    });

    this.linkService.getLinksByTaskId(taskId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.taskLinks = res.data;
          this.cdr.detectChanges();
        }
      }
    });

    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.taskComments = res.data.sort((a: any, b: any) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          this.cdr.detectChanges();
          
          setTimeout(() => {
            const commentListEl = document.querySelector('.comment-list');
            if (commentListEl) {
              commentListEl.scrollTop = commentListEl.scrollHeight;
            }
          }, 50);
        }
      }
    });
  }

  updateMyTaskStatus(taskId: number, status: string): void {
    if (confirm(`คุณต้องการอัปเดตสถานะงานใช่หรือไม่?`)) {
      this.taskService.updateTaskStatus(taskId, status).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.selectedTask.status = status; 
            alert('อัปเดตสถานะงานเรียบร้อยแล้ว!');
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Failed to update status', err);
          alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
      });
    }
  }

  submitLink(): void {
    if (this.selectedTask.status === 'PENDING' || this.selectedTask.status === 'DONE') {
      alert('ไม่สามารถส่งงานเพิ่มได้ เนื่องจากงานนี้อยู่ในขั้นตอนการตรวจ หรือเสร็จสิ้นแล้วครับ');
      return;
    }
    if (!this.newLinkLabel.trim() || !this.newLinkUrl.trim()) {
      alert('กรุณากรอกลิงก์และ URL ให้ครบถ้วนครับ'); 
      return;
    }
    const req = { label: this.newLinkLabel, url: this.newLinkUrl };
    this.linkService.addLinkToTask(this.selectedTask.id, req).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.taskLinks.push(response.data);
          this.newLinkLabel = ''; 
          this.newLinkUrl = '';
          this.cdr.detectChanges();
        }
      }
    });
  }

  submitComment(): void {
    if (!this.newComment.trim() || !this.selectedTask) return;
    const req = { comment: this.newComment };
    this.commentService.addComment(this.selectedTask.id, req).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.taskComments.push(response.data);
          this.newComment = '';
          this.cdr.detectChanges();
          
          setTimeout(() => {
            const commentListEl = document.querySelector('.comment-list');
            if (commentListEl) {
              commentListEl.scrollTop = commentListEl.scrollHeight;
            }
          }, 50);
        }
      }
    });
  }

  getDueDateClass(dueDate: string | Date | null, status: string): string {
    if (!dueDate || status === 'DONE') return 'due-normal';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'due-danger';
    if (diffDays <= 2) return 'due-warning';
    return 'due-normal';
  }

  goBack(): void {
    this.router.navigate(['/dashboard/my-task']);
  }

}
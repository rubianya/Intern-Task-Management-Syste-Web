import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { CommentService } from '../../../../../core/services/comment.service';
import { LinkService } from '../../../../../core/services/link.service';
import { CommentRequest } from '../../../../../core/models/comment.model';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {

  taskId!: number;
  selectedTask: any = null;
  taskHistories: any[] = [];
  taskLinks: any[] = [];
  taskComments: any[] = [];
  newComment: string = '';
  linkLabel: string = '';
  linkUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService,
    private linkService: LinkService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.taskId = +id;
        this.loadTaskData();
      }
    });
  }

  loadTaskData(): void {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.selectedTask = response.data;
          this.loadComments(this.taskId);
          this.loadLinks(this.taskId);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to fetch task details', err);
        alert('ไม่สามารถโหลดข้อมูลงานได้');
      }
    });
  }

  loadComments(taskId: number): void {
    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.taskComments = response.data.sort((a: any, b: any) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  loadLinks(taskId: number): void {
    this.linkService.getLinksByTaskId(taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.taskLinks = response.data;
          this.cdr.detectChanges();
        }  
      },
      error: (err) => console.error('Failed to load links', err)
    });
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

  submitComment(): void {
    if (!this.newComment.trim() || !this.selectedTask) return;

    const request: CommentRequest = { comment: this.newComment };
    
    this.commentService.addComment(this.selectedTask.id, request).subscribe({
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
      },
      error: (err) => {
        console.error('Failed to submit comment', err);
        alert(err.error?.message || 'ไม่สามารถส่งคอมเมนต์ได้');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/task-management']); 
  }
}
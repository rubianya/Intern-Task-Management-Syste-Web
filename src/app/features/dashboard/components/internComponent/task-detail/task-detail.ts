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
  taskHistories: any[] = [];
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

  loadAllData(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (res: any) => { 
        if (res.success) {
          this.selectedTask = res.data; 
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err)
    });
    this.loadTaskHistories(id);
    this.loadLinks(id);
    this.loadComments(id);
  }

  loadTaskHistories(taskId: number): void {
    this.taskService.getTaskHistories(taskId).subscribe({
      next: (res) => { 
        if (res.success) {
          this.taskHistories = res.data; 
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadLinks(taskId: number): void {
    this.linkService.getLinksByTaskId(taskId).subscribe({
      next: (res) => { 
        if (res.success) {
          this.taskLinks = res.data; 
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadComments(taskId: number): void {
    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (res) => { 
        if (res.success) {
          this.taskComments = res.data; 
          this.cdr.detectChanges();
        }
      }
    });
  }

  updateMyTaskStatus(taskId: number, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.selectedTask.status = newStatus;
          this.cdr.detectChanges();
          this.loadTaskHistories(taskId); 
        }
      },
      error: (err) => alert('Failed to update task status')
    });
  }

  submitLink(): void {
    if (!this.newLinkLabel.trim() || !this.newLinkUrl.trim()) {
      alert('กรุณากรอกลิงก์และ URL ให้ครบถ้วนครับ'); return;
    }
    const req = { label: this.newLinkLabel, url: this.newLinkUrl };
    this.linkService.addLinkToTask(this.selectedTask.id, req).subscribe({
      next: (res) => {
        if (res.success) {
          this.taskLinks.push(res.data);
          this.newLinkLabel = ''; this.newLinkUrl = '';
          this.cdr.detectChanges();
        }
      }
    });
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;
    const req = { comment: this.newComment };
    this.commentService.addComment(this.selectedTask.id, req).subscribe({
      next: (res) => {
        if (res.success) {
          this.taskComments.push(res.data);
          this.newComment = '';
          this.cdr.detectChanges();
        }
      }
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

  goBack(): void {
    this.router.navigate(['/dashboard/my-task']);
  }
}
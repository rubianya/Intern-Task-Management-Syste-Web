import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../../core/services/task.service';
import { CommentResponse } from '../../../../../core/models/comment.model';
import { LinkResponse } from '../../../../../core/models/link.model';
import { StatusHistoryResponse } from '../../../../../core/models/status-history.model';
import { LinkService } from '../../../../../core/services/link.service';
import { CommentService } from '../../../../../core/services/comment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-tasks-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-tasks-detail.html',
  styleUrl: './users-tasks-detail.css',
})
export class UsersTasksDetail {
  
  taskId!: number;
  selectedTask: any = null;
  taskHistories: StatusHistoryResponse[] = [];
  taskLinks: LinkResponse[] = [];
  taskComments: CommentResponse[] = [];
  linkLabel: string = '';
  linkUrl: string = '';
  newComment: string = '';

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
          this.taskComments = response.data.sort((a: CommentResponse, b: CommentResponse) => {
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

  goBack(): void {
    this.router.navigate(['/dashboard/all-users-tasks']); 
  }
}

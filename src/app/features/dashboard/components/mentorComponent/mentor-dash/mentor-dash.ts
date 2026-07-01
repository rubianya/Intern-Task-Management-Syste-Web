import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../../core/services/task.service';
import { UserService } from '../../../../../core/services/user.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-dash',
  imports: [],
  templateUrl: './mentor-dash.html',
  styleUrl: './mentor-dash.css',
})
export class MentorDash implements OnInit {

  dashboardStats = { total: 0, todo: 0, inProgress: 0, pending:0, done: 0 };

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasksUser().subscribe({
      next: (response) => {
        if (response.success) {
          const tasks = response.data;
          this.calculateStats(tasks);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  calculateStats(tasks: any[]): void {
    this.dashboardStats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      pending: tasks.filter(t => t.status === 'PENDING').length,
      done: tasks.filter(t => t.status === 'DONE').length
    };
  }

}

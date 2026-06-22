import { Component, OnInit } from '@angular/core';
import { Task } from '../../../../../core/models/task.model';
import { TaskService } from '../../../../../core/services/task.service';

@Component({
  selector: 'app-mentor-dash',
  imports: [],
  templateUrl: './mentor-dash.html',
  styleUrl: './mentor-dash.css',
})
export class MentorDash implements OnInit {
tasks: Task[] = [];
  
  // ตัวแปรสำหรับ Dashboard สรุป
  dashboardStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        if (response.success) {
          this.tasks = response.data;
          this.calculateStats();
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
      done: this.tasks.filter(t => t.status === 'DONE').length
    };
  }

  deleteTask(taskId: number): void {
    if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (response) => {
          if (response.success) {
            alert(response.message); // 'ลบข้อมูลงาน ID ... ออกจากระบบสำเร็จเรียบร้อยแล้ว'
            this.loadTasks(); // โหลดข้อมูลใหม่เพื่ออัปเดตตาราง
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('เกิดข้อผิดพลาดในการลบงาน');
        }
      });
    }
  }

  // เตรียมฟังก์ชันสำหรับอัปเดตสถานะ (Mentor อาจจะต้องเปลี่ยนจาก IN_PROGRESS ไป DONE)
  changeTaskStatus(taskId: number, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTasks(); // รีเฟรชข้อมูล
        }
      }
    });
  }

}

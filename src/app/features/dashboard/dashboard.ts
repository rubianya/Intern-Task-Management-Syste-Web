import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Navbar } from '../shared/navbar/navbar';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Navbar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  role: 'Admin' | 'Mentor' | 'Intern' = 'Intern'; 
  UserName = '';
  UserEmail = '';
  UserRoleDisplay = ''; 

  constructor(
    private router: Router, 
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserProfile().subscribe({
      next: (response: any) => {
        
        this.role = response.data.role;

        if (this.router.url === '/dashboard') {
          if (this.role === 'Admin') {
            this.router.navigate(['/dashboard/admin']);
          } else if (this.role === 'Mentor') {
            this.router.navigate(['/dashboard/mentor']);
          } else {
            this.router.navigate(['/dashboard/intern']);
          }
        }

        this.UserRoleDisplay = response.data.role;
        this.UserName = response.data.full_name;
        this.UserEmail = response.data.email;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', error);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Navbar } from '../shared/navbar/navbar'; // <-- Import Navbar เข้ามา
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Navbar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  role: 'ADMIN' | 'MENTOR' | 'INTERN' = 'INTERN'; 
  UserName = '';
  UserEmail = '';
  UserRoleDisplay = ''; 

  // (ตัวแปร isDropdownOpen และฟังก์ชัน toggle ต่างๆ ถูกลบออก เพราะย้ายไป navbar แล้ว)

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserProfile().subscribe({
      next: (profile: any) => {
        const upperCaseRole = profile.role?.toUpperCase();
        if (['ADMIN', 'MENTOR', 'INTERN'].includes(upperCaseRole)) {
          this.role = upperCaseRole;
        } else {
          this.role = 'INTERN';
        }

        if (this.router.url === '/dashboard') {
          if (this.role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else if (this.role === 'MENTOR') {
            this.router.navigate(['/dashboard/mentor']);
          } else {
            this.router.navigate(['/dashboard/intern']);
          }
        }

        this.UserRoleDisplay = profile.role;
        this.UserName = profile.full_name;
        this.UserEmail = profile.email;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', err);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
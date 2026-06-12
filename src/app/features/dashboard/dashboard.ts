import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { AdminDash } from './components/admin-dash/admin-dash';
import { MentorDash } from './components/mentor-dash/mentor-dash';
import { InternDash } from './components/intern-dash/intern-dash';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminDash, MentorDash, InternDash],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  // กำหนดค่าเริ่มต้นเป็นสิทธิ์ว่างเปล่า หรือสิทธิ์เริ่มต้นไว้ก่อน
  role: 'ADMIN' | 'MENTOR' | 'INTERN' = 'INTERN'; 
  UserName = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 1. ดึงข้อมูลสิทธิ์ (role) และชื่อจาก localStorage ที่เราบันทึกไว้ตอน Login สำเร็จ
    const savedRole = localStorage.getItem('role');
    const savedName = localStorage.getItem('full_name');

    // 2. ตรวจสอบความปลอดภัย: ถ้าไม่มีข้อมูล 
    // ให้เด้งกลับไปหน้า Login ทันที เพื่อป้องกันแอบเข้าทาง URL Direct ลัด
    if (!savedRole || !savedName) {
      alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      this.router.navigate(['/login']);
      return;
    }

    // 3. แปลงค่าสิทธิ์ให้เป็นตัวพิมพ์ใหญ่ (Upper Case) เพื่อให้ตรงเงื่อนไข @if ของคุณ
    const upperCaseRole = savedRole.toUpperCase();

    if (upperCaseRole === 'ADMIN' || upperCaseRole === 'MENTOR' || upperCaseRole === 'INTERN') {
      this.role = upperCaseRole;
    } else {
      this.role = 'INTERN'; 
    }

    // 4. แสดงชื่อผู้ใช้งานจริงบนแท็บมุมขวาบน
    this.UserName = savedName;
  }
}
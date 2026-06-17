import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {

  displayFullName = '';
  displayEmail = '';
  role = '';

  editFullName = '';
  editEmail = '';

  userId!: number;
  originalProfile: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile: any) => {

        console.log('ข้อมูลโปรไฟล์ทั้งหมดที่ได้จาก API:', profile);

        this.userId = profile.id;
        this.originalProfile = profile;

        this.displayFullName = profile.full_name;
        this.displayEmail = profile.email;
        this.role = profile.role?.toUpperCase() || 'INTERN';

        this.editFullName = profile.full_name;
        this.editEmail = profile.email;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', err);
        this.router.navigate(['/login']);
      }
    });
  }

  saveProfile() {
    const updateData = {
      ...this.originalProfile,
      full_name: this.editFullName,
      email: this.editEmail
    };

    console.log('📦 ข้อมูลที่จะส่งไปอัปเดต:', updateData);

    this.authService.updateProfile(this.userId, updateData).subscribe({
      next: (response: any) => {   
        alert('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว! กรุณาเข้าสู่ระบบใหม่อีกครั้งเพื่อความปลอดภัย');
        
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('อัปเดตล้มเหลว', err);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    });
  }
  cancel() {
    this.router.navigate(['/dashboard/admin']);
  }
}
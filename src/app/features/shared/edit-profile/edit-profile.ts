import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {

  profileForm!: FormGroup;
  originalProfile!: User;
  userId!: number;

  displayFullName = '';
  displayEmail = '';
  displayPassword ='';
  role = '';

  editFullName = '';
  editEmail = '';
  editPassword = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = new FormGroup({
      full_name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (response: any) => {

        const profile = response.data as User;

        console.log('ข้อมูลโปรไฟล์ทั้งหมดที่ได้จาก API:', profile);

        this.userId = profile.id;
        this.originalProfile = profile;

        this.displayFullName = profile.full_name;
        this.displayEmail = profile.email;
        this.displayPassword = profile.password;
        this.role = profile.role;

        this.profileForm.patchValue({
          full_name: profile.full_name,
          email: profile.email,
          password: profile.password
        });

        this.editFullName = profile.full_name;
        this.editEmail = profile.email;
        this.editPassword = profile.password;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', err);
        this.router.navigate(['/login']);
      }
    });
  }

  saveProfile() {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updateData: Partial<User> = {
      ...this.originalProfile,
      full_name: this.profileForm.value.full_name,
      email: this.profileForm.value.email,
      password: this.profileForm.value.password
    };

    console.log('ข้อมูลที่จะส่งไปอัปเดต:', updateData);

    this.userService.updateProfile(this.userId, updateData).subscribe({
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
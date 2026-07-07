import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../../core/models/auth.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (this.loginForm.valid) {
      localStorage.removeItem('token'); 

      const payload = this.loginForm.value;

      this.authService.login(payload).subscribe({
        next: (response: LoginResponse) => {
          if (response && response.success && response.data) {
              const userData = response.data;

              if (userData.active === 1 || userData.active === true) {
                console.log('Login สำเร็จ', response);
                localStorage.setItem('token', userData.token);
                this.router.navigate(['/dashboard']);
              } else {
                alert('บัญชีผู้ใช้ของคุณยังไม่ได้รับการอนุมัติ');
              }
            }
        },
        error: (error) => {
          console.error('Login ล้มเหลว', error);
          if (error.status === 403) {
              alert('เซสชันหมดอายุ หรือไม่มีสิทธิ์เข้าถึง กรุณาล็อกอินใหม่');
          } else {
              alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          }
        }
      });

    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน!');
      this.loginForm.markAllAsTouched();
    }
  }
}
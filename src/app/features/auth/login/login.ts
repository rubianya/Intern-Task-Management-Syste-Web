import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';
  private loginUrl = 'http://localhost:8080/api/login';

  constructor(private router: Router, private http: HttpClient) {}

  login() {

    if (!this.email || !this.password) {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน!');
      return;
    }

    const loginPayload = {
      email: this.email,
      password: this.password
    };

    this.http.post(this.loginUrl, loginPayload).subscribe({
    next: (response: any) => {
        console.log('Login สำเร็จ', response);

        if (response.active == 0) { 
          alert('บัญชีนี้ถูกปิดใช้งานชั่วคราว ไม่สามารถเข้าสู่ระบบได้!');
          return;
        }

        // localStorage.setItem('full_name', response.fullName || response.full_Name);
        localStorage.setItem('role', response.role);

        if (response.role === 'ADMIN') {
          alert('ยินดีต้อนรับผู้ดูแลระบบ');
          this.router.navigate(['/dashboard']);
        } else {
          alert('เข้าสู่ระบบสำเร็จ');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login ล้มเหลว', error);
        if (error.error && error.error.message) {
          alert(error.error.message); 
        } else {
          alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง!');
        }
      }
    });
  }
}
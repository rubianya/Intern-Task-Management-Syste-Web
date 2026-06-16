import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  login() {

    if (this.email && this.password) {

      const payload = { email: this.email, password: this.password };

      this.authService.login(payload).subscribe({
        next: (response: any) => {
          if (response.active === 1 || response.active === true) {
            console.log('Login สำเร็จ', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);
          } else {
            alert('บัญชีผู้ใช้ของคุณยังไม่ได้รับการอนุมัติ');
          }
        },
        error: (error) => {
          console.error('Login ล้มเหลว', error);
          alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง!');
        }
      });

    } else {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน!');
    }

  }
}
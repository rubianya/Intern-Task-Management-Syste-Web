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

  constructor(private router: Router, private http: HttpClient) {}

  login() {

    if (this.email && this.password) {

      const loginPayload = {
        email: this.email,
        password: this.password
      };
      this.http.post('http://localhost:8080/api/login', loginPayload).subscribe({
        next: (response: any) => {

          console.log('Login สำเร็จ', response);

          localStorage.setItem('full_name', response.full_name);
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);

          this.router.navigate(['/dashboard']);
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
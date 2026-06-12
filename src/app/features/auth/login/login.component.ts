// import { Component } from '@angular/core';
// import { AuthService } from '../auth-service/auth-service';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class LoginComponent {
//   loginData = { email: '', password: '' };

//   constructor(private auth: AuthService, private router: Router) {}

//   onLogin() {
//     this.auth.login(this.loginData).subscribe({
//       next: () => this.router.navigate(['/dashboard']),
//       error: (err) => alert('Login failed: ' + err.message)
//     });
//   }
// }
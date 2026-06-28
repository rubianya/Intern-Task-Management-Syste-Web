import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  } else {
    alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    router.navigate(['/login']);
    return false;
  }
  
};

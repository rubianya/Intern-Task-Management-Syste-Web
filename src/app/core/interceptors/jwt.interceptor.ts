import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // ดึง Token จาก LocalStorage
  const token = localStorage.getItem('token');

  // ถ้ามี Token ให้ Clone request เดิม แล้วเพิ่ม Header Authorization เข้าไป
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ส่ง Request ไปทำงานต่อ
  return next(req);
};
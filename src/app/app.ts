import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterOutlet, Router } from '@angular/router';
import NProgress from 'nprogress';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    constructor(private router: Router) {

  // เพิ่มการตั้งค่าความเร็วตรงนี้
    NProgress.configure({ 
      showSpinner: false, // ปิดวงกลมหมุนๆ (จากเดิม)
      speed: 500,        // ความเร็วของอนิเมชันในการวิ่ง (ค่าเริ่มต้นคือ 200ms) ยิ่งเยอะยิ่งช้า
      trickleSpeed: 500   // ความถี่ในการขยับแถบไปข้างหน้าทีละนิด (ค่าเริ่มต้นคือ 800ms) ยิ่งเยอะยิ่งขยับช้า
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        NProgress.start();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        NProgress.done(); 
        }
    });

  }
}

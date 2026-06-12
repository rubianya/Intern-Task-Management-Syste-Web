import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  @Input()
  role: string = ''; // ค่าเริ่มต้นเป็น 'ADMIN' สามารถเปลี่ยนได้ตามต้องการ

}

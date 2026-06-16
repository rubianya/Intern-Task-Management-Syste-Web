import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface User {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Mentor' | 'Intern';
  status: 'Active' | 'Inactive' ;
}

@Component({
  selector: 'app-users-management',
  imports: [CommonModule],
  templateUrl: './users-management.html',
  styleUrl: './users-management.css',
})
export class UsersManagement {

  users: User[] = [
    { id: '1', full_name: 'John Smith', email: 'john.smith@gmail.com', password: 'jonny77', status: 'Active', role: 'Admin' },
    { id: '2', full_name: 'Olivia Bennett', email: 'ollyben@gmail.com', password: 'olly659', status: 'Inactive', role: 'Mentor' },
    { id: '3', full_name: 'Daniel Warren', email: 'dwarren3@gmail.com', password: 'dwarren3', status: 'Active', role: 'Intern' },
    { id: '4', full_name: 'Chloe Hayes', email: 'chloehhye@gmail.com', password: 'chloehh', status: 'Inactive', role: 'Intern' },
    { id: '5', full_name: 'Marcus Reed', email: 'reeds777@gmail.com', password: 'reeds7', status: 'Active', role: 'Intern' }
  ];

  editUser(user: User) {
    console.log('Editing user:', user.full_name);
    // TODO: เรียกใช้งานฟอร์ม Modal สำหรับแก้ไขข้อมูล
  }

  deleteUser(userId: string) {
    console.log('Deleting user ID:', userId);
    // TODO: แสดง Pop-up ยืนยันการลบ
  }

}

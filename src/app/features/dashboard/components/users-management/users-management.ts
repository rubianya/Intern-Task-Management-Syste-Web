import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';

export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.html',
  styleUrl: './users-management.css',
})
export class UsersManagement {

  users: User[] = [];

  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  
  userForm: User = {
    id: 0, full_name: '', email: '', password: '', role: 'INTERN', active: true
  };

  isDeleteModalOpen: boolean = false;
  userIdToDelete: number | null = null;

constructor(
    private userService: UserService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const searchLower = this.searchTerm.toLowerCase();

      const matchesSearch = user.full_name?.toLowerCase().includes(searchLower) || 
                            user.email?.toLowerCase().includes(searchLower);

      const matchesRole = this.selectedRole ? user.role?.toUpperCase() === this.selectedRole.toUpperCase() : true;
      
      let matchesStatus = true;
      if (this.selectedStatus === 'Active') {
        matchesStatus = user.active === true;
      } else if (this.selectedStatus === 'Inactive') {
        matchesStatus = user.active === false;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  openAddUserModal() {
    this.isEditMode = false;
    this.userForm = { id: 0, full_name: '', email: '', password: '', role: 'INTERN', active: true };
    this.isModalOpen = true;
  }

  editUser(user: User) {
    this.isEditMode = true;
    this.userForm = { ...user };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (!this.userForm.full_name || !this.userForm.email || !this.userForm.password) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.userForm.id, this.userForm).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            // อัปเดตข้อมูล และสร้าง Array ใหม่เพื่อให้ระบบตรวจจับการเปลี่ยนแปลง
            this.users[index] = updatedUser;
            this.users = [...this.users]; 
          }
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      this.userService.createUser(this.userForm).subscribe({
        next: (newUser) => {
          this.users = [...this.users, newUser]; 
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  deleteUser(userId: number) {
    this.userIdToDelete = userId;
    this.isDeleteModalOpen = true; 
  }

  confirmDelete() {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.userIdToDelete);
          this.closeDeleteModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.userIdToDelete = null;
  }

  ///// ตัวแปรสำหรับแบ่งหน้า (Pagination) /////
  currentPage: number = 1;
  itemsPerPage: number = 10;

  onFilterChange() {
    this.currentPage = 1;
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1 ) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1;
  }

  get startIndex(): number {
    return this.filteredUsers.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredUsers.length ? this.filteredUsers.length : end;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
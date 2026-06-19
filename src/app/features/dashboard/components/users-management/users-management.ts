import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
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
  isDeleteModalOpen: boolean = false;
  userIdToDelete: number | null = null;

  userFormGroup = new FormGroup({
    id: new FormControl(0),
    full_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(8)]),
    role: new FormControl('Intern', [Validators.required]),
    active: new FormControl(true, Validators.required)
  });

  constructor(
    private userService: UserService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
        console.log('ข้อมูล Users ที่ดึงมาได้:', this.users);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(response => {
      const searchLower = this.searchTerm.toLowerCase();

      const matchesSearch = //response.id.toString().toLowerCase().includes(searchLower) ||
                            response.full_name?.toLowerCase().includes(searchLower) || 
                            response.email?.toLowerCase().includes(searchLower);

      const matchesRole = this.selectedRole ? response.role?.toUpperCase() === this.selectedRole.toUpperCase() : true;
      
      let matchesStatus = true;
      if (this.selectedStatus === 'Active') {
        matchesStatus = response.active === true;
      } else if (this.selectedStatus === 'Inactive') {
        matchesStatus = response.active === false;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  openAddUserModal() {

    this.isEditMode = false;

    this.userFormGroup.reset({ id: 0, role: 'Intern', active: true, password: '' });

    // บังคับให้กรอกรหัสผ่าน
    this.userFormGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userFormGroup.get('password')?.updateValueAndValidity();

    this.isModalOpen = true;

  }

  openEditUserModal(response: User) {

    this.isEditMode = true;

    this.userFormGroup.patchValue({
      id: response.id,
      full_name: response.full_name,
      email: response.email,
      role: response.role,
      active: response.active === 1 || response.active === true,
      password: ''
    });

    this.userFormGroup.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userFormGroup.get('password')?.updateValueAndValidity();

    this.isModalOpen = true;

  }

  closeModal() {
    this.isModalOpen = false;
    this.userFormGroup.reset();
  }

  saveUser() {
    
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
      return;
    }

    const userData = this.userFormGroup.getRawValue() as User;

    // const rawData = this.userFormGroup.getRawValue();
    // const userData: any = {
    //   id: Number(rawData.id),
    //   full_name: rawData.full_name,
    //   email: rawData.email,
    //   role: rawData.role,
    //   active: rawData.active
    // };
    // if (rawData.password && rawData.password.trim() !== '') {
    //   userData.password = rawData.password;
    // } else if (!this.isEditMode) {
    //   alert('Password is required for new users.');
    //   return;
    // }

    if (this.isEditMode) {
      this.userService.updateUser(Number(userData.id), userData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.users = [...this.users]; 
          }
          this.closeModal();
          this.cdr.detectChanges();
          this.loadUsers();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      console.log('ข้อมูลที่จะส่งไปสร้าง User ใหม่:', userData);
      this.userService.createUser(userData).subscribe({
        next: (newUser) => {
          this.users = [...this.users, newUser]; 
          alert('บันทึกข้อมูลสำเร็จ!');
          this.closeModal();
          this.cdr.detectChanges();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Create failed:', err)
          alert('บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบข้อมูลหรือรหัสผ่านให้ถูกต้อง');
        }
      });
    }
  }

  openDeleteModal(userId: number) {
    this.userIdToDelete = userId;
    this.isDeleteModalOpen = true; 
  }

  confirmDelete() {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.users = this.users.filter(response => response.id !== this.userIdToDelete);
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



  // ----- ตัวแปรสำหรับแบ่งหน้า (Pagination) -----
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
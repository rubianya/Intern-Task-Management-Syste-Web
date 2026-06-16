import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  @Input() UserName = '';
  @Input() UserEmail = '';

  isDropdownOpen = false;

  constructor(private router: Router) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isDropdownOpen = false;
  }

  goToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

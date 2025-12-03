import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;
  showNotifications = false;
  showSearch = false;
  searchQuery = '';

  notifications = [
    { id: 1, type: 'vote', message: 'Sarah Chen upvoted your idea "AI Customer Support Bot"', time: '5m ago', read: false },
    { id: 2, type: 'comment', message: 'New comment on "Mobile App Redesign"', time: '1h ago', read: false },
    { id: 3, type: 'mention', message: 'Marcus Rodriguez mentioned you in a comment', time: '2h ago', read: false },
    { id: 4, type: 'status', message: 'Your idea "Automated Testing" was approved', time: '1d ago', read: true }
  ];

  searchResults = [
    { type: 'idea', title: 'AI Customer Support Bot', votes: 247 },
    { type: 'person', name: 'Sarah Chen', role: 'Product Manager' },
    { type: 'topic', name: 'Artificial Intelligence', count: 15 }
  ];

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.showSearch = this.searchQuery.length > 0;
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(`Logout failed: ${error.message}`);
      }
    });
  }
}

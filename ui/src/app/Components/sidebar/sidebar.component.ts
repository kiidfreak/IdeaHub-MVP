import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  navItems: NavItem[] = [
    { icon: '🏠', label: 'Home', route: '/home' },
    { icon: '💡', label: 'Ideas', route: '/ideas', badge: 12 },
    { icon: '🏆', label: 'Leaderboard', route: '/leaderboard' },
    { icon: '📊', label: 'Analytics', route: '/analytics' },
    { icon: '🔔', label: 'Activity', route: '/activity', badge: 3 },
    { icon: '👤', label: 'Profile', route: '/profile' }
  ];

  toggleSidebar() {
    this.toggle.emit();
  }
}

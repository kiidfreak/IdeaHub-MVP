import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutComponent } from '../../Components/base-layout/base-layout.component';
import { UserStatsCardComponent } from '../../Components/user-stats-card/user-stats-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, UserStatsCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user = {
    name: 'User Name',
    email: 'user@ideahub.com',
    role: 'Product Manager',
    department: 'Innovation',
    joinDate: 'January 2024',
    avatar: 'U'
  };

  recentIdeas = [
    { id: 1, title: 'AI Customer Support Bot', votes: 247, status: 'In Progress' },
    { id: 2, title: 'Mobile App Redesign', votes: 156, status: 'Approved' },
    { id: 3, title: 'Automated Testing Pipeline', votes: 89, status: 'Under Review' }
  ];

  contributions = {
    ideasPosted: 12,
    commentsGiven: 45,
    votesReceived: 892,
    helpfulVotes: 234
  };
}

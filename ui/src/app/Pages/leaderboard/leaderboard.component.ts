import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutComponent } from '../../Components/base-layout/base-layout.component';
import { LeaderboardUser } from '../../Interfaces/User/leaderboard.interface';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  topContributors: LeaderboardUser[] = [];
  selectedPeriod: 'week' | 'month' | 'all' = 'week';

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    // Mock data
    this.topContributors = [
      { rank: 1, userId: '1', name: 'Sarah Chen', level: 'Legend', points: 1250, ideasPosted: 25, votesReceived: 450, trend: 'up', rankChange: 2 },
      { rank: 2, userId: '2', name: 'Marcus Rodriguez', level: 'Visionary', points: 1180, ideasPosted: 22, votesReceived: 420, trend: 'down', rankChange: 1 },
      { rank: 3, userId: '3', name: 'Emma Watson', level: 'Visionary', points: 1050, ideasPosted: 21, votesReceived: 380, trend: 'up', rankChange: 3 },
      { rank: 4, userId: '4', name: 'Alex Kim', level: 'Expert', points: 920, ideasPosted: 18, votesReceived: 340, trend: 'same' },
      { rank: 5, userId: '5', name: 'Jordan Smith', level: 'Expert', points: 875, ideasPosted: 17, votesReceived: 310, trend: 'up', rankChange: 1 },
      { rank: 6, userId: '6', name: 'Taylor Johnson', level: 'Specialist', points: 720, ideasPosted: 14, votesReceived: 280, trend: 'down', rankChange: 2 },
      { rank: 7, userId: '7', name: 'Casey Morgan', level: 'Specialist', points: 650, ideasPosted: 13, votesReceived: 240, trend: 'up', rankChange: 4 },
      { rank: 8, userId: '8', name: 'Riley Cooper', level: 'Specialist', points: 580, ideasPosted: 11, votesReceived: 210, trend: 'same' },
    ];
  }

  selectPeriod(period: 'week' | 'month' | 'all') {
    this.selectedPeriod = period;
    this.loadLeaderboard();
  }

  getTrendIcon(trend?: 'up' | 'down' | 'same'): string {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'Legend': '#fa709a',
      'Visionary': '#667eea',
      'Expert': '#764ba2',
      'Specialist': '#10b981',
      'Intern': '#f59e0b'
    };
    return colors[level] || '#667eea';
  }
}

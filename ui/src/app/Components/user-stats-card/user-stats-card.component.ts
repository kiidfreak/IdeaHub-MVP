import { Component, Input } from '@angular/core';
import { UserStats } from '../../Interfaces/User/user-stats.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-stats-card.component.html',
  styleUrl: './user-stats-card.component.scss'
})
export class UserStatsCardComponent {
  @Input() stats: UserStats = {
    points: 285,
    level: 'Specialist',
    xp: 285,
    xpToNextLevel: 500,
    streak: 7,
    ideasPosted: 3,
    votesReceived: 82,
    badges: [
      { id: '1', name: 'Innovator', icon: '💡', description: 'Posted first idea', earned: true, earnedAt: '2024-01-10' },
      { id: '2', name: 'Trend Setter', icon: '🔥', description: 'Idea got 50+ votes', earned: true, earnedAt: '2024-01-15' },
      { id: '3', name: 'Team Player', icon: '🤝', description: 'Voted on 20 ideas', earned: false }
    ]
  };

  get xpPercentage(): number {
    return (this.stats.xp / this.stats.xpToNextLevel) * 100;
  }

  get earnedBadges() {
    return this.stats.badges.filter(b => b.earned);
  }
}

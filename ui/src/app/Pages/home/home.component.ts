import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth/auth.service';
import { IdeaService } from '../../Services/idea/idea.service';
import { Idea } from '../../Interfaces/Idea/idea.interface';
import { IdeaCardComponent } from '../../Components/idea-card/idea-card.component';
import { BaseLayoutComponent } from '../../Components/base-layout/base-layout.component';
import { CreateIdeaComponent } from '../../Components/create-idea/create-idea.component';
import { UserStatsCardComponent } from '../../Components/user-stats-card/user-stats-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IdeaCardComponent, BaseLayoutComponent, CreateIdeaComponent, UserStatsCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  ideaService = inject(IdeaService);
  router = inject(Router);

  ideas: Idea[] = [];
  showCreateModal = false;

  ngOnInit(): void {
    this.loadIdeas();
  }

  loadIdeas() {
    this.ideaService.getIdeas().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.ideas = response.data;
        }
      },
      error: (err) => console.error('Failed to load ideas', err)
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }

  onVote(ideaId: number) {
    console.log('Voted for idea:', ideaId);
    // TODO: Implement vote API call
    // For now, optimistically update the vote count
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.voteCount++;
    }
  }

  onViewDetails(ideaId: number) {
    console.log('View details for idea:', ideaId);
    // TODO: Navigate to idea details page
  }
}

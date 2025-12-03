import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Idea } from '../../Interfaces/Idea/idea.interface';

@Component({
  selector: 'app-idea-card',
  standalone: true,
  imports: [],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss'
})
export class IdeaCardComponent {
  @Input({ required: true }) idea!: Idea;
  @Output() vote = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  onVote() {
    this.vote.emit(this.idea.id);
  }

  onViewDetails() {
    this.viewDetails.emit(this.idea.id);
  }
}

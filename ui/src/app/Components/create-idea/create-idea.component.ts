import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IdeaService } from '../../Services/idea/idea.service';
import { CreateIdeaDto } from '../../Interfaces/Idea/idea.interface';

@Component({
  selector: 'app-create-idea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-idea.component.html',
  styleUrl: './create-idea.component.scss'
})
export class CreateIdeaComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  ideaService = inject(IdeaService);

  ideaForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    category: new FormControl('Feature Request', { validators: [Validators.required], nonNullable: true }),
    priority: new FormControl('Medium', { validators: [Validators.required], nonNullable: true })
  });

  categories = ['Feature Request', 'Bug Fix', 'Process Improvement', 'Cost Saving'];
  priorities = ['Low', 'Medium', 'High', 'Critical'];

  onSubmit() {
    if (this.ideaForm.valid) {
      const ideaData = this.ideaForm.getRawValue() as CreateIdeaDto;
      this.ideaService.createIdea(ideaData).subscribe({
        next: () => {
          this.created.emit();
          this.close.emit();
        },
        error: (err) => console.error('Failed to create idea', err)
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}

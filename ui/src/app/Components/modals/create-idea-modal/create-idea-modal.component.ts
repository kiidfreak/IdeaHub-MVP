import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { IdeasService } from '../../../Services/ideas.services';
import { CreateIdeaRequest } from '../../../Interfaces/Ideas/idea-interfaces';

@Component({
  selector: 'app-create-idea-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './create-idea-modal.component.html',
  styleUrls: ['./create-idea-modal.component.scss']
})
export class CreateIdeaModalComponent {
  ideaForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private ideasService: IdeasService,
    public dialogRef: MatDialogRef<CreateIdeaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string }
  ) {
    this.ideaForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.ideaForm.invalid) return;

    this.isSubmitting = true;
    const request: CreateIdeaRequest = {
      groupId: this.data.groupId,
      title: this.ideaForm.value.title,
      description: this.ideaForm.value.description
    };

    this.ideasService.createIdea(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.dialogRef.close(true); // Return true to indicate success
        } else {
          alert(response.message || 'Failed to create idea.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating idea:', err);
        alert('Failed to create idea. Please try again.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get title() { return this.ideaForm.get('title'); }
  get description() { return this.ideaForm.get('description'); }
}

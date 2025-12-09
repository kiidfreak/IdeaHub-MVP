import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GroupsService } from '../../../Services/groups.service';

@Component({
  selector: 'app-group-configuration-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './group-configuration-modal.component.html',
  styleUrls: ['./group-configuration-modal.component.scss']
})
export class GroupConfigurationModalComponent {
  configForm: FormGroup;
  isSubmitting = false;
  group: any;

  constructor(
    private fb: FormBuilder,
    private groupsService: GroupsService,
    public dialogRef: MatDialogRef<GroupConfigurationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: any }
  ) {
    this.group = data.group;
    this.configForm = this.fb.group({
      name: [this.group.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.group.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.configForm.invalid) return;

    this.isSubmitting = true;
    const updateData = {
      name: this.configForm.value.name,
      description: this.configForm.value.description
    };

    this.groupsService.updateGroup(this.group.id, updateData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.dialogRef.close(true);
        } else {
          alert(response.message || 'Failed to update group.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating group:', err);
        alert('Failed to update group.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

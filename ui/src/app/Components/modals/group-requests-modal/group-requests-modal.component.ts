import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GroupsService } from '../../../Services/groups.service';

@Component({
  selector: 'app-group-requests-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './group-requests-modal.component.html',
  styleUrls: ['./group-requests-modal.component.scss']
})
export class GroupRequestsModalComponent implements OnInit {
  requests: string[] = []; // The API returns a list of user IDs (strings)
  isLoading = true;
  group: any;

  constructor(
    public dialogRef: MatDialogRef<GroupRequestsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService
  ) {
    this.group = data.group;
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.groupsService.viewRequests(this.group.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          // The API returns a list of user IDs currently. 
          // Ideally it should return user objects with names/emails.
          // For now we will display the IDs.
          this.requests = response.data;
        } else {
          this.requests = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading requests:', err);
        this.requests = [];
      }
    });
  }

  accept(userId: string): void {
    this.groupsService.acceptRequest(this.group.id, userId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Request accepted!');
          this.loadRequests(); // Reload list
        } else {
          alert(response.message || 'Failed to accept request.');
        }
      },
      error: (err) => {
        console.error('Error accepting request:', err);
        alert('Failed to accept request.');
      }
    });
  }

  reject(userId: string): void {
    if (!confirm('Are you sure you want to reject this request?')) return;

    this.groupsService.rejectRequest(this.group.id, userId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Request rejected.');
          this.loadRequests(); // Reload list
        } else {
          alert(response.message || 'Failed to reject request.');
        }
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        alert('Failed to reject request.');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

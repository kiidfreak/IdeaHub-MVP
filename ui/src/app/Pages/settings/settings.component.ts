import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseLayoutComponent } from '../../Components/base-layout/base-layout.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseLayoutComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settings = {
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      ideaUpdates: true,
      newComments: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showStats: true
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      itemsPerPage: 20
    }
  };

  saveSettings() {
    console.log('Settings saved:', this.settings);
    // TODO: Implement API call to save settings
  }
}

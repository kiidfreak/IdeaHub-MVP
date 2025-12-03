import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { RegisterComponent } from './Pages/register/register.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./Pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'confirm-registration',
    loadComponent: () =>
      import(
        './Pages/confirm-registration/confirm-registration.component'
      ).then((m) => m.ConfirmRegistrationComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'leaderboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'ideas',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/ideas/ideas.component').then((m) => m.IdeasComponent),
  },
  {
    path: 'analytics',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    path: 'activity',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./Pages/activity/activity.component').then((m) => m.ActivityComponent),
  },
];

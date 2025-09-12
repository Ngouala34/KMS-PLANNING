import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators'; // ← catchError vient de 'rxjs/operators'
// Services
import { UserService } from '../../services/user/user.service';
import { UserNotificationService } from '../../services/user/userNotification.service';
import { DashboardAppointment, UserNotification, UserProfile, UserStats } from 'src/app/Interfaces/iuser';

// Interfaces

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy, OnChanges {
  // Configuration
  private destroy$ = new Subject<void>();
  
  // State
  isSidebarCollapsed = false;
  isLoading = true;
  error: string | null = null;
  
  // User Data
  userName = '';
  userProfile: UserProfile | null = null;
  
  // Dashboard Data
  alerts: UserNotification[] = [];
  stats: UserStats = {
    upcomingAppointments: 0,
    completedFormations: 0,
    souscriptions: 0,
    favoris: 0
  };
  
  upcomingAppointments: DashboardAppointment[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private userNotificationService: UserNotificationService
  ) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Réagir aux changements des inputs si nécessaire
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  // Public Methods
  onServiceList(): void {
    this.navigateToServiceList();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  // Private Methods - Initialization
  private initializeComponent(): void {
    this.loadUserData();
    this.loadNotifications();
    this.loadDashboardData();
  }

  private loadUserData(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: unknown) => {
          // Validation du type
          if (this.isUserProfileOrNull(response)) {
            this.handleUserData(response);
          } else {
            console.error('Invalid user data format:', response);
            this.handleUserData(null);
          }
        },
        error: (error) => this.handleUserError(error)
      });
  }

  // Méthode de validation
  private isUserProfileOrNull(obj: unknown): obj is UserProfile | null {
    return obj === null || this.isUserProfile(obj);
  }



  private handleUserData(user: UserProfile | null): void {
    if (user) {
      this.userProfile = user;
      this.userName = user.name;
    } else {
      this.fetchUserProfile();
    }
  }

  private fetchUserProfile(): void {
    this.userService.getProfile()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => this.handleProfileError(error))
      )
      .subscribe({
        next: (response: any) => {
          // Validation du type
          if (this.isUserProfile(response)) {
            this.handleProfileSuccess(response);
          } else {
            console.error('Invalid user profile response:', response);
            this.handleProfileError(new Error('Invalid user profile format'));
          }
        },
        error: (error) => this.handleProfileError(error)
      });
  }

// Méthode de validation
private isUserProfile(obj: any): obj is UserProfile {
  return obj && 
         typeof obj.id === 'number' &&
         typeof obj.name === 'string' &&
         typeof obj.email === 'string' &&
         typeof obj.user_type === 'string';
}

  private handleProfileSuccess(profile: UserProfile): void {
    this.userProfile = profile;
    this.userName = profile.name;
  }

  private handleProfileError(error: any): any {
    console.error('Error loading user profile:', error);
    this.error = 'Impossible de charger le profil utilisateur';
    this.userName = 'Utilisateur';
    return of(null);
  }

  private handleUserError(error: any): void {
    console.error('Error in user stream:', error);
    this.error = 'Erreur de chargement des données utilisateur';
  }

  // Private Methods - Notifications
    private loadNotifications(): void {
      this.userNotificationService.getUserNotifications()
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => this.handleNotificationsError(error))
        )
        .subscribe({
          next: (response: any) => {
            // Validation du type
            if (Array.isArray(response)) {
              this.handleNotificationsSuccess(response as UserNotification[]);
            } else {
              console.error('Invalid notifications response:', response);
              this.alerts = [];
            }
          }
        });
    }

  private handleNotificationsSuccess(notifications: UserNotification[]): void {
    this.alerts = notifications.map(notification => ({
      ...notification,
      type: notification.type || 'info'
    }));
  }

  private handleNotificationsError(error: any): any {
    console.error('Error loading notifications:', error);
    return of([]);
  }

  // Private Methods - Dashboard Data
  private loadDashboardData(): void {
    // Implémente le chargement des autres données du dashboard ici
    // this.loadStats();
    // this.loadAppointments();
    
    // Simuler le chargement complet
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // Private Methods - Navigation
  private navigateToServiceList(): void {
    this.router.navigate(['/service-list'])
      .then(success => {
        if (!success) {
          console.error('Navigation failed');
        }
      })
      .catch(error => {
        console.error('Navigation error:', error);
      });
  }

  // Private Methods - Utilities
  private formatTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  }

  private formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '--/--/----';
    }
  }

  private calculateDuration(start: string, end: string): string {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      
      if (diff < 60) return `${Math.round(diff)} min`;
      return `${Math.round(diff / 60)}h`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return '--';
    }
  }

  // Private Methods - Cleanup
  private cleanupResources(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public Getters for Template (Optionnel)
  get userInitials(): string {
    if (!this.userName) return 'U';
    return this.userName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get hasNotifications(): boolean {
    return this.alerts.length > 0;
  }

  get welcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }
}
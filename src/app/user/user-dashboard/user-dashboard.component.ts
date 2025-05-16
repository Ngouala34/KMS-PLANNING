import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service'; // Service pour les données utilisateur
import { NotificationService } from '../../services/notification.service'; // Service pour les notifications
import { catchError } from 'rxjs/operators';
import { Notification, of } from 'rxjs';
import { UserNotificationService } from 'src/app/services/user/userNotification.service';
import { Router } from '@angular/router';



export interface UserStats {
  upcomingAppointments: number; 
  completedCourses: number;
  engagementRate: number; // Pourcentage d'engagement
  favorisNumber: number; // Nombre de favoris
}

// interfaces/appointment.interface.ts
export interface Appointment {
  id: string;
  title: string;
  expertName: string;
  startTime: string; // ou Date si vous convertissez déjà
  endTime: string;   // ou Date si vous convertissez déjà
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  type: 'CONSULTATION' | 'FORMATION';
}

// interfaces/dashboard-appointment.interface.ts
export interface DashboardAppointment {
  id: string;
  title: string;
  expert: string;
  time: string;
  date: string;
  duration: string;
  status: 'confirmed' | 'pending';
  type: 'consultation' | 'formation';
}

// interfaces de notification
export interface INotification { 
  id: string;
  type: 'appointment' | 'warning';
  message: string;
}


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  collapsedByDefault = false;
  isSidebarCollapsed = false;
  
  // Données utilisateur avec valeurs par défaut
  userName: string = 'Chargement...';
  userStatus: string = 'standard';
  userPoints: number = 0;
  
  // Notifications
  alerts: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Données pour les composants enfants
  stats = {
    upcomingAppointments: 0,
    completedFormations: 0,
    souscriptions: 0,
    favoris: 0
  };

  upcomingAppointments: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private usernotificationService: UserNotificationService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadNotifications();
    this.loadStats();
    this.loadAppointments();
  }

  private loadUserData(): void {
    this.userService.getCurrentUser().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des données utilisateur', error);
        this.error = 'Impossible de charger les informations utilisateur';
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.userName = user.fullName || 'Utilisateur';
        this.userStatus = user.accountType || 'standard';
        this.userPoints = user.loyaltyPoints || 0;
      }
    });
  }

  private loadNotifications(): void {
    this.usernotificationService.getUserNotifications().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des notifications', error);
        return of([]);
      })
    ).subscribe((notifications:INotification[]) =>  {
      this.alerts = notifications.map(notif => ({
        type: notif.type === 'appointment' ? 'appointment' : 'warning',
        message: notif.message
      }));
    });
  }

  private loadStats(): void {
    this.userService.getUserStats().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques', error);
        return of(this.stats); // Retourne les valeurs par défaut en cas d'erreur
      })
    ).subscribe(stats => {
      this.stats = {
        upcomingAppointments: stats?.upcomingAppointments || 0,
        completedFormations: stats?.completedCourses || 0,
        souscriptions: stats?.souscriptionsNumber || 0,
        favoris: stats?.favorisNumber || 0
      };
    });
  }

private loadAppointments(): void {
  this.userService.getUpcomingAppointments().pipe(
    catchError(error => {
      console.error('Erreur lors du chargement des rendez-vous', error);
      return of([]);
    })
  ).subscribe((appointments: Appointment[]) => {
    this.upcomingAppointments = appointments.map((app: Appointment) => ({
      id: app.id,
      title: app.title,
      expert: app.expertName,
      time: this.formatTime(app.startTime),
      date: this.formatDate(app.startTime),
      duration: this.calculateDuration(app.startTime, app.endTime),
      status: app.status === 'CONFIRMED' ? 'confirmed' : 'pending',
      type: app.type === 'CONSULTATION' ? 'consultation' : 'formation'
    } as DashboardAppointment));
    this.isLoading = false;
  });
}

  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private calculateDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    if (diff < 60) return `${Math.round(diff)} min`;
    return `${Math.round(diff / 60)}h`;
  }

  onServiceList(): void {
    this.router.navigateByUrl('service-list');
  }
}
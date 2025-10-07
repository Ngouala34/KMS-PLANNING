import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBookingResponse } from 'src/app/Interfaces/iservice';
import { UserProfile } from 'src/app/Interfaces/iuser';
import { UserService } from 'src/app/services/user/user.service';

interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  uniqueExperts: number;
}

interface Activity {
  id: number;
  type: 'booking' | 'completion' | 'cancellation' | 'payment';
  title: string;
  description: string;
  date: Date;
}

interface Expert {
  id: number;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
}

// Interface corrigée basée sur vos données réelles


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  userData!: UserProfile;
  dashboardStats: DashboardStats = {
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    uniqueExperts: 0
  };

  upcomingApp: IBookingResponse[] = [];
  recentActivity: Activity[] = [];
  favoriteExperts: Expert[] = [];
  isLoading: boolean = true;

  greetingMessage: string = '';
  private greetingInterval: any;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDashboardData();
    this.greetingMessage = this.getGreeting();

    this.greetingInterval = setInterval(() => {
      this.greetingMessage = this.getGreeting();
    }, 60 * 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.greetingInterval) {
      clearInterval(this.greetingInterval);
    }
  }

  private loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userData = user;
        this.greetingMessage = this.getGreeting();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
      }
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    this.userService.getUserBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings: IBookingResponse[]) => {
          this.processBookingsData(bookings);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données:', error);
          this.isLoading = false;
        }
      });
  }

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Bonjour';
    } else if (hour < 18) {
      return 'Bon après-midi';
    } else {
      return 'Bonsoir';
    }
  }

  private processBookingsData(bookings: IBookingResponse[]): void {
    console.log('Données brutes reçues:', bookings);
    
    const now = new Date();
    
    // Calcul des statistiques
    this.dashboardStats.totalAppointments = bookings.length;
    this.dashboardStats.completedAppointments = bookings.filter(booking => 
      booking.status === 'completed'
    ).length;
    
    // RDV à venir (7 prochains jours)
    this.upcomingApp = bookings
      .filter(booking => {
        const validStatuses = ['reserved', 'confirmed', 'pending'];
        if (!validStatuses.includes(booking.status)) return false;
        
        try {
          const [day, month, year] = booking.service.date.split('-');
          const bookingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          return bookingDate >= today && bookingDate <= nextWeek;
        } catch (error) {
          console.error('Erreur de parsing date:', booking.service.date);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const [dayA, monthA, yearA] = a.service.date.split('-');
          const [dayB, monthB, yearB] = b.service.date.split('-');
          const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
          const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          return 0;
        }
      })
      .slice(0, 5);

    console.log('RDV à venir filtrés:', this.upcomingApp);
    
    // Calcul des experts uniques
    const expertSet = new Set<number>();
    bookings.forEach(booking => {
      if (booking.service.expert?.id) {
        expertSet.add(booking.service.expert.id);
      }
    });
    this.dashboardStats.uniqueExperts = expertSet.size;
    this.dashboardStats.upcomingAppointments = this.upcomingApp.length;

    // Activité récente
    this.recentActivity = this.generateRecentActivity(bookings);
    console.log('Activité récente générée:', this.recentActivity);
    
    // Experts favoris
    this.favoriteExperts = this.generateFavoriteExperts(bookings);
    console.log('Experts favoris générés:', this.favoriteExperts);
  }

  private generateRecentActivity(bookings: IBookingResponse[]): Activity[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBookings = bookings
      .filter(booking => new Date(booking.created_at) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return recentBookings.map(booking => {
      let type: 'booking' | 'completion' | 'cancellation' | 'payment';
      let title: string;
      let description: string;

      switch (booking.status) {
        case 'reserved':
        case 'confirmed':
          type = 'booking';
          title = 'Nouveau rendez-vous réservé';
          description = `Consultation avec ${booking.service.expert?.name || 'expert'}`;
          break;
        case 'completed':
          type = 'completion';
          title = 'Rendez-vous terminé';
          description = `${booking.service.name} avec ${booking.service.expert?.name || 'expert'}`;
          break;
        case 'cancelled':
          type = 'cancellation';
          title = 'Rendez-vous annulé';
          description = `${booking.service.name} avec ${booking.service.expert?.name || 'expert'}`;
          break;
        default:
          type = 'booking';
          title = 'Activité';
          description = booking.service.name;
      }

      return {
        id: booking.id,
        type,
        title,
        description,
        date: new Date(booking.created_at)
      };
    });
  }

  private generateFavoriteExperts(bookings: IBookingResponse[]): Expert[] {
    const expertMap = new Map<number, { expert: any, count: number }>();

    bookings.forEach(booking => {
      const expert = booking.service.expert;
      if (expert && expert.id) {
        if (!expertMap.has(expert.id)) {
          expertMap.set(expert.id, {
            expert: expert,
            count: 0
          });
        }
        const expertData = expertMap.get(expert.id)!;
        expertData.count++;
      }
    });

    const experts = Array.from(expertMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(data => {
        const expert = data.expert;
        return {
          id: expert.id,
          name: expert.name || 'Expert',
          specialty: expert.domain || 'Spécialité non définie',
          avatar: expert.profile_picture || '/assets/default-avatar.png',
          rating: 0, // À implémenter si disponible dans l'API
          reviewCount: 0, // À implémenter si disponible dans l'API
          isOnline: Math.random() > 0.5 // Simulation - à remplacer par des données réelles
        };
      });

    console.log('Experts transformés:', experts);
    return experts;
  }

  // Navigation methods
  navigateToCalendar(): void {
    this.router.navigate(['/main-user/user-calendar']);
  }

  navigateToProfile(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/profile']);
  }

  navigateToPayments(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/payments']);
  }

  navigateToReviews(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/reviews']);
  }

  navigateToSupport(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/support']);
  }

  // Action methods
  openBookingModal(): void {
    this.router.navigate(['/service-list']);
  }

  rescheduleAppointment(appointment: IBookingResponse): void {
    console.log('Reprogrammer RDV:', appointment);
    // Implémentez la logique de reprogrammation
  }

  cancelAppointment(appointment: IBookingResponse): void {
    console.log('Annuler RDV:', appointment);
    // Implémentez la logique d'annulation
  }

  bookWithExpert(expert: Expert): void {
    console.log('Réserver avec expert:', expert);
    // Implémentez la logique de réservation
  }

  // Utility methods
  trackAppointment(index: number, appointment: IBookingResponse): number {
    return appointment.id;
  }

  trackActivity(index: number, activity: Activity): number {
    return activity.id;
  }

  trackExpert(index: number, expert: Expert): number {
    return expert.id;
  }

  isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    try {
      const [day, month, year] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      return date.toDateString() === today.toDateString();
    } catch (error) {
      console.error('Erreur isToday:', dateStr);
      return false;
    }
  }

  isTomorrow(dateStr: string): boolean {
    if (!dateStr) return false;
    try {
      const [day, month, year] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return date.toDateString() === tomorrow.toDateString();
    } catch (error) {
      console.error('Erreur isTomorrow:', dateStr);
      return false;
    }
  }

  formatDay(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const [day, month, year] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.getDate().toString();
    } catch (error) {
      return '?';
    }
  }

  formatMonth(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const [day, month, year] = dateStr.split('-');
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return months[date.getMonth()];
    } catch (error) {
      return '???';
    }
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '??:??';
    try {
      return timeStr.substring(0, 5); // Format "HH:MM"
    } catch (error) {
      return '??:??';
    }
  }

  formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  }

  getPlatformClass(platform: string): string {
    return platform?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
  }

  getPlatformLabel(platform: string): string {
    const platforms: { [key: string]: string } = {
      'google_meet': 'Google Meet',
      'zoom': 'Zoom',
      'teams': 'Microsoft Teams',
      'phone': 'Téléphone',
      'other': 'Autre'
    };
    return platforms[platform] || platform || 'Non spécifié';
  }

  getActivityIcon(type: string): string {
    const icons = {
      booking: 'fas fa-calendar-plus',
      completion: 'fas fa-check-circle',
      cancellation: 'fas fa-times-circle',
      payment: 'fas fa-credit-card'
    };
    return icons[type as keyof typeof icons] || 'fas fa-info-circle';
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-avatar.png';
  }
}
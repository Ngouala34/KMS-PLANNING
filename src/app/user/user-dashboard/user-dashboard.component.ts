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



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  userProfile!: UserProfile ;
  userData!: UserProfile
  dashboardStats: DashboardStats = {
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    uniqueExperts: 0
  };

  upcomingAppointments: IBookingResponse[] = [];
  recentActivity: Activity[] = [];
  favoriteExperts: Expert[] = [];
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService // Remplacez par votre service réel
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDashboardData();
        // Mettre à jour la salutation dès le chargement
    this.greetingMessage = this.getGreeting();

    // Vérifier et mettre à jour la salutation toutes les minutes
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


  greetingMessage: string = '';
  private greetingInterval: any;


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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calcul des statistiques
    this.dashboardStats.totalAppointments = bookings.length;
    this.dashboardStats.completedAppointments = bookings.filter(booking => 
      booking.status === 'completed'
    ).length;
    
    this.dashboardStats.upcomingAppointments = bookings.filter(booking => {
      if (booking.status !== 'reserved') return false;
      
        const bookingDate = new Date(booking.service.date);
        bookingDate.setHours(0, 0, 0, 0); // mettre à minuit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return bookingDate >= today && bookingDate <= nextWeek;

    }).length;

    // Calcul des experts uniques
    const expertSet = new Set<string>();
    bookings.forEach(booking => {
      if (booking.expert?.email) {
        expertSet.add(booking.expert.email); // ou booking.expert.name si email absent
      }
    });
    this.dashboardStats.uniqueExperts = expertSet.size;


    // Rendez-vous à venir (prochains 7 jours)
    this.upcomingAppointments = bookings
      .filter(booking => {
        if (booking.status !== 'reserved') return false;
        
        const bookingDate = new Date(booking.service.date);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        return bookingDate >= today && bookingDate <= nextWeek;
      })
      // .map(booking => this.mapBookingToAppointment(booking))
      .sort((a, b) => new Date(a.service.date).getTime() - new Date(b.service.date).getTime())
      .slice(0, 5); // Limiter à 5 rendez-vous

    // Activité récente (30 derniers jours)
    this.recentActivity = this.generateRecentActivity(bookings);

    // Experts favoris (ceux avec le plus de rendez-vous)
    this.favoriteExperts = this.generateFavoriteExperts(bookings);
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
        case 'available':
          type = 'booking';
          title = 'Nouveau rendez-vous réservé';
          description = `Consultation avec ${booking.expert.name}`;
          break;
        case 'completed':
          type = 'completion';
          title = 'Rendez-vous terminé';
          description = `${booking.service.name} avec ${booking.expert.name}`;
          break;
        case 'cancelled':
          type = 'cancellation';
          title = 'Rendez-vous annulé';
          description = `${booking.service.name} avec ${booking.expert.name}`;
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
      if (!expertMap.has(booking.expert.id)) {
        expertMap.set(booking.expert.id, {
          expert: booking.expert,
          count: 0
        });
      }
      const expertData = expertMap.get(booking.expert.id)!;
      expertData.count++;
    });

    return Array.from(expertMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3) // Top 3 experts
      .map(data => ({
        id: data.expert.id,
        name: data.expert.name,
        specialty: data.expert.specialty,
        avatar: data.expert.avatar,
        rating: data.expert.rating,
        reviewCount: data.expert.review_count,
        isOnline: data.expert.is_online
      }));
  }

  // Navigation methods
  navigateToCalendar(): void {
    this.router.navigate(['/main-user/calendar-page']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToPayments(): void {
    this.router.navigate(['/payments']);
  }

  navigateToReviews(): void {
    this.router.navigate(['/reviews']);
  }

  navigateToSupport(): void {
    this.router.navigate(['/support']);
  }

  // Action methods
  openBookingModal(): void {
    console.log('Ouvrir modal réservation');
  }

  rescheduleAppointment(appointment: IBookingResponse): void {
    console.log('Reprogrammer RDV:', appointment);
  }

  cancelAppointment(appointment: IBookingResponse): void {
    console.log('Annuler RDV:', appointment);
  }

  bookWithExpert(expert: Expert): void {
    console.log('Réserver avec expert:', expert);
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
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  }

  isTomorrow(dateStr: string): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateStr);
    return date.toDateString() === tomorrow.toDateString();
  }

  formatDay(dateStr: string): string {
    return new Date(dateStr).getDate().toString();
  }

  formatMonth(dateStr: string): string {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[new Date(dateStr).getMonth()];
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
    return platform.toLowerCase().replace(/\s+/g, '-');
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

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
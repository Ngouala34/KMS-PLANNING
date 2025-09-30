
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { UserNotificationService } from 'src/app/services/user/userNotification.service';
import { INotification } from 'src/app/Interfaces/iservice';

interface NotificationGroup {
  date: string;
  notifications: INotification[];
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

type FilterType = 'all' | 'unread' | 'service' | 'reservation' | 'reminder' | 'general';

@Component({
  selector: 'app-expert-notifications',
  templateUrl: './expert-notifications.component.html',
  styleUrls: ['./expert-notifications.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-15px)' }),
          stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0px)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class ExpertNotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private notificationsSubject = new BehaviorSubject<INotification[]>([]);
  private filterSubject = new BehaviorSubject<FilterType>('all');
  
  // Data properties
  notifications: INotification[] = [];
  filteredNotifications: INotification[] = [];
  groupedNotifications: NotificationGroup[] = [];
  
  // UI State
  isLoading = false;
  isLoadingMore = false;
  showFilterMenu = false;
  activeFilter: FilterType = 'all';
  errorMessage = '';
  
  // Pagination
  pagination: PaginationInfo = {
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false
  };

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private router: Router,
    private notificationService: UserNotificationService
  ) {}

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-menu') && !target.closest('.filter-btn')) {
      this.showFilterMenu = false;
    }
  }

  private setupFilterSubscription(): void {
    combineLatest([
      this.notificationsSubject.pipe(distinctUntilChanged()),
      this.filterSubject.pipe(distinctUntilChanged())
    ]).pipe(
      debounceTime(100),
      takeUntil(this.destroy$)
    ).subscribe(([notifications, filter]) => {
      this.filterNotifications(notifications, filter);
    });
  }

  private loadNotifications(reset: boolean = true): void {
    if (reset) {
      this.isLoading = true;
      this.errorMessage = '';
      this.pagination.page = 1;
    } else {
      this.isLoadingMore = true;
    }

    this.notificationService.getNotifications(
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        const newNotifications = response.data || response;
        const total = response.total || newNotifications.length;
        
        if (reset) {
          this.notifications = newNotifications;
        } else {
          this.notifications = [...this.notifications, ...newNotifications];
        }

        this.pagination.total = total;
        this.pagination.hasMore = this.notifications.length < total;
        
        this.notificationsSubject.next(this.notifications);
        this.isLoading = false;
        this.isLoadingMore = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des notifications', error);
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  loadMore(): void {
    if (this.isLoadingMore || !this.pagination.hasMore) return;
    
    this.pagination.page++;
    this.loadNotifications(false);
  }

  private handleError(message: string, error?: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.showToastMessage(message, 'error');
  }

  private filterNotifications(notifications: INotification[], filter: FilterType): void {
    let filtered = [...notifications];

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.is_read);
        break;
      case 'service':
      case 'reservation':
      case 'reminder':
      case 'general':
        filtered = filtered.filter(n => n.notif_type === filter);
        break;
    }

    this.filteredNotifications = filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    this.groupNotificationsByDate();
  }

  private groupNotificationsByDate(): void {
    const groups: { [key: string]: INotification[] } = {};

    this.filteredNotifications.forEach(notification => {
      const date = new Date(notification.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    this.groupedNotifications = Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date,
        notifications: groups[date]
      }));
  }

  // Actions utilisateur
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this.filterSubject.next(filter);
    this.showFilterMenu = false;
  }

  markAllAsRead(): void {
    if (this.unreadCount === 0) return;

    const unreadNotifications = this.notifications.filter(n => !n.is_read);
    const unreadIds = unreadNotifications.map(n => n.id);

    this.notificationService.markAllAsRead(unreadIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Mettre à jour localement
          unreadNotifications.forEach(n => n.is_read = true);
          this.notificationsSubject.next([...this.notifications]);
          
          this.showToastMessage(
            `${unreadNotifications.length} notification(s) marquée(s) comme lue(s)`, 
            'success'
          );
        },
        error: (error) => {
          console.error('Erreur marquage comme lu:', error);
          this.showToastMessage('Erreur lors de la mise à jour', 'error');
        }
      });
  }

  markAsRead(notification: INotification): void {
    if (notification.is_read) return;

    this.notificationService.markAsRead(notification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          notification.is_read = true;
          this.notificationsSubject.next([...this.notifications]);
        },
        error: (error) => {
          console.error('Erreur marquage comme lu:', error);
          this.showToastMessage('Erreur lors de la mise à jour', 'error');
        }
      });
  }

  deleteNotification(notification: INotification): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return;
    }

    this.notificationService.deleteNotification(notification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const index = this.notifications.findIndex(n => n.id === notification.id);
          if (index > -1) {
            this.notifications.splice(index, 1);
            this.notificationsSubject.next([...this.notifications]);
            this.showToastMessage('Notification supprimée', 'success');
          }
        },
        error: (error) => {
          console.error('Erreur suppression:', error);
          this.showToastMessage('Erreur lors de la suppression', 'error');
        }
      });
  }

  openNotificationSettings(): void {
    this.router.navigate(['/settings/notifications']);
  }

  // Computed properties
  get totalNotifications(): number {
    return this.notifications.length;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }

  get hasMoreNotifications(): boolean {
    return this.pagination.hasMore && !this.isLoading;
  }

  // Méthodes utilitaires pour le template
  getNotificationCountByType(type: string): number {
    return this.notifications.filter(n => n.notif_type === type).length;
  }

  trackByDate(index: number, group: NotificationGroup): string {
    return group.date;
  }

  trackByNotification(index: number, notification: INotification): number {
    return notification.id;
  }

  formatGroupDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getNotificationIcon(type: string): string {
    const icons = {
      service: 'fas fa-user-md',
      reservation: 'fas fa-calendar-check',
      reminder: 'fas fa-clock',
      general: 'fas fa-info-circle'
    };
    return icons[type as keyof typeof icons] || 'fas fa-bell';
  }

  getTypeLabel(type: string): string {
    const labels = {
      service: 'Service',
      reservation: 'Réservation',
      reminder: 'Rappel',
      general: 'Général'
    };
    return labels[type as keyof typeof labels] || 'Notification';
  }

  getNotificationAriaLabel(notification: INotification): string {
    const status = notification.is_read ? 'lue' : 'non lue';
    return `${notification.title}, ${status}, ${this.formatTime(notification.created_at)}`;
  }

  getEmptyStateTitle(): string {
    switch (this.activeFilter) {
      case 'unread':
        return 'Aucune notification non lue';
      case 'service':
        return 'Aucune notification de service';
      case 'reservation':
        return 'Aucune notification de réservation';
      case 'reminder':
        return 'Aucun rappel';
      case 'general':
        return 'Aucune notification générale';
      default:
        return 'Aucune notification';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter) {
      case 'unread':
        return 'Toutes vos notifications ont été lues.';
      case 'service':
        return 'Vous n\'avez reçu aucune notification concernant les services.';
      case 'reservation':
        return 'Vous n\'avez reçu aucune notification concernant vos réservations.';
      case 'reminder':
        return 'Vous n\'avez aucun rappel en attente.';
      case 'general':
        return 'Vous n\'avez reçu aucune notification générale.';
      default:
        return 'Vous n\'avez encore reçu aucune notification.';
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getToastIcon(): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    return icons[this.toastType];
  }
}
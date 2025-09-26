import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Souscription } from '../../models/user/souscription.model';
import { SouscriptionService } from 'src/app/services/user/souscription.service';
import { IBookingResponse } from 'src/app/Interfaces/iservice';
import { UserService } from 'src/app/services/user/user.service';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface NotificationMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-user-souscription',
  templateUrl: './user-souscription.component.html',
  styleUrls: ['./user-souscription.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query('.service-card:enter', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.9)' }),
          stagger(50, animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
            style({ opacity: 1, transform: 'translateY(0) scale(1)' })
          ))
        ], { optional: true })
      ])
    ])
  ]
})
export class UserSouscriptionComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data
  souscriptions: Souscription[] = [];
  bookings: IBookingResponse[] = [];
  filteredBookings: IBookingResponse[] = [];
  
  // State
  isSidebarCollapsed = false;
  isLoading = true;
  errorMessage = '';
  searchQuery = '';
  selectedFilter = 'all';
  sortBy = 'date_desc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totalPages = 1;
  
  // View options
  viewMode: 'grid' | 'list' = 'grid';
  showFilters = false;
  
  // Filters
  filterOptions = {
    status: [
      { value: 'all', label: 'Tous les statuts', count: 0 },
      { value: 'actif', label: 'Actif', count: 0 },
      { value: 'expiré', label: 'Expiré', count: 0 },
      { value: 'annulé', label: 'Annulé', count: 0 }
    ] as FilterOption[],
    categories: [] as FilterOption[]
  };

  // Notifications
  notifications: NotificationMessage[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.initSearchSubscription();
  }

  ngOnInit(): void {
    this.loadUserBookings();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && this.showFilters) {
      this.showFilters = false;
    }
  }

  private initSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  loadUserBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUserBookings().subscribe({
      next: (data: IBookingResponse[]) => {
        this.bookings = data;
        this.totalItems = data.length;
        this.updateFilterCounts();
        this.applyFilters();
        console.log('Réservations récupérées:', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        this.errorMessage = 'Impossible de charger vos réservations.';
        this.addNotification('Erreur lors du chargement des réservations', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Search functionality
  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(searchTerm: string): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  // Filter functionality
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedFilter = 'all';
    this.sortBy = 'date_desc';
    this.searchQuery = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.bookings];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.service.name?.toLowerCase().includes(query) ||
        booking.service.description?.toLowerCase().includes(query) ||
        booking.expert.name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(booking => 
        booking.status === this.selectedFilter
      );
    }

    // Sort
    filtered = this.sortBookings(filtered, this.sortBy);

    this.filteredBookings = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.updatePagination();
  }

  private sortBookings(bookings: IBookingResponse[], sortBy: string): IBookingResponse[] {
    return bookings.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'date_asc':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'price_desc':
          return (b.service.price || 0) - (a.service.price || 0);
        case 'price_asc':
          return (a.service.price || 0) - (b.service.price || 0);
        case 'name_asc':
          return (a.service.name || '').localeCompare(b.service.name || '');
        case 'rating_desc':
          return (b.service.average_rating || 0) - (a.service.average_rating || 0);
        default:
          return 0;
      }
    });
  }

  private updateFilterCounts(): void {
    // Update status counts
    this.filterOptions.status.forEach(option => {
      if (option.value === 'all') {
        option.count = this.bookings.length;
      } else {
        option.count = this.bookings.filter(b => b.status === option.value).length;
      }
    });

    // Update category counts (if categories exist)
    const categories = [...new Set(this.bookings.map(b => b.service.category).filter(Boolean))];
    this.filterOptions.categories = categories.map(cat => ({
      value: cat!,
      label: cat!,
      count: this.bookings.filter(b => b.service.category === cat).length
    }));
  }

  // View mode
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  // Pagination
  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // La pagination sera gérée dans le template avec slice
  }

  get paginatedBookings(): IBookingResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBookings.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Service actions
  toggleFavorite(service: IBookingResponse, event: Event): void {
    event.stopPropagation();
    service.service.isFavorite = !service.service.isFavorite;
    
    const message = service.service.isFavorite ? 
      'Service ajouté aux favoris' : 
      'Service retiré des favoris';
    this.addNotification(message, 'success');
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

  onServiceDetails(id: number): void {
    this.router.navigate(['/service-details', id]);
  }

  getStatusClass(status: string): string {
    return {
      'actif': 'status-active',
      'expiré': 'status-expired',
      'annulé': 'status-cancelled'
    }[status] || '';
  }

  selectedFilterLabel = '';

  FilterChange() {
    const found = this.filterOptions.status.find(s => s.value === this.selectedFilter);
    this.selectedFilterLabel = found ? found.label : '';
  }

  get actifCount(): number {
    return this.filterOptions?.status.find(s => s.value === 'actif')?.count || 0;
  }

  get favorisCount(): number {
    return this.bookings?.filter(b => b.service.isFavorite).length || 0;
  }



  onSubscribeToService(booking: IBookingResponse, event: Event): void {
    if (booking.service.meeting_link) {
      window.open(booking.service.meeting_link, '_blank'); // ouvre dans un nouvel onglet
    } else {
      console.warn('Aucun lien de meeting disponible pour cette réservation');
    }
  }
  // Notifications
  private addNotification(message: string, type: NotificationMessage['type']): void {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      message,
      type
    };
    this.notifications.push(notification);
    setTimeout(() => this.removeNotification(notification.id), 5000);
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // Utility methods
  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedFilter !== 'all') count++;
    if (this.searchQuery.trim()) count++;
    return count;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  retryLoading(): void {
    this.loadUserBookings();
  }

  navigateToServices(): void {
    this.router.navigate(['/service-list']);
  }

  trackByBookingId(index: number, booking: IBookingResponse): any {
    return booking.id || index;
  }
}
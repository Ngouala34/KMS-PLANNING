import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { IService } from 'src/app/Interfaces/iservice';
import { ExpertService } from 'src/app/services/expert/expert.service';

interface Category {
  value: string;
  displayName: string;
  subcategories: { value: string; displayName: string }[];
}

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
  selector: 'app-expert-formation',
  templateUrl: './expert-formation.component.html',
  styleUrls: ['./expert-formation.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
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
    ]),
    trigger('modalAnimation', [
      state('open', style({ opacity: 1, transform: 'scale(1)' })),
      state('closed', style({ opacity: 0, transform: 'scale(0.95)' })),
      transition('closed => open', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('open => closed', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ExpertFormationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // State management
  isSidebarCollapsed = false;
  isLoading = true;
  error: string | null = null;
  searchQuery = '';

  // Data
  formations: IService[] = [];
  filteredFormations: IService[] = [];
  paginatedFormations: IService[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  totalItems = 0;

  // Filters
  selectedCategory = '';
  selectedPriceRange = '';
  selectedDateRange = '';
  sortBy = 'date_desc';

  filterOptions = {
    categories: [] as FilterOption[],
    priceRanges: [
      { value: '0-5000', label: '0 - 5 000 XAF', count: 0 },
      { value: '5000-15000', label: '5 000 - 15 000 XAF', count: 0 },
      { value: '15000-50000', label: '15 000 - 50 000 XAF', count: 0 },
      { value: '50000+', label: '50 000+ XAF', count: 0 }
    ] as FilterOption[],
    dateRanges: [
      { value: 'today', label: "Aujourd'hui", count: 0 },
      { value: 'week', label: 'Cette semaine', count: 0 },
      { value: 'month', label: 'Ce mois', count: 0 },
      { value: 'future', label: 'À venir', count: 0 }
    ] as FilterOption[]
  };

  // View options
  viewMode: 'grid' | 'list' = 'grid';
  showFilters = false;

  // Modal
  showEditModal = false;
  editServiceForm!: FormGroup;
  isModalLoading = false;
  isFetchingService = false;
  imagePreview: string | null = null;
  selectedService: IService | null = null;
  modalError: string | null = null;

  // Categories
  availableSubcategories: { value: string; displayName: string }[] = [];
  availableSubsubcategories: { value: string; displayName: string }[] = [];

  // Notifications
  notifications: NotificationMessage[] = [];

  categories: Category[] = [
    {
      value: 'programming_tech',
      displayName: 'Programmation & Tech',
      subcategories: [
        { value: '', displayName: 'Sites web IA & Logiciel' },
        { value: 'mobile_ai_apps', displayName: 'Applications mobiles IA' },
        { value: 'ai_integrations', displayName: 'Intégrations IA' },
        { value: 'ai_tech_advice', displayName: 'Conseil en technologie IA' },
        { value: 'custom_websites', displayName: 'Développement de sites web' },
        { value: 'personalized_websites', displayName: 'Sites web personnalisés' },
        { value: 'landing_pages', displayName: 'Landing pages' },
        { value: 'dropshipping_sites', displayName: 'Sites web de dropshipping' },
        { value: 'website_maintenance', displayName: 'Maintenance de site web' },
        { value: 'bug_fixing', displayName: 'Correction de bugs' },
        { value: 'backup_migration', displayName: 'Sauvegarde et migration' },
        { value: 'speed_optimization', displayName: 'Optimisation de la vitesse' }
      ]
    },
    {
      value: 'sports_coaching',
      displayName: 'Sport & Coaching',
      subcategories: [
        { value: 'athlete_representation', displayName: "Représentation d'athlètes" },
        { value: 'sponsorship', displayName: 'Sponsoring' },
        { value: 'performance_reviews', displayName: 'Bilans de performance' },
        { value: 'post_career_transition', displayName: 'Transition post-carrière' },
        { value: 'competition_organization', displayName: 'Organisation de compétitions' },
        { value: 'custom_programs', displayName: 'Programmes sur mesure' }
      ]
    }
  ];

  constructor(
    private serviceService: ExpertService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initSearchSubscription();
  }

  ngOnInit(): void {
    this.initEditForm();
    this.loadServices();
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

  initEditForm(): void {
    this.editServiceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      preferred_platform: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(15)]],
      cover_image: [''],
      category: ['', Validators.required],
      subcategory: [''],
      subsubcategory: [''],
      meeting_link: ['']
    });
  }

  // Search functionality
  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(searchTerm: string): void {
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
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.selectedDateRange = '';
    this.sortBy = 'date_desc';
    this.searchQuery = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.formations];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(service =>
        service.category_display === this.selectedCategory ||
        service.category?.value === this.selectedCategory
      );
    }

    // Price range filter
    if (this.selectedPriceRange) {
      filtered = this.filterByPriceRange(filtered, this.selectedPriceRange);
    }

    // Date range filter
    if (this.selectedDateRange) {
      filtered = this.filterByDateRange(filtered, this.selectedDateRange);
    }

    // Sort
    filtered = this.sortServices(filtered, this.sortBy);

    this.filteredFormations = filtered;
    this.updatePagination();
    this.updateFilterCounts();
  }

  private filterByPriceRange(services: IService[], range: string): IService[] {
    const ranges = {
      '0-5000': (price: number) => price >= 0 && price <= 5000,
      '5000-15000': (price: number) => price > 5000 && price <= 15000,
      '15000-50000': (price: number) => price > 15000 && price <= 50000,
      '50000+': (price: number) => price > 50000
    };

    const filterFn = ranges[range as keyof typeof ranges];
    return filterFn ? services.filter(s => filterFn(s.price)) : services;
  }

  private filterByDateRange(services: IService[], range: string): IService[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return services.filter(service => {
      const serviceDate = new Date(service.date);
      switch (range) {
        case 'today':
          return serviceDate.toDateString() === today.toDateString();
        case 'week':
          return serviceDate >= today && serviceDate <= weekFromNow;
        case 'month':
          return serviceDate >= today && serviceDate <= monthFromNow;
        case 'future':
          return serviceDate > today;
        default:
          return true;
      }
    });
  }

  private sortServices(services: IService[], sortBy: string): IService[] {
    return services.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price_desc':
          return b.price - a.price;
        case 'price_asc':
          return a.price - b.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'popularity':
          return (Number(b.subscription) || 0) - (Number(a.subscription) || 0);
        default:
          return 0;
      }
    });
  }

  getCategoryLabel(): string {
    const category = this.filterOptions.categories.find(c => c.value === this.selectedCategory);
    return category ? category.label : '';
  }

  getPriceRangeLabel(): string {
    const range = this.filterOptions.priceRanges.find(p => p.value === this.selectedPriceRange);
    return range ? range.label : '';
  }

  getDateRangeLabel(): string {
    const range = this.filterOptions.dateRanges.find(d => d.value === this.selectedDateRange);
    return range ? range.label : '';
  }

  oncreateService(): void {
    this.router.navigate(['/create-service']);
  }


  private updateFilterCounts(): void {
    // Update category counts
    this.filterOptions.categories = this.categories.map(cat => ({
      value: cat.value,
      label: cat.displayName,
      count: this.formations.filter(s => 
        s.category_display === cat.displayName || 
        s.category?.value === cat.value
      ).length
    }));

    // Update price range counts
    this.filterOptions.priceRanges.forEach(range => {
      range.count = this.filterByPriceRange(this.formations, range.value).length;
    });

    // Update date range counts
    this.filterOptions.dateRanges.forEach(range => {
      range.count = this.filterByDateRange(this.formations, range.value).length;
    });
  }

  // View mode
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  // Pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredFormations.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFormations = this.filteredFormations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
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

  // Modal functionality
  openEditModal(service: IService): void {
    this.modalError = null;
    this.isFetchingService = true;
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';

    this.serviceService.getServiceDetails(service.id)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement du service:', error);
          this.modalError = 'Impossible de charger les détails du service';
          this.isFetchingService = false;
          return throwError(() => error);
        }),
        finalize(() => {
          this.isFetchingService = false;
        })
      )
      .subscribe({
        next: (serviceDetails) => {
          this.selectedService = serviceDetails;
          this.populateEditForm(serviceDetails);
        }
      });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editServiceForm.reset();
    this.imagePreview = null;
    this.selectedService = null;
    this.modalError = null;
    document.body.style.overflow = 'auto';
  }

  populateEditForm(service: IService): void {
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    this.editServiceForm.patchValue({
      name: service.name,
      description: service.description,
      start_time: service.start_time,
      end_time: service.end_time,
      preferred_platform: service.preferred_platform,
      price: service.price,
      duration: service.duration,
      category: service.category?.value || service.category_display,
      subcategory: service.subcategory?.value,
      subsubcategory: service.subsubcategory?.value,
      meeting_link: service.meeting_link
    });

    if (service.cover_image) this.imagePreview = service.cover_image;

    this.onCategoryChange();
    this.onSubcategoryChange();
  }

  onCategoryChange(): void {
    const categoryValue = this.editServiceForm.get('category')?.value;
    const category = this.categories.find(c => c.value === categoryValue);
    this.availableSubcategories = category ? category.subcategories : [];
    this.editServiceForm.get('subcategory')?.setValue('');
    this.editServiceForm.get('subsubcategory')?.setValue('');
  }

  onSubcategoryChange(): void {
    const categoryValue = this.editServiceForm.get('category')?.value;
    const subcategoryValue = this.editServiceForm.get('subcategory')?.value;
    this.availableSubsubcategories = this.getSubsubcategories(categoryValue, subcategoryValue);
    this.editServiceForm.get('subsubcategory')?.setValue('');
  }

  getSubsubcategories(categoryValue: string, subcategoryValue: string): { value: string; displayName: string }[] {
    return [];
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.addNotification('Fichier trop volumineux (max 5MB)', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.editServiceForm.patchValue({ cover_image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitEdit(): void {
    if (this.editServiceForm.valid && this.selectedService) {
      this.isModalLoading = true;
      this.modalError = null;

      const formData = this.prepareFormData();

      this.serviceService.updateService(this.selectedService.id, formData)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la mise à jour:', error);
            this.modalError = 'Erreur lors de la mise à jour du service';
            return throwError(() => error);
          }),
          finalize(() => this.isModalLoading = false)
        )
        .subscribe({
          next: (updatedService) => {
            this.updateServiceInList(updatedService);
            this.closeEditModal();
            this.addNotification('Service modifié avec succès !', 'success');
          }
        });
    } else {
      this.addNotification('Veuillez corriger les erreurs du formulaire', 'error');
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.editServiceForm.value;

    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined && formValue[key] !== '') {
        if (key === 'date') {
          formData.append('date', JSON.stringify([formValue.date]));
        } else if (key === 'category' || key === 'subcategory' || key === 'subsubcategory') {
          formData.append(key, formValue[key]);
        } else {
          formData.append(key, formValue[key]);
        }
      }
    });

    if (formValue.cover_image instanceof File) {
      formData.append('cover_image', formValue.cover_image);
    }

    return formData;
  }

  private updateServiceInList(updatedService: IService): void {
    const index = this.formations.findIndex(s => s.id === updatedService.id);
    if (index !== -1) {
      this.formations[index] = updatedService;
      this.applyFilters();
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

  // Service actions
  viewDetails(service: IService): void {
    this.router.navigate(['/service-details', service.id]);
  }

  duplicateService(service: IService): void {
    this.addNotification('Fonctionnalité de duplication en développement', 'info');
  }

  archiveService(service: IService): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce service ?')) {
      this.addNotification('Service archivé avec succès', 'success');
    }
  }

  // Data loading
  reloadServices(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.isLoading = true;
    this.error = null;

    this.serviceService.getAllServices()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Erreur lors du chargement des services:', error);
          this.error = 'Impossible de charger les services';
          this.isLoading = false;
          return [];
        })
      )
      .subscribe({
        next: (services) => {
          this.formations = services;
          this.filteredFormations = [...this.formations];
          this.totalItems = this.formations.length;
          this.updatePagination();
          this.updateFilterCounts();
          this.isLoading = false;
        }
      });
  }

  // Utility methods
  getServiceStatusClass(service: IService): string {
    const serviceDate = new Date(service.date);
    const now = new Date();
    
    if (serviceDate < now) {
      return 'past';
    } else if (serviceDate.toDateString() === now.toDateString()) {
      return 'today';
    } else {
      return 'upcoming';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedCategory) count++;
    if (this.selectedPriceRange) count++;
    if (this.selectedDateRange) count++;
    if (this.searchQuery.trim()) count++;
    return count;
  }

  trackByServiceId(index: number, service: IService): any {
    return service.id;
  }
}
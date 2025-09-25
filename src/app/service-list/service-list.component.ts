import { Component, OnInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { IService } from 'src/app/Interfaces/iservice';
import { ExpertService } from '../services/expert/expert.service';

interface PriceRange {
  value: string;
  label: string;
  min?: number;
  max?: number;
  checked: boolean;
}

interface Category {
  title: string;
  value: string;
  items: CategoryItem[];
}

interface CategoryItem {
  section: string;
  subitems: string[];
}

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit, OnDestroy {
  @ViewChild('priceFilter') priceFilter!: ElementRef;

  private destroy$ = new Subject<void>();
  Math = Math;
  isFavorite = false;
  isMobileMenuOpen = false;
  showPriceDropdown = false;
  showServices = false;
  isMobileView = false;
  isLoading = true;
  error: string | null = null;

  // Services - chargés depuis l'API
  service: IService[] = [];
  filteredServices: IService[] = [];
  paginatedServices: IService[] = [];
  selectedCategory: string = 'all';
  selectedSubcategory: string = 'all';
  serv!: IService;

  // Pagination
  currentPage = 1;
  servicesPerPage = 20;
  totalPages = 0;
  paginationPages: number[] = [];

  // Filtres
  filters = {
    searchText: '',
    priceRange: 'all',
    minRating: 0,
    category: 'all',
    subcategory: 'all'
  };

  priceRanges: PriceRange[] = [
    { value: 'all', label: 'Tous les prix', checked: true },
    { value: 'economy', label: '5,000XAF - 20,000XAF', min: 5000, max: 20000, checked: false },
    { value: 'standard', label: '20,000XAF - 50,000XAF', min: 20000, max: 50000, checked: false },
    { value: 'premium', label: '50,000XAF - 100,000XAF', min: 50000, max: 100000, checked: false },
    { value: 'enterprise', label: '100,000XAF +', min: 100000, max: undefined, checked: false }
  ];

  ratingOptions = [
    { value: 0, label: 'Toutes les notes' },
    { value: 3, label: '⭐⭐⭐ et plus' },
    { value: 4, label: '⭐⭐⭐⭐ et plus' },
    { value: 4.5, label: '⭐⭐⭐⭐⭐ seulement' }
  ];

  categories: Category[] = [
    {
      title: 'Programmation & Tech',
      value: 'Programmation & Tech',
      items: [
        { section: 'Développement IA', subitems: ['Sites web IA & Logiciel', 'Applications mobiles IA', 'Intégrations IA', 'Conseil en technologie IA'] },
        { section: 'Sites web', subitems: ['Développement de sites web', 'Sites web personnalisés', 'Landing pages', 'Sites web de dropshipping'] },
        { section: 'Maintenance & optimisation', subitems: ['Maintenance de site web', 'Correction de bugs', 'Sauvegarde et migration', 'Optimisation de la vitesse'] },
        { section: 'Cloud et cybersécurité', subitems: ['Cloud Computing', 'DevOps Engineering', 'Cybersecurity'] },
        { section: 'Applications mobiles', subitems: ['Développement multiplateforme', 'Android', 'iOS', 'Maintenance mobile'] },
        { section: 'Logiciels & automatisation', subitems: ['Applications web', 'Automations & Flux de travail', 'API et intégrations', 'Bases de données'] },
        { section: 'Qualité & tests', subitems: ['QA et révision', 'Tests utilisateurs'] },
      ]
    },
    {
      title: 'Marketing digital',
      value: 'Marketing digital',
      items: [
        { section: 'SEO & Référencement', subitems: ['SEO on-page', 'SEO technique', 'Link building'] },
        { section: 'Publicité en ligne', subitems: ['Google Ads', 'Facebook Ads', 'Instagram Ads'] },
        { section: 'Réseaux sociaux', subitems: ['Community management', 'Growth hacking', 'Stratégie de contenu'] },
        { section: 'Email marketing', subitems: ['Campagnes email', 'Newsletters', 'Automatisations'] },
        { section: 'Stratégie digitale', subitems: ['Audit digital', 'Plan marketing', 'Branding'] }
      ]
    },
    {
      title: 'Services Juridiques',
      value: 'Services Juridiques',
      items: [
        { section: 'Droit des affaires', subitems: ['Rédaction de contrats', 'Constitution d\'entreprise', 'Droit commercial', 'Propriété intellectuelle'] },
        { section: 'Droit civil', subitems: ['Droit familial', 'Successions', 'Droit immobilier', 'Responsabilité civile'] },
        { section: 'Contentieux', subitems: ['Représentation en justice', 'Médiation', 'Arbitrage', 'Procédures pénales'] },
        { section: 'Conformité', subitems: ['Protection des données (RGPD)', 'Compliance financière', 'Droit du travail'] }
      ]
    },
    {
      title: 'Banques & Finances',
      value: 'Banques & Finances',
      items: [
        { section: 'Services bancaires', subitems: ['Comptes courants', 'Prêts immobiliers', 'Crédits professionnels', 'Gestion de patrimoine'] },
        { section: 'Fintech', subitems: ['Paiements en ligne', 'Blockchain', 'Crowdfunding', 'Robo-advisors'] },
        { section: 'Audit & Risque', subitems: ['Audit financier', 'Contrôle interne', 'Gestion des risques', 'Due diligence'] },
        { section: 'Investissements', subitems: ['Gestion d\'actifs', 'Planification financière', 'Retraite', 'Fiscalité'] },
      ]
    },
    {
      title: 'Société & Services',
      value: 'Société & Services',
      items: [
        { section: 'Services sociaux', subitems: ['Insertion professionnelle', 'Aide aux seniors', 'Services familial', 'Aide au logement'] },
        { section: 'Formation', subitems: ['Cours particuliers', 'Formation professionnelle', 'Coaching carrière', 'Ateliers de développement'] },
        { section: 'Services aux entreprises', subitems: ['Ressources humaines', 'Communication corporate', 'Organisation d\'événements', 'Facility management'] }
      ]
    },
    {
      title: 'Sport & Coaching',
      value: 'Sport & Coaching',
      items: [
        { section: 'Gestion de carrière', subitems: ['Représentation d\'athlètes', 'Sponsoring', 'Bilans de performance', 'Transition post-carrière'] },
        { section: 'Événements sportifs', subitems: ['Organisation de compétitions', 'Gestion logistique', 'Sécurité événementielle', 'Promotion sportive'] },
        { section: 'Technologie sportive', subitems: ['Analyse de performance', 'Applications fitness', 'E-sport', 'Équipements connectés'] },
        { section: 'Entraînement personnel', subitems: ['Programmes sur mesure', 'Préparation physique', 'Nutrition sportive', 'Récupération'] },
      ]
    },
    {
      title: 'Design',
      value: 'Design',
      items: [
        { section: 'Graphisme', subitems: ['Logos', 'Cartes de visite', 'Brochures'] },
        { section: 'UI/UX Design', subitems: ['Wireframes', 'Prototypes', 'Tests utilisateurs'] },
        { section: 'Illustration', subitems: ['Illustrations personnalisées', 'Infographies'] }
      ]
    },
    {
      title: 'Business',
      value: 'Business',
      items: [
        { section: 'Stratégie', subitems: ['Business plan', 'Pitch deck', 'Conseil en gestion'] },
        { section: 'Légal', subitems: ['Création entreprise', 'Mentorat juridique'] },
        { section: 'Ressources humaines', subitems: ['Recrutement', 'Coaching', 'Formation'] }
      ]
    }
  ];

  constructor(
    private router: Router, 
    private elementRef: ElementRef,
    private serviceService: ExpertService
  ) {}

  ngOnInit(): void {
    this.checkMobileView();
    this.loadServices();
    
    // Écouter les clics pour fermer le dropdown
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  // Pagination Methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredServices.length / this.servicesPerPage);
    this.generatePaginationPages();
    this.updatePaginatedServices();
  }

  generatePaginationPages(): void {
    this.paginationPages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.paginationPages.push(i);
    }
  }

  updatePaginatedServices(): void {
    const startIndex = (this.currentPage - 1) * this.servicesPerPage;
    const endIndex = startIndex + this.servicesPerPage;
    this.paginatedServices = this.filteredServices.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedServices();
      // Scroll vers le haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Chargement des services depuis l'API
  private loadServices(): void {
    console.log(' Début du chargement des services');
    this.isLoading = true;
    this.error = null;

    this.serviceService.getAllPublicServices()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error(' Erreur lors du chargement des services:', error);
          this.error = 'Impossible de charger les services';
          this.isLoading = false;
          return [];
        })
      )
      .subscribe({
        next: (services) => {
          console.log(' Services reçus de l\'API', services);
          this.handleServicesResponse(services);
        },
        error: (error) => {
          console.error(' Erreur dans la subscription:', error);
        }
      });
  }

  private transformServices(services: IService[]): any[] {
    return services.map(service => {
      console.log('Service API:', service);
      
      return {
        ...service,
        title: service.name,
        imageUrl: service.cover_image || 'https://via.placeholder.com/300x200',
        expertProfil: 'https://via.placeholder.com/50',
        expertName: 'Expert',
        avarage: 4.5,
        reviews: 15,
        price: (service.price) || 0,
        category: service.category_display || service.category || 'Catégorie inconnue',
        isFavorite: false
      };
    });
  }

  private handleServicesResponse(services: IService[]): void {
    console.log(' Services reçus de l\'API:', services);
    
    this.service = this.transformServices(services);
    this.filteredServices = [...this.service];
    
    console.log(' Services transformés:', this.service);
    
    this.isLoading = false;
    this.showServices = true;
    this.updatePagination();
  }

  reloadServices(): void {
    this.loadServices();
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.showPriceDropdown && this.priceFilter && 
        !this.priceFilter.nativeElement.contains(event.target)) {
      this.showPriceDropdown = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth < 1024;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  adjustDropdownPosition(event: MouseEvent) {
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
    if (!dropdown) return;

    dropdown.classList.add('show');
    dropdown.style.left = '';
    dropdown.style.right = '';

    const rect = dropdown.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Calculer la position optimale
    if (rect.right > viewportWidth - 20) {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
      dropdown.style.transform = 'translateX(0)';
    } else if (rect.left < 20) {
      dropdown.style.left = '0';
      dropdown.style.right = 'auto';
      dropdown.style.transform = 'translateX(0)';
    } else {
      dropdown.style.left = '50%';
      dropdown.style.right = 'auto';
      dropdown.style.transform = 'translateX(-50%)';
    }
  }

  hideDropdown(event: MouseEvent) {
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  togglePriceDropdown(event: Event) {
    event.stopPropagation();
    this.showPriceDropdown = !this.showPriceDropdown;
  }

  applyPriceFilter(range: PriceRange, event: Event) {
    event.stopPropagation();
    
    this.priceRanges.forEach(r => r.checked = false);
    range.checked = true;
    
    this.filters.priceRange = range.value;
    this.applyFilters();
    this.showPriceDropdown = false;
  }

  applyFilters(): void {
    console.log('🔍 Application des filtres:', this.filters);
    
    this.filteredServices = this.service.filter(service => {
      // Filtre par texte
      const matchesSearch = this.filters.searchText === '' || 
        service.name?.toLowerCase().includes(this.filters.searchText.toLowerCase()) || 
        service.description?.toLowerCase().includes(this.filters.searchText.toLowerCase());

      // Filtre par prix
      const selectedRange = this.priceRanges.find(r => r.checked && r.value !== 'all');
      let matchesPrice = true;
      if (selectedRange) {
        const servicePrice = (service.price) || 0;
        if (selectedRange.min !== undefined && selectedRange.max !== undefined) {
          matchesPrice = servicePrice >= selectedRange.min && servicePrice <= selectedRange.max;
        } else if (selectedRange.min !== undefined) {
          matchesPrice = servicePrice >= selectedRange.min;
        }
      }

      // Filtre par note
      const matchesRating = this.filters.minRating === 0 || 
        (service.avarage || 0) >= this.filters.minRating;

      // Filtre par catégorie
      const matchesCategory = this.filters.category === 'all' || 
        service.category_display === this.filters.category ||
        service.category === this.filters.category;

      // Filtre par sous-catégorie
      const matchesSubcategory = this.filters.subcategory === 'all' || 
        service.subcategory?.name === this.filters.subcategory;

      return matchesSearch && matchesPrice && matchesRating && matchesCategory && matchesSubcategory;
    });

    // Reset pagination après filtrage
    this.currentPage = 1;
    this.updatePagination();

    console.log('📊 Résultats filtrés:', this.filteredServices.length);
  }

  onSearchChange(searchText: string): void {
    this.filters.searchText = searchText;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.filters.category = category;
    this.filters.subcategory = 'all';
    this.applyFilters();
    this.isMobileMenuOpen = false;
  }

  onSubcategoryChange(subcategory: string, event: Event): void {
    event.stopPropagation();
    this.filters.subcategory = subcategory;
    this.applyFilters();
  }

  onRatingChange(minRating: number): void {
    this.filters.minRating = minRating;
    this.applyFilters();
  }

  toggleFavorite(service: IService, event: Event) {
    event.stopPropagation();
    service.isFavorite = !service.isFavorite;
    console.log('Favori:', service.name, 'état:', service.isFavorite);
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }

  onServiceDetails(service: IService): void {
    this.router.navigate(['/service-details', service.id], {
      state: { service }
    });
  }

  getSubcategories(categoryValue: string): string[] {
    console.log('📋 Recherche des sous-catégories pour:', categoryValue);
    
    const allSubcategories = new Set<string>();
    
    this.service.forEach(service => {
      if (service.category_display === categoryValue || service.category === categoryValue) {
        if (service.subcategory?.name) {
          allSubcategories.add(service.subcategory.name);
        }
      }
    });
    
    const result = Array.from(allSubcategories);
    console.log('Sous-catégories trouvées:', result);
    return result;
  }

  loadServiceDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.serviceService.getServiceDetails(id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Erreur lors du chargement du service:', err);
          this.error = 'Impossible de charger les détails du service';
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (serv: IService) => {
          this.serv = serv;
          console.log('Détails du service:', this.serv);

          this.router.navigate(
            ['/service-details', serv.id],
            { state: { service: serv } }
          );
        }
      });
  }
}
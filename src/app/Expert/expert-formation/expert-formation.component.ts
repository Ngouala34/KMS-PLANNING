import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IService } from 'src/app/Interfaces/iservice';
import { ExpertService } from 'src/app/services/expert/expert.service';

interface Category {
  value: string;
  displayName: string;
  subcategories: { value: string; displayName: string }[];
}

@Component({
  selector: 'app-expert-formation',
  templateUrl: './expert-formation.component.html',
  styleUrls: ['./expert-formation.component.scss']
})
export class ExpertFormationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isSidebarCollapsed = false;
  collapsedByDefault = false;
  notify = false;
  notificationCount = 0;
  searchQuery = '';

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  totalItems = 0;

  isLoading = true;
  error: string | null = null;

  formations: IService[] = [];
  filteredFormations: IService[] = [];
  paginatedFormations: IService[] = [];

  showEditModal = false;
  editServiceForm!: FormGroup;
  isModalLoading = false;
  isFetchingService = false;
  imagePreview: string | null = null;
  selectedService: IService | null = null;
  modalError: string | null = null;

  availableSubcategories: { value: string; displayName: string }[] = [];
  availableSubsubcategories: { value: string; displayName: string }[] = [];

  // --- TON TABLEAU COMPLET ---
  categories: Category[] = [
    {
      value: '1',
      displayName: 'Programmation & Tech',
      subcategories: [
        { value: '1', displayName: 'Sites web IA & Logiciel' },
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
        { value: 'speed_optimization', displayName: 'Optimisation de la vitesse' },
        { value: 'cloud_computing', displayName: 'Cloud Computing' },
        { value: 'devops_engineering', displayName: 'DevOps Engineering' },
        { value: 'cybersecurity', displayName: 'Cybersecurity' },
        { value: 'cross_platform_dev', displayName: 'Développement multiplateforme' },
        { value: 'android_dev', displayName: 'Android' },
        { value: 'ios_dev', displayName: 'iOS' },
        { value: 'mobile_maintenance', displayName: 'Maintenance mobile' },
        { value: 'web_apps', displayName: 'Applications web' },
        { value: 'workflow_automation', displayName: 'Automations & Flux de travail' },
        { value: 'api_integrations', displayName: 'API et intégrations' },
        { value: 'databases', displayName: 'Bases de données' },
        { value: 'qa_review', displayName: 'QA et révision' },
        { value: 'user_testing', displayName: 'Tests utilisateurs' }
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
        { value: 'logistics_management', displayName: 'Gestion logistique' },
        { value: 'event_security', displayName: 'Sécurité événementielle' },
        { value: 'sports_promotion', displayName: 'Promotion sportive' },
        { value: 'performance_analysis', displayName: 'Analyse de performance' },
        { value: 'fitness_apps', displayName: 'Applications fitness' },
        { value: 'esport', displayName: 'E-sport' },
        { value: 'connected_equipment', displayName: 'Équipements connectés' },
        { value: 'custom_programs', displayName: 'Programmes sur mesure' },
        { value: 'physical_preparation', displayName: 'Préparation physique' },
        { value: 'sports_nutrition', displayName: 'Nutrition sportive' },
        { value: 'recovery', displayName: 'Récupération' }
      ]
    }
    // Ajoute toutes les autres catégories complètes ici...
  ];

  constructor(
    private serviceService: ExpertService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault;
    this.loadServices();
    this.initEditForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- INIT FORM ---
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

  // --- MODAL EXISTANT ---
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
    // Ici tu peux gérer si tu as des "sub-subcategories"
    return [];
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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
            this.showSuccessNotification('Service modifié avec succès !');
          }
        });
    }
  }

private prepareFormData(): FormData {
  const formData = new FormData();
  const formValue = this.editServiceForm.value;

  Object.keys(formValue).forEach(key => {
    if (formValue[key] !== null && formValue[key] !== undefined && formValue[key] !== '') {

      //  Gestion de la date (le backend attend un tableau JSON)
      if (key === 'date') {
        formData.append('date', JSON.stringify([formValue.date]));
      }
      //  Gestion des catégories (backend attend la valeur/id)
      else if (key === 'category' || key === 'subcategory' || key === 'subsubcategory') {
        formData.append(key, formValue[key]); // formValue doit contenir la valeur/id, pas le displayName
      }
      //  Autres champs
      else {
        formData.append(key, formValue[key]);
      }
    }
  });

  // Image de couverture
  if (formValue.cover_image instanceof File) {
    formData.append('cover_image', formValue.cover_image);
  }

  return formData;
}


  private updateServiceInList(updatedService: IService): void {
    const index = this.formations.findIndex(s => s.id === updatedService.id);
    if (index !== -1) {
      this.formations[index] = updatedService;
      this.filteredFormations = [...this.formations];
      this.updatePagination();
    }
  }

  private showSuccessNotification(message: string): void {
    console.log(message);
    this.notificationCount++;
    this.notify = true;
    setTimeout(() => this.notify = false, 3000);
  }

  // --- SEARCH ---
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredFormations = [...this.formations];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredFormations = this.formations.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  viewDetails(service: IService): void {
    this.router.navigate(['/service-details', service.id]);
  }

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

  getPageNumbers(): number[] { const pages = []; const maxVisiblePages = 5; let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2)); const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1); if (endPage - startPage + 1 < maxVisiblePages) { startPage = Math.max(1, endPage - maxVisiblePages + 1); } for (let i = startPage; i <= endPage; i++) { pages.push(i); } return pages; }

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
      .subscribe({ next: (services) => {
        this.formations = services;
        this.filteredFormations = [...this.formations];
        this.totalItems = this.formations.length;
        this.updatePagination();
        this.isLoading = false;
      }});
  }
}

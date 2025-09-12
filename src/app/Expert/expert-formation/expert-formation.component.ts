import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { E } from '@fullcalendar/core/internal-common';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { IService } from 'src/app/Interfaces/iservice';
import { ExpertService } from 'src/app/services/expert/expert.service';

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
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  totalItems = 0;
  
  // États de chargement et d'erreur
  isLoading = true;
  error: string | null = null;
  
  formations: IService[] = [];
  filteredFormations: IService[] = [];
  paginatedFormations: IService[] = [];

  constructor(
    private serviceService: ExpertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault;
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Chargement des services depuis l'API
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
          this.handleServicesResponse(services);
        }
      });
  }

  private handleServicesResponse(services: IService[]): void {
    this.formations = services;
    this.filteredFormations = [...this.formations];
    this.totalItems = this.formations.length;
    this.updatePagination();
    this.isLoading = false;
    
    console.log('Services chargés:', this.formations);
  }

  // Recherche
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredFormations = [...this.formations];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredFormations = this.formations.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.expert.name.toLowerCase().includes(query) ||
        (service.expert.expert_profile?.expert_name?.toLowerCase().includes(query) || '')
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Navigation
  viewDetails(service: IService): void {
    this.router.navigate(['/service-details', service.id]);
  }

  editFormation(service: IService): void {
    this.router.navigate(['/edit-service', service.id]);
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

  // Notifications (optionnel)
  showNotification(): void {
    this.notificationCount++;
    this.notify = true;
    setTimeout(() => {
      this.notify = false;
    }, 3000);
  }

  // Recharger les services en cas d'erreur
  reloadServices(): void {
    this.loadServices();
  }
}
import { Component, OnInit } from '@angular/core';
import { Souscription } from '../../models/user/souscription.model';
import { SouscriptionService } from 'src/app/services/user/souscription.service';

@Component({
  selector: 'app-user-souscription',
  templateUrl: './user-souscription.component.html',
  styleUrls: ['./user-souscription.component.scss']
})
export class UserSouscriptionComponent implements OnInit {
  souscriptions: Souscription[] = [];
  isSidebarCollapsed = false;
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  isLoading = true;
  errorMessage = '';

  constructor(private souscriptionService: SouscriptionService) { }

  ngOnInit(): void {
    this.loadSouscriptions();
  }

  loadSouscriptions(): void {
    this.isLoading = true;
    this.souscriptionService.getSouscriptions(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.souscriptions = response.data.map(item => ({
            ...item,
            isFavorite: false
          }));
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des souscriptions';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadSouscriptions();
    window.scrollTo(0, 0);
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({length: pageCount}, (_, i) => i + 1);
  }

  toggleFavorite(service: Souscription, event: Event): void {
    event.stopPropagation();
    service.isFavorite = !service.isFavorite;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  onServiceDetails(serviceId: number): void {
    console.log('Détails du service', serviceId);
    // this.router.navigate(['/service', serviceId]);
  }

  getStatusClass(status: string): string {
    return {
      'actif': 'status-active',
      'expiré': 'status-expired',
      'annulé': 'status-cancelled'
    }[status] || '';
  }
}










/*

import { Component, OnInit } from '@angular/core';
import { Souscription } from '../../models/user/souscription.model';

@Component({
  selector: 'app-user-souscription',
  templateUrl: './user-souscription.component.html',
  styleUrls: ['./user-souscription.component.scss']
})
export class UserSouscriptionComponent implements OnInit {
  souscriptions: Souscription[] = [];
  isSidebarCollapsed = false;
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 12; // Total simulé pour la pagination
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMockSouscriptions();
  }

  loadMockSouscriptions(): void {
    this.isLoading = true;
    
    // Simulation d'un délai de chargement
    setTimeout(() => {
      this.souscriptions = this.generateMockSouscriptions();
      this.isLoading = false;
    }, 800);
  }

  private generateMockSouscriptions(): Souscription[] {
    const mockCategories = ['Nettoyage', 'Jardinage', 'Bricolage', 'Cours particuliers'];
    const mockExperts = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lambert'];
    
    return [
      {
        id: 1,
        serviceId: 101,
        title: 'Nettoyage complet appartement',
        description: 'Nettoyage approfondi de toutes les pièces avec produits écologiques',
        category: mockCategories[0],
        dateSouscription: new Date('2023-06-15'),
        dateExpiration: new Date('2023-12-15'),
        status: 'actif',
        price: 8900,
        imageUrl: 'https://example.com/clean1.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/men/32.jpg',
        expertName: mockExperts[0],
        averageRating: 4.5,
        reviewsCount: 24,
        isFavorite: true
      },
      {
        id: 2,
        serviceId: 102,
        title: 'Taille de haie professionnelle',
        description: 'Taille précise de vos haies avec nettoyage des déchets végétaux',
        category: mockCategories[1],
        dateSouscription: new Date('2023-07-20'),
        dateExpiration: new Date('2023-10-20'),
        status: 'actif',
        price: 12000,
        imageUrl: 'https://example.com/garden1.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/women/44.jpg',
        expertName: mockExperts[1],
        averageRating: 4.8,
        reviewsCount: 37,
        isFavorite: false
      },
      {
        id: 3,
        serviceId: 103,
        title: 'Cours de mathématiques niveau lycée',
        description: 'Soutien scolaire en mathématiques pour élèves de seconde à terminale',
        category: mockCategories[3],
        dateSouscription: new Date('2023-05-10'),
        dateExpiration: new Date('2024-05-10'),
        status: 'actif',
        price: 5000,
        imageUrl: 'https://example.com/maths1.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/men/75.jpg',
        expertName: mockExperts[2],
        averageRating: 4.9,
        reviewsCount: 42,
        isFavorite: true
      },
      {
        id: 4,
        serviceId: 104,
        title: 'Réparation plomberie urgente',
        description: 'Intervention rapide pour fuites et problèmes de canalisation',
        category: mockCategories[2],
        dateSouscription: new Date('2023-08-05'),
        status: 'expiré',
        price: 15000,
        imageUrl: 'https://example.com/plumber1.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/men/68.jpg',
        expertName: mockExperts[3],
        averageRating: 4.3,
        reviewsCount: 18,
        isFavorite: false
      },
      {
        id: 5,
        serviceId: 105,
        title: 'Nettoyage après déménagement',
        description: 'Nettoyage complet du logement après votre déménagement',
        category: mockCategories[0],
        dateSouscription: new Date('2023-09-12'),
        status: 'annulé',
        price: 7500,
        imageUrl: 'https://example.com/clean2.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/women/63.jpg',
        expertName: mockExperts[1],
        averageRating: 4.6,
        reviewsCount: 31,
        isFavorite: false
      },
      {
        id: 6,
        serviceId: 106,
        title: 'Élagage arbres dangereux',
        description: 'Élagage sécurisé des arbres menaçants par professionnel certifié',
        category: mockCategories[1],
        dateSouscription: new Date('2023-10-01'),
        dateExpiration: new Date('2024-04-01'),
        status: 'actif',
        price: 18000,
        imageUrl: 'https://example.com/garden2.jpg',
        expertProfil: 'https://randomuser.me/api/portraits/men/29.jpg',
        expertName: mockExperts[0],
        averageRating: 4.7,
        reviewsCount: 22,
        isFavorite: true
      }
    ];
  }

  // Les autres méthodes restent inchangées
  changePage(page: number): void {
    this.currentPage = page;
    this.loadMockSouscriptions();
    window.scrollTo(0, 0);
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({length: pageCount}, (_, i) => i + 1);
  }

  toggleFavorite(service: Souscription, event: Event): void {
    event.stopPropagation();
    service.isFavorite = !service.isFavorite;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  onServiceDetails(serviceId: number): void {
    console.log('Détails du service', serviceId);
  }

  getStatusClass(status: string): string {
    return {
      'actif': 'status-active',
      'expiré': 'status-expired',
      'annulé': 'status-cancelled'
    }[status] || '';
  }
}
  */
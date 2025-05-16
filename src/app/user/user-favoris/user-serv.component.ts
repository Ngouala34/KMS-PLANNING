import { Component, OnInit } from '@angular/core';
import { Favoris } from '../../models/user/favoris.model';

@Component({
  selector: 'app-user-favoris',
  templateUrl: './user-serv.component.html',
  styleUrls: ['./user-serv.component.scss']
})
export class UserServComponent implements OnInit {
  favoris: Favoris[] = [];
  isSidebarCollapsed = false;
  isSidebarCollapsedByDefault = false; // Indique si la sidebar est réduite au départ
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMockFavoris();
  }

  loadMockFavoris(): void {
    this.isLoading = true;
    
    // Simulation délai chargement
    setTimeout(() => {
      this.favoris = this.generateMockFavoris();
      this.isLoading = false;
    }, 800);
  }

  private generateMockFavoris(): Favoris[] {
    const mockCategories = ['Nettoyage', 'Jardinage', 'Bricolage', 'Cours particuliers'];
    const mockExperts = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Lambert'];
    
    return [
      {
        id: 1,
        serviceId: 101,
        title: 'Nettoyage complet appartement',
        description: 'Nettoyage approfondi avec produits écologiques pour un intérieur impeccable',
        category: mockCategories[0],
        dateAdded: new Date('2023-06-10'),
        price: 8900,
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        expertProfil: 'https://randomuser.me/api/portraits/men/32.jpg',
        expertName: mockExperts[0],
        averageRating: 4.5,
        reviewsCount: 24,
        isFavorite: true
      },
      {
        id: 2,
        serviceId: 102,
        title: 'Cours de mathématiques avancées',
        description: 'Soutien scolaire pour élèves en prépa scientifique ou université',
        category: mockCategories[3],
        dateAdded: new Date('2023-07-15'),
        price: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        expertProfil: 'https://randomuser.me/api/portraits/women/45.jpg',
        expertName: mockExperts[3],
        averageRating: 4.9,
        reviewsCount: 35,
        isFavorite: true
      },
      {
        id: 3,
        serviceId: 103,
        title: 'Installation meuble TV sur mesure',
        description: 'Montage professionnel de votre meuble TV avec câble management',
        category: mockCategories[2],
        dateAdded: new Date('2023-08-22'),
        price: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        expertProfil: 'https://randomuser.me/api/portraits/men/68.jpg',
        expertName: mockExperts[2],
        averageRating: 4.7,
        reviewsCount: 18,
        isFavorite: true
      },
      {
        id: 4,
        serviceId: 104,
        title: 'Création jardin zen',
        description: 'Aménagement d\'un espace extérieur apaisant avec plantes adaptées',
        category: mockCategories[1],
        dateAdded: new Date('2023-09-05'),
        price: 25000,
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        expertProfil: 'https://randomuser.me/api/portraits/women/63.jpg',
        expertName: mockExperts[1],
        averageRating: 4.8,
        reviewsCount: 27,
        isFavorite: true
      }
    ];
  }

  toggleFavorite(service: Favoris, event: Event): void {
    event.stopPropagation();
    // Dans la réalité, on enverrait une requête API puis on mettrait à jour
    this.favoris = this.favoris.filter(f => f.id !== service.id);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  onServiceDetails(serviceId: number): void {
    console.log('Navigation vers détail du service:', serviceId);
    // this.router.navigate(['/service', serviceId]);
  }
}
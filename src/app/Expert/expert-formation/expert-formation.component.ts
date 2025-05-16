import { Component, OnInit } from '@angular/core';

interface Formation {
  id: string;
  imageUrl: string;
  expertProfil: string;
  expertName: string;
  title: string;
  description: string;
  averageRating: number;
  ratingCount: number;
  subscriptions: number;
  price: number;
  date: string;
  
}

@Component({
  selector: 'app-expert-formation',
  templateUrl: './expert-formation.component.html',
  styleUrls: ['./expert-formation.component.scss']
})
export class ExpertFormationComponent implements OnInit {
  isSidebarCollapsed = false;
  collapsedByDefault = false;
  notify = false;
  notificationCount = 0;
  searchQuery = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  
  formations: Formation[] = [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
      expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
      expertName: 'Rehan',
      title: 'Développement WordPress',
      description: 'Je suis un développeur WordPress et j\'aime créer des sites Web WordPress personnalisés et réactifs.',
      averageRating: 4.2,
      ratingCount: 120,
      subscriptions: 24,
      price: 80,
      date: '12/02/2023'
    },
    // Ajouter plus de formations pour tester la pagination...
    ...Array.from({length: 20}, (_, i) => ({
      id: `${i+2}`,
      imageUrl: 'https://via.placeholder.com/300x200?text=Formation+'+(i+2),
      expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
      expertName: 'Expert ' + (i+1),
      title: 'Formation ' + (i+1),
      description: 'Description de la formation ' + (i+1),
      averageRating: 3.5 + Math.random(),
      ratingCount: Math.floor(Math.random() * 100),
      subscriptions: Math.floor(Math.random() * 50),
      price: Math.floor(Math.random() * 100) + 20,
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
    }))
  ];

  filteredFormations: Formation[] = [];
  paginatedFormations: Formation[] = [];

  constructor() { }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault;
    this.filteredFormations = [...this.formations];
    this.updatePagination();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredFormations = [...this.formations];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredFormations = this.formations.filter(formation =>
        formation.title.toLowerCase().includes(query) ||
        formation.description.toLowerCase().includes(query) ||
        formation.expertName.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  viewDetails(formation: Formation): void {
    // Implémentez la navigation vers la page de détails
    console.log('Voir détails:', formation);
    // Exemple : this.router.navigate(['/formation-details', formation.id]);
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

  showNotification(): void {
    this.notificationCount++;
    this.notify = true;
    setTimeout(() => {
      this.notify = false;
    }, 3000);
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

  editFormation(formation: Formation): void {
    console.log('Modifier la formation:', formation);
    // Implémentez la logique de modification ici
    // Par exemple : this.router.navigate(['/edit-formation', formation.id]);
  }
}
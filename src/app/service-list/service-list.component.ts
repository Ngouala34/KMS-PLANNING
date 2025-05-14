import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  expertProfil: string;
  expertName: string;
  avarage: number;
  reviews: number;
  price: number;
  category: string;
}

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

isFavorite = false;
isSidebarCollapsed = false;
isMobileMenuOpen = false;

toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

  showServices = false; // Contrôle l'animation d'affichage

  constructor(private router:Router) { }
 



  adjustDropdownPosition(event: MouseEvent) {
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
  
    if (!dropdown) return;
  
    dropdown.classList.add('show'); // Montre le menu
  
    // Reset position
    dropdown.style.left = '';
    dropdown.style.right = '';
  
    const rect = dropdown.getBoundingClientRect();
  
    if (rect.right > window.innerWidth) {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
    } else if (rect.left < 0) {
      dropdown.style.left = '0';
      dropdown.style.right = 'auto';
    }
  }
  
  hideDropdown(event: MouseEvent) {
    const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      dropdown.classList.remove('show'); // Cache le menu
    }
  }
  

  service = {
    imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
    expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
    expertName: 'Rehan',
    title: ' Développement WordPress',
    description: 'Je suis un développeur WordPress et j\'aime créer des sites Web WordPress personnalisés et réactifs.',
    avarage: 4.2,
    ratingCount: 120,
    reviews: 24, 
    price: 80
  };

  categories = [
    {
      title: 'Programmation & Tech',
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
      items: [
        { section: 'Droit des affaires', subitems: ['Rédaction de contrats', 'Constitution d\'entreprise', 'Droit commercial', 'Propriété intellectuelle'] },
        { section: 'Droit civil', subitems: ['Droit familial', 'Successions', 'Droit immobilier', 'Responsabilité civile'] },
        { section: 'Contentieux', subitems: ['Représentation en justice', 'Médiation', 'Arbitrage', 'Procédures pénales'] },
        { section: 'Conformité', subitems: ['Protection des données (RGPD)', 'Compliance financière', 'Droit du travail'] }
      ]
    },
    {
      title: 'Banques & Finances',
      items: [
        { section: 'Services bancaires', subitems: ['Comptes courants', 'Prêts immobiliers', 'Crédits professionnels', 'Gestion de patrimoine'] },
        { section: 'Fintech', subitems: ['Paiements en ligne', 'Blockchain', 'Crowdfunding', 'Robo-advisors'] },
        { section: 'Audit & Risque', subitems: ['Audit financier', 'Contrôle interne', 'Gestion des risques', 'Due diligence'] },
        { section: 'Investissements', subitems: ['Gestion d\'actifs', 'Planification financière', 'Retraite', 'Fiscalité'] },

      ]
    },
    {
      title: 'Société & Services',
      items: [
        { section: 'Services sociaux', subitems: ['Insertion professionnelle', 'Aide aux seniors', 'Services familiaux', 'Aide au logement'] },
        { section: 'Formation', subitems: ['Cours particuliers', 'Formation professionnelle', 'Coaching carrière', 'Ateliers de développement'] },
        { section: 'Services aux entreprises', subitems: ['Ressources humaines', 'Communication corporate', 'Organisation d\'événements', 'Facility management'] }
      ]
    },
    {
      title: 'Sport & Coaching',
      items: [
        { section: 'Gestion de carrière', subitems: ['Représentation d\'athlètes', 'Sponsoring', 'Bilans de performance', 'Transition post-carrière'] },
        { section: 'Événements sportifs', subitems: ['Organisation de compétitions', 'Gestion logistique', 'Sécurité événementielle', 'Promotion sportive'] },
        { section: 'Technologie sportive', subitems: ['Analyse de performance', 'Applications fitness', 'E-sport', 'Équipements connectés'] },
        { section: 'Entraînement personnel', subitems: ['Programmes sur mesure', 'Préparation physique', 'Nutrition sportive', 'Récupération'] },

      ]
    },
    {
      title: 'Design',
      items: [
        { section: 'Graphisme', subitems: ['Logos', 'Cartes de visite', 'Brochures'] },
        { section: 'UI/UX Design', subitems: ['Wireframes', 'Prototypes', 'Tests utilisateurs'] },
        { section: 'Illustration', subitems: ['Illustrations personnalisées', 'Infographies'] }
      ]
    },

    {
      title: 'Business',
      items: [
        { section: 'Stratégie', subitems: ['Business plan', 'Pitch deck', 'Conseil en gestion'] },
        { section: 'Légal', subitems: ['Création entreprise', 'Mentorat juridique'] },
        { section: 'Ressources humaines', subitems: ['Recrutement', 'Coaching', 'Formation'] }
      ]
    },

  ];

   filteredServices: Service[] = [];

  // États des filtres
  filters = {
    searchText: '',
    priceRange: 'all',
    minRating: 0
  };

  // Options pour les filtres
  priceRanges = [
    { value: 'all', label: 'Tous les prix' },
    { value: 'economy', label: 'Économique: < 50,000 FCFA' },
    { value: 'standard', label: 'Standard: 50,000 - 150,000 FCFA' },
    { value: 'premium', label: 'Premium: > 150,000 FCFA' }
  ];

  ratingOptions = [
    { value: 0, label: 'Toutes les notes' },
    { value: 3, label: '★★★☆☆ et plus' },
    { value: 4, label: '★★★★☆ et plus' },
    { value: 4.5, label: '★★★★★ seulement' }
  ];

  ngOnInit(): void {
    this.filteredServices = [...this.filteredServices];
  }

  applyFilters(): void {
    this.filteredServices = this.filteredServices.filter(service => {
      // Filtre par texte (nom du service ou expert)
      const matchesSearch = this.filters.searchText === '' || 
        service.title.toLowerCase().includes(this.filters.searchText.toLowerCase()) || 
        service.expertName.toLowerCase().includes(this.filters.searchText.toLowerCase());

      // Filtre par prix
      let matchesPrice = true;
      switch(this.filters.priceRange) {
        case 'economy': matchesPrice = service.price < 10000; break;
        case 'standard': matchesPrice = service.price >= 10000 && service.price <= 30000; break;
        case 'premium': matchesPrice = service.price > 30000; break;
      }

      // Filtre par note
      const matchesRating = service.avarage >= this.filters.minRating;

      return matchesSearch && matchesPrice && matchesRating;
    });
  }

  // Méthode pour afficher les étoiles
getStars(rating: number): number[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(1); // étoile pleine
  }
  
  if (hasHalfStar) {
    stars.push(0.5); // demi-étoile
  }
  
  return stars;
}



  onSearchChange(searchText: string): void {
    this.filters.searchText = searchText;
    this.applyFilters();
  }

  onPriceRangeChange(range: string): void {
    this.filters.priceRange = range;
    this.applyFilters();
  }

  onRatingChange(minRating: number): void {
    this.filters.minRating = minRating;
    this.applyFilters();
  }


  
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    console.log('Favori:', this.service.title, 'état:', this.isFavorite);

    // Ici tu peux appeler ton API backend :
    // this.http.post('/api/favorite', { id: this.service.id, favorite: this.isFavorite }).subscribe(...)
  }
  OnPayment(): void {
    this.router.navigateByUrl('payment')// Redirige vers la page de paiement
  }
  onService(): void{
    this.router.navigateByUrl('service-list')
  }
  onServiceDetails(): void{
    this.router.navigateByUrl('service-details')
  }

  

}

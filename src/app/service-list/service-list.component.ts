import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
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
  subcategory?: string;
  isFavorite?: boolean;
}

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
export class ServiceListComponent implements OnInit {
  @ViewChild('priceFilter') priceFilter!: ElementRef;

  isFavorite = false;
  isMobileMenuOpen = false;
  showPriceDropdown = false;
  showServices = false;
  isMobileView = false;

  // Services de démonstration
  services: Service[] = [
    {
      id: 1,
      title: 'Développement & Design',
      description: 'Je suis un développeur et designer. J\'aime créer des sites Web designés, personnalisés et réactifs.',
      imageUrl: '/assets/images/webdev.jpg',
      expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
      expertName: 'Rehan',
      avarage: 4.2,
      reviews: 24,
      price: 80000,
      category: 'Programmation & Tech',
      subcategory: 'Sites web'
    },
    {
      id: 2,
      title: 'Application Mobile React Native',
      description: 'Développement d\'applications mobiles cross-platform avec React Native.',
      imageUrl: 'assets/images/reactNative.jpg',
      expertProfil: 'https://randomuser.me/api/portraits/men/32.jpg',
      expertName: 'Marc',
      avarage: 4.8,
      reviews: 45,
      price: 150000,
      category: 'Programmation & Tech',
      subcategory: 'Applications mobiles'
    },
    {
      id: 3,
      title: 'Stratégie SEO Complète',
      description: 'Optimisation de votre site pour les moteurs de recherche et augmentation du trafic organique.',
      imageUrl: 'assets/images/seo.jpg',
      expertProfil: 'https://randomuser.me/api/portraits/women/44.jpg',
      expertName: 'Sophie',
      avarage: 4.5,
      reviews: 32,
      price: 50000,
      category: 'Marketing digital',
      subcategory: 'SEO & Référencement'
    }
    // Ajouter d'autres services avec des sous-catégories...
  ];

  filteredServices: Service[] = [];
  selectedCategory: string = 'all';
  selectedSubcategory: string = 'all';

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
    { value: 3, label: '★★★☆☆ et plus' },
    { value: 4, label: '★★★★☆ et plus' },
    { value: 4.5, label: '★★★★★ seulement' }
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

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.checkMobileView();
    this.filteredServices = [...this.services];
    setTimeout(() => {
      this.showServices = true;
    }, 300);

    // Écouter les clics pour fermer le dropdown
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    // Nettoyer l'écouteur d'événements
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent): void {
    // Fermer le dropdown si on clique ailleurs
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
      dropdown.classList.remove('show');
    }
  }

  togglePriceDropdown(event: Event) {
    event.stopPropagation();
    this.showPriceDropdown = !this.showPriceDropdown;
  }

  applyPriceFilter(range: PriceRange, event: Event) {
    event.stopPropagation();
    
    // Décocher toutes les autres ranges
    this.priceRanges.forEach(r => r.checked = false);
    range.checked = true;
    
    this.filters.priceRange = range.value;
    this.applyFilters();
    this.showPriceDropdown = false;
  }

  applyFilters(): void {
    this.filteredServices = this.services.filter(service => {
      // Filtre par texte
      const matchesSearch = this.filters.searchText === '' || 
        service.title.toLowerCase().includes(this.filters.searchText.toLowerCase()) || 
        service.expertName.toLowerCase().includes(this.filters.searchText.toLowerCase());

      // Filtre par prix
      const selectedRange = this.priceRanges.find(r => r.checked && r.value !== 'all');
      let matchesPrice = true;
      if (selectedRange) {
        if (selectedRange.min !== undefined && selectedRange.max !== undefined) {
          matchesPrice = service.price >= selectedRange.min && service.price <= selectedRange.max;
        } else if (selectedRange.min !== undefined) {
          matchesPrice = service.price >= selectedRange.min;
        }
      }

      // Filtre par note
      const matchesRating = service.avarage >= this.filters.minRating;

      // Filtre par catégorie
      const matchesCategory = this.filters.category === 'all' || 
        service.category === this.filters.category;

      // Filtre par sous-catégorie
      const matchesSubcategory = this.filters.subcategory === 'all' || 
        (service.subcategory && service.subcategory === this.filters.subcategory);

      return matchesSearch && matchesPrice && matchesRating && matchesCategory && matchesSubcategory;
    });
  }

  onSearchChange(searchText: string): void {
    this.filters.searchText = searchText;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.filters.category = category;
    this.filters.subcategory = 'all'; // Reset subcategory filter
    this.applyFilters();
    this.isMobileMenuOpen = false; // Close mobile menu after selection
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

  toggleFavorite(service: Service, event: Event) {
    event.stopPropagation();
    service.isFavorite = !service.isFavorite;
    console.log('Favori:', service.title, 'état:', service.isFavorite);
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
    
    // Ajouter des étoiles vides pour compléter à 5
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }

  onServiceDetails(service: Service): void {
    this.router.navigate(['/service-details', service.id], {
      state: { service }
    });
  }

  getSubcategories(categoryValue: string): string[] {
    const category = this.categories.find(cat => cat.value === categoryValue);
    if (!category) return [];
    
    const subcategories: string[] = [];
    category.items.forEach(item => {
      subcategories.push(item.section);
      subcategories.push(...item.subitems);
    });
    
    return [...new Set(subcategories)]; // Remove duplicates
  }
}












// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// interface Service {
//   id: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   expertProfil: string;
//   expertName: string;
//   avarage: number;
//   reviews: number;
//   price: number;
//   category: string;
// }

// @Component({
//   selector: 'app-service-list',
//   templateUrl: './service-list.component.html',
//   styleUrls: ['./service-list.component.scss']
// })
// export class ServiceListComponent implements OnInit {

// isFavorite = false;
// isSidebarCollapsed = false;
// isMobileMenuOpen = false;
// showPriceDropdown = false;

// toggleMobileMenu() {
//   this.isMobileMenuOpen = !this.isMobileMenuOpen;
// }

//   showServices = false; // Contrôle l'animation d'affichage

//   constructor(private router:Router) { }
 



//   adjustDropdownPosition(event: MouseEvent) {
//     const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
  
//     if (!dropdown) return;
  
//     dropdown.classList.add('show'); // Montre le menu
  
//     // Reset position
//     dropdown.style.left = '';
//     dropdown.style.right = '';
  
//     const rect = dropdown.getBoundingClientRect();
  
//     if (rect.right > window.innerWidth) {
//       dropdown.style.left = 'auto';
//       dropdown.style.right = '0';
//     } else if (rect.left < 0) {
//       dropdown.style.left = '0';
//       dropdown.style.right = 'auto';
//     }
//   }
  
//   hideDropdown(event: MouseEvent) {
//     const dropdown = (event.currentTarget as HTMLElement).querySelector('.dropdown') as HTMLElement;
//     if (dropdown) {
//       dropdown.classList.remove('show'); // Cache le menu
//     }
//   }
  

//   service = {
//     imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
//     expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
//     expertName: 'Rehan',
//     title: ' Développement WordPress',
//     description: 'Je suis un développeur WordPress et j\'aime créer des sites Web WordPress personnalisés et réactifs.',
//     avarage: 4.2,
//     ratingCount: 120,
//     reviews: 24, 
//     price: 80
//   };

//   categories = [
//     {
//       title: 'Programmation & Tech',
//       items: [
//         { section: 'Développement IA', subitems: ['Sites web IA & Logiciel', 'Applications mobiles IA', 'Intégrations IA', 'Conseil en technologie IA'] },
//         { section: 'Sites web', subitems: ['Développement de sites web', 'Sites web personnalisés', 'Landing pages', 'Sites web de dropshipping'] },
//         { section: 'Maintenance & optimisation', subitems: ['Maintenance de site web', 'Correction de bugs', 'Sauvegarde et migration', 'Optimisation de la vitesse'] },
//         { section: 'Cloud et cybersécurité', subitems: ['Cloud Computing', 'DevOps Engineering', 'Cybersecurity'] },
//         { section: 'Applications mobiles', subitems: ['Développement multiplateforme', 'Android', 'iOS', 'Maintenance mobile'] },
//         { section: 'Logiciels & automatisation', subitems: ['Applications web', 'Automations & Flux de travail', 'API et intégrations', 'Bases de données'] },
//         { section: 'Qualité & tests', subitems: ['QA et révision', 'Tests utilisateurs'] },

//       ]
//     },
//     {
//       title: 'Marketing digital',
//       items: [
//         { section: 'SEO & Référencement', subitems: ['SEO on-page', 'SEO technique', 'Link building'] },
//         { section: 'Publicité en ligne', subitems: ['Google Ads', 'Facebook Ads', 'Instagram Ads'] },
//         { section: 'Réseaux sociaux', subitems: ['Community management', 'Growth hacking', 'Stratégie de contenu'] },
//         { section: 'Email marketing', subitems: ['Campagnes email', 'Newsletters', 'Automatisations'] },
//         { section: 'Stratégie digitale', subitems: ['Audit digital', 'Plan marketing', 'Branding'] }
//       ]
//     },
//     {
//       title: 'Services Juridiques',
//       items: [
//         { section: 'Droit des affaires', subitems: ['Rédaction de contrats', 'Constitution d\'entreprise', 'Droit commercial', 'Propriété intellectuelle'] },
//         { section: 'Droit civil', subitems: ['Droit familial', 'Successions', 'Droit immobilier', 'Responsabilité civile'] },
//         { section: 'Contentieux', subitems: ['Représentation en justice', 'Médiation', 'Arbitrage', 'Procédures pénales'] },
//         { section: 'Conformité', subitems: ['Protection des données (RGPD)', 'Compliance financière', 'Droit du travail'] }
//       ]
//     },
//     {
//       title: 'Banques & Finances',
//       items: [
//         { section: 'Services bancaires', subitems: ['Comptes courants', 'Prêts immobiliers', 'Crédits professionnels', 'Gestion de patrimoine'] },
//         { section: 'Fintech', subitems: ['Paiements en ligne', 'Blockchain', 'Crowdfunding', 'Robo-advisors'] },
//         { section: 'Audit & Risque', subitems: ['Audit financier', 'Contrôle interne', 'Gestion des risques', 'Due diligence'] },
//         { section: 'Investissements', subitems: ['Gestion d\'actifs', 'Planification financière', 'Retraite', 'Fiscalité'] },

//       ]
//     },
//     {
//       title: 'Société & Services',
//       items: [
//         { section: 'Services sociaux', subitems: ['Insertion professionnelle', 'Aide aux seniors', 'Services familiaux', 'Aide au logement'] },
//         { section: 'Formation', subitems: ['Cours particuliers', 'Formation professionnelle', 'Coaching carrière', 'Ateliers de développement'] },
//         { section: 'Services aux entreprises', subitems: ['Ressources humaines', 'Communication corporate', 'Organisation d\'événements', 'Facility management'] }
//       ]
//     },
//     {
//       title: 'Sport & Coaching',
//       items: [
//         { section: 'Gestion de carrière', subitems: ['Représentation d\'athlètes', 'Sponsoring', 'Bilans de performance', 'Transition post-carrière'] },
//         { section: 'Événements sportifs', subitems: ['Organisation de compétitions', 'Gestion logistique', 'Sécurité événementielle', 'Promotion sportive'] },
//         { section: 'Technologie sportive', subitems: ['Analyse de performance', 'Applications fitness', 'E-sport', 'Équipements connectés'] },
//         { section: 'Entraînement personnel', subitems: ['Programmes sur mesure', 'Préparation physique', 'Nutrition sportive', 'Récupération'] },

//       ]
//     },
//     {
//       title: 'Design',
//       items: [
//         { section: 'Graphisme', subitems: ['Logos', 'Cartes de visite', 'Brochures'] },
//         { section: 'UI/UX Design', subitems: ['Wireframes', 'Prototypes', 'Tests utilisateurs'] },
//         { section: 'Illustration', subitems: ['Illustrations personnalisées', 'Infographies'] }
//       ]
//     },

//     {
//       title: 'Business',
//       items: [
//         { section: 'Stratégie', subitems: ['Business plan', 'Pitch deck', 'Conseil en gestion'] },
//         { section: 'Légal', subitems: ['Création entreprise', 'Mentorat juridique'] },
//         { section: 'Ressources humaines', subitems: ['Recrutement', 'Coaching', 'Formation'] }
//       ]
//     },

//   ];

//    filteredServices: Service[] = [];

//   // États des filtres
//   filters = {
//     searchText: '',
//     priceRange: 'all',
//     minRating: 0
//   };

//   // Options pour les filtres
//  priceRanges = [
//   { value: 'economy', label: ' 5000XAF - 20,000XAF', checked: false },
//   { value: 'standard', label: ' 20,000XAF - 50,000XAF', checked: false },
//   { value: 'premium', label: ' 50,000XAF - 100,000XAF', checked: false },
//   { value: 'premium1', label: ' 100,000XAF - 200,000XAF', checked: false },
//   { value: 'premium2', label: ' 200,000XAF - 500,000XAF', checked: false },
//   { value: 'premium3', label: ' 500,000XAF - 1,000,000XAF', checked: false }


// ];


// customMax: number | null = null;

// togglePriceDropdown() {
//   this.showPriceDropdown = !this.showPriceDropdown;
// }

// applyPriceFilter() {
//   const selectedRanges = this.priceRanges
//     .filter(range => range.checked)
//     .map(range => range.value);

//   const customPrice = {
//     max: this.customMax
//   };

//   console.log('Filtres sélectionnés :', selectedRanges);
//   console.log('Prix personnalisé :', customPrice);

//   // Tu peux ensuite filtrer ta liste selon selectedRanges et/ou customMin/customMax
//   this.showPriceDropdown = false;
// }

//   ratingOptions = [
//     { value: 0, label: 'Toutes les notes' },
//     { value: 3, label: '★★★☆☆ et plus' },
//     { value: 4, label: '★★★★☆ et plus' },
//     { value: 4.5, label: '★★★★★ seulement' }
//   ];

//   ngOnInit(): void {
//     this.filteredServices = [...this.filteredServices];
//   }

//   applyFilters(): void {
//     this.filteredServices = this.filteredServices.filter(service => {
//       // Filtre par texte (nom du service ou expert)
//       const matchesSearch = this.filters.searchText === '' || 
//         service.title.toLowerCase().includes(this.filters.searchText.toLowerCase()) || 
//         service.expertName.toLowerCase().includes(this.filters.searchText.toLowerCase());

//       // Filtre par prix
//       let matchesPrice = true;
//       switch(this.filters.priceRange) {
//         case 'economy': matchesPrice = service.price < 10000; break;
//         case 'standard': matchesPrice = service.price >= 10000 && service.price <= 30000; break;
//         case 'premium': matchesPrice = service.price > 30000; break;
//       }

//       // Filtre par note
//       const matchesRating = service.avarage >= this.filters.minRating;

//       return matchesSearch && matchesPrice && matchesRating;
//     });
//   }

//   // Méthode pour afficher les étoiles
// getStars(rating: number): number[] {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 >= 0.5;
  
//   for (let i = 0; i < fullStars; i++) {
//     stars.push(1); // étoile pleine
//   }
  
//   if (hasHalfStar) {
//     stars.push(0.5); // demi-étoile
//   }
  
//   return stars;
// }



//   onSearchChange(searchText: string): void {
//     this.filters.searchText = searchText;
//     this.applyFilters();
//   }

//   onPriceRangeChange(range: string): void {
//     this.filters.priceRange = range;
//     this.applyFilters();
//   }

//   onRatingChange(minRating: number): void {
//     this.filters.minRating = minRating;
//     this.applyFilters();
//   }


  
//   toggleFavorite() {
//     this.isFavorite = !this.isFavorite;
//     console.log('Favori:', this.service.title, 'état:', this.isFavorite);

//     // Ici tu peux appeler ton API backend :
//     // this.http.post('/api/favorite', { id: this.service.id, favorite: this.isFavorite }).subscribe(...)
//   }
//   OnPayment(): void {
//     this.router.navigateByUrl('payment')// Redirige vers la page de paiement
//   }
//   onService(): void{
//     this.router.navigateByUrl('service-list')
//   }
//   onServiceDetails(): void{
//     this.router.navigateByUrl('service-details')
//   }

  

// }

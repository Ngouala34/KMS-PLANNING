import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpertService } from '../services/expert/expert.service';
import { IService, ISubscritionResponse } from '../Interfaces/iservice';
import { UserService } from '../services/user/user.service';

interface ServiceDetails {
  id?: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  price: number;
  availableSpots?: number;
  category?: string;
  level?: string;
  duration?: string;
}

interface ExpertAvis {
  nom: string;
  role: string;
  avatar: string;
  note: number;
  moyenne: string;
}


@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  details: ServiceDetails = {
    title: 'Formation Angular Avancé',
    description: 'Maîtrisez les concepts avancés d\'Angular avec cette formation complète.',
    fullDescription: 'Cette formation vous permettra de maîtriser les concepts avancés d\'Angular, incluant la gestion d\'état, l\'optimisation des performances, et les bonnes pratiques de développement. Vous apprendrez à créer des applications robustes et scalables.',
    date: '2024-12-15',
    startTime: '14:00',
    endTime: '17:00',
    platform: 'Zoom',
    price: 50000,
    availableSpots: 0,
    category: 'Développement Web',
    level: 'Avancé',
    duration: '3 heures'
  };

  avis: ExpertAvis = {
    nom: 'Mr Optimiste',
    role: 'Expert Angular & Développeur Senior',
    avatar: 'assets/images/NPJ.png',
    note: 4.8,
    moyenne: '127 avis'
  };

  activeTab: string = 'overview';
  isMobile: boolean = false;
  isLoading: boolean = false;
  service!: IService ;
  error: string | null = null;
  serviceId!: number; // tu récupères ça via la route ou autre
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ExpertService,
    private userService: UserService
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.loadServiceDetails();
  }

  /**
   * Détection de la taille d'écran
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

 private loadServiceDetails(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');

    if (serviceId) {
      this.isLoading = true;

      this.serviceService.getServiceDetails(+serviceId).subscribe({
        next: (serv: IService) => {
          this.service = serv;
          this.isLoading = false;
          console.log('Service récupéré :', this.service);
        },
        error: (err) => {
          this.error = 'Impossible de charger les détails du service';
          this.isLoading = false;
          console.error('Erreur API:', err);
        }
      });
    }
  }

  /**
   * Générer un tableau d'étoiles pleines
   */
  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Générer un tableau d'étoiles vides
   */
  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Changer l'onglet actif
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

/**
 * Réserver le service
 */
subscribeToService(): void {
  this.isLoading = true;
  this.successMessage = '';
  this.errorMessage = '';

  this.userService.subscribeToNewService(this.service.id).subscribe({
    next: (response: ISubscritionResponse) => {
      console.log('Souscription réussie :', response);
      this.successMessage = 'Redirection vers le paiement...';
      
      // Redirection vers le lien de paiement Flutterwave
      if (response.payment_link) {
        // Option 1: Redirection simple
        window.location.href = response.payment_link;
        
        // Option 2: Ouvrir dans un nouvel onglet
        // window.open(response.payment_link, '_blank');
        
        // Option 3: Redirection avec délai pour voir le message
        // setTimeout(() => {
        //   window.location.href = response.payment_link;
        // }, 2000);
      } else {
        this.errorMessage = 'Lien de paiement non disponible';
        this.isLoading = false;
      }
    },
    error: (err) => {
      console.error('Erreur lors de la souscription:', err);
      this.errorMessage = 'Impossible de souscrire au service. Réessayez plus tard';
      this.isLoading = false;
    }
    // Note: Supprimer le complete() car la redirection se fait dans next()
  });
}


  /**
   * Ajouter aux favoris
   */
  onAddToWishlist(): void {
    // Logique pour ajouter aux favoris
    console.log('Ajouté aux favoris:', this.details.title);
    
    // Afficher une notification de succès
    this.showNotification('Service ajouté aux favoris !', 'success');
  }

  /**
   * Partager le service
   */
  onShare(): void {
    if (navigator.share) {
      // Utiliser l'API Web Share si disponible
      navigator.share({
        title: this.details.title,
        text: this.details.description,
        url: window.location.href
      }).catch(err => console.log('Erreur de partage:', err));
    } else {
      // Fallback : copier le lien
      this.copyToClipboard(window.location.href);
      this.showNotification('Lien copié dans le presse-papier !', 'info');
    }
  }

  /**


  /**
   * Copier dans le presse-papier
   */
  private copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * Afficher une notification
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Ici, vous pouvez utiliser une librairie de notifications comme ngx-toastr
    // ou créer votre propre système de notification
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Exemple simple avec alert (à remplacer par votre système de notification)
    // alert(message);
  }

  /**
   * Vérifier si le service est disponible
   */
  isServiceAvailable(): boolean {
    const serviceDate = new Date(this.details.date);
    const now = new Date();
    
    return serviceDate > now && (this.details.availableSpots || 0) > 0;
  }

  /**
   * Obtenir le statut du service
   */
  getServiceStatus(): string {
    if (!this.isServiceAvailable()) {
      return 'Indisponible';
    }
    
    if ((this.details.availableSpots || 0) <= 3) {
      return 'Places limitées';
    }
    
    return 'Disponible';
  }

  /**
   * Obtenir la classe CSS pour le statut
   */
  getStatusClass(): string {
    const status = this.getServiceStatus();
    
    switch (status) {
      case 'Indisponible':
        return 'status-unavailable';
      case 'Places limitées':
        return 'status-limited';
      default:
        return 'status-available';
    }
  }

  /**
   * Formater la date pour l'affichage
   */
  formatDate(date: string): string {
    const serviceDate = new Date(date);
    return serviceDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Calculer la durée en heures
   */
  calculateDuration(): string {
    const start = new Date(`1970-01-01T${this.details.startTime}:00`);
    const end = new Date(`1970-01-01T${this.details.endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMins === 0) {
      return `${diffHrs}h`;
    }
    return `${diffHrs}h${diffMins}m`;
  }

  /**
   * Gérer les erreurs d'image
   */
  onImageError(event: any): void {
    event.target.src = '/assets/images/default-service.jpg';
  }

  /**
   * Scroll vers une section spécifique
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Vérifier si l'utilisateur peut réserver
   */
  canReserve(): boolean {
    return this.isServiceAvailable() && !this.isLoading;
  }
}
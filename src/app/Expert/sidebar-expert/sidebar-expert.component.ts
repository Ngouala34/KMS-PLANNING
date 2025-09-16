import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-expert',
  templateUrl: './sidebar-expert.component.html',
  styleUrls: ['./sidebar-expert.component.scss']
})
export class SidebarExpertComponent implements OnInit {

  @Input() collapsedByDefault = false; // Indique si la sidebar est réduite au départ
  @Output() sidebarToggle = new EventEmitter<boolean>(); // Envoie l'état de la sidebar au parent

  isCollapsed = false; // État de la sidebar
  isMobile = false; // Détection mobile
  currentRoute = ''; // Route actuelle

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {
    this.checkScreenSize();
  }

ngOnInit(): void {
  this.isCollapsed = this.collapsedByDefault || this.isMobile;
  
  // Écouter les changements de route
  this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  ).subscribe(event => {
    this.currentRoute = event.urlAfterRedirects;
  });
}
  /**
   * Détection de la taille d'écran
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  /**
   * Vérifier si on est sur mobile
   */
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  /**
   * Toggle de la sidebar
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  /**
   * Fermer la sidebar sur mobile après navigation
   */
  private closeSidebarOnMobile(): void {
    if (this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
      this.sidebarToggle.emit(this.isCollapsed);
    }
  }

  /**
   * Navigation avec gestion des erreurs et loading
   */
  private navigateWithLoading(route: string): void {
    try {
      this.router.navigateByUrl(route).then(() => {
        this.closeSidebarOnMobile();
      }).catch(error => {
        console.error('Erreur de navigation:', error);
      });
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
    }
  }

  /**
   * Navigation vers le dashboard expert
   */
  OnExpertdashboard(): void {
    this.navigateWithLoading('/dashboard-expert');
  }

  /**
   * Navigation vers les formations expert
   */
  OnExpertformation(): void {
    this.navigateWithLoading('/expert-formation');
  }

  /**
   * Navigation vers les rendez-vous expert
   */
  OnExpertrendezvous(): void {
    this.navigateWithLoading('/expert-rendez-vous');
  }

  /**
   * Navigation vers les paramètres
   */
  OnSettings(): void {
    this.navigateWithLoading('/expert-settings');
  }

  /**
   * Navigation vers le profil expert
   */
  OnExpertprofile(): void {
    this.navigateWithLoading('/expert-profile');
  }

  /**
   * Navigation vers l'historique expert
   */
  OnExpertHistorique(): void {
    this.navigateWithLoading('/expert-historique');
  }

  /**
   * Créer un nouveau cours/service
   */
  onCreateCourse(): void {
    this.navigateWithLoading('/create-course');
  }

  /**
   * Déconnexion avec confirmation
   */
  Ondeconnexion(): void {
    const confirmLogout = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    
    if (confirmLogout) {
      try {
        this.authService.logout();
        this.router.navigateByUrl('/login').then(() => {
          // Optionnel : afficher un message de déconnexion réussie
        }).catch(error => {
          console.error('Erreur lors de la redirection après déconnexion:', error);
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
  }

  /**
   * Vérifier si une route est active
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }

  /**
   * Obtenir le titre de la page courante
   */
  getCurrentPageTitle(): string {
    const routeTitles: { [key: string]: string } = {
      '/dashboard-expert': 'Dashboard',
      '/expert-formation': 'Mes Services',
      '/expert-rendez-vous': 'Planifications',
      '/expert-settings': 'Paramètres',
      '/expert-profile': 'Profil',
      '/expert-historique': 'Historique'
    };
    
    return routeTitles[this.currentRoute] || 'Expert Panel';
  }
}
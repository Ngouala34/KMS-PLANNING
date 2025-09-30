import { Component, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExpertService } from 'src/app/services/expert/expert.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar-expert',
  templateUrl: './sidebar-expert.component.html',
  styleUrls: ['./sidebar-expert.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({
        width: '4.5rem',
      })),
      state('expanded', style({
        width: '16rem',
      })),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('fadeInOut', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-10px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden <=> visible', animate('200ms ease-in-out'))
    ]),
    trigger('rotateChevron', [
      state('collapsed', style({
        transform: 'rotate(180deg)'
      })),
      state('expanded', style({
        transform: 'rotate(0deg)'
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarExpertComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() collapsedByDefault = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobile = false;
  currentRoute = '';
  isHovered = false;

  // Navigation items
  navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-chart-line',
      route: '/main-expert/dashboard-expert'
    },
    {
      id: 'services',
      label: 'Mes Services',
      icon: 'fas fa-concierge-bell',
      route: '/main-expert/expert-formation',
      badge: 3 // Exemple de badge
    },
    {
      id: 'appointments',
      label: 'Rendez-vous',
      icon: 'fas fa-calendar-check',
      route: '/main-expert/expert-rendez-vous',
      badge: 5
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'fas fa-bell',
      route: '/main-expert/expert-notifications',
    },
    {
      id: 'profile',
      label: 'Mon Profil',
      icon: 'fas fa-user-circle',
      route: '/main-expert/expert-profile'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'fas fa-cog',
      route: '/main-expert/expert-settings'
    },
  ];

  // Actions rapides
  quickActions = [
    {
      id: 'create-service',
      label: 'Nouveau Service',
      icon: 'fas fa-plus-circle',
      action: () => this.onCreateCourse()
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'fas fa-cog',
      action: () => this.OnSettings()
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private expertService:ExpertService
  ) {
    this.checkScreenSize();
  }

upcomingServices: number = 1;
todayServices: number = 0;
loadSidebarStats(): void {
  this.expertService.getAllServices().subscribe({
    next: (services) => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // yyyy-MM-dd pour comparaison simplifiée

      this.upcomingServices = 0;
      this.todayServices = 0;

      services.forEach((service: any) => {
        if (!service.date) return;

        // Convertir la date au format dd-MM-yyyy
        const [day, month, year] = service.date.split("-").map(Number);
        const serviceDate = new Date(year, month - 1, day);

        // Comparaison simple
        if (serviceDate > today) {
          this.upcomingServices++;
        } else if (
          serviceDate.getDate() === today.getDate() &&
          serviceDate.getMonth() === today.getMonth() &&
          serviceDate.getFullYear() === today.getFullYear()
        ) {
          this.todayServices++;
        }
      });
    },
    error: (err) => {
      console.error("Erreur lors du chargement des stats sidebar :", err);
    }
  });
}

  ngOnInit(): void {
    this.isCollapsed = this.collapsedByDefault || this.isMobile;
    
    // Écouter les changements de route
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateActiveStates();
    });

    // Initialiser l'état actif
    this.updateActiveStates();
    this.loadSidebarStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Auto-collapse sur mobile
    if (this.isMobile && !wasMobile) {
      this.isCollapsed = true;
      this.sidebarToggle.emit(this.isCollapsed);
    }
    
    // Auto-expand sur desktop si c'était mobile
    if (!this.isMobile && wasMobile && !this.collapsedByDefault) {
      this.isCollapsed = false;
      this.sidebarToggle.emit(this.isCollapsed);
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
   * Gestion du hover sur la sidebar
   */
  onSidebarMouseEnter(): void {
    if (this.isCollapsed && !this.isMobile) {
      this.isHovered = true;
    }
  }

  onSidebarMouseLeave(): void {
    this.isHovered = false;
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
   * Mettre à jour les états actifs
   */
  private updateActiveStates(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute.startsWith(item.route);
    });
  }

  /**
   * Navigation vers un item
   */
  navigateToItem(item: NavItem): void {
    this.navigateWithLoading(item.route);
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
   * Déconnexion avec confirmation moderne
   */
  Ondeconnexion(): void {
    // Utiliser une modal personnalisée au lieu de confirm()
    if (this.showLogoutConfirmation()) {
      try {
        this.authService.logout();
        this.router.navigateByUrl('/login').then(() => {
          // Optionnel : toast de succès
        }).catch(error => {
          console.error('Erreur lors de la redirection après déconnexion:', error);
        });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
  }

  /**
   * Afficher la confirmation de déconnexion (remplacer par une modal)
   */
  private showLogoutConfirmation(): boolean {
    return confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
  }

  /**
   * Vérifier si une route est active
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  /**
   * Obtenir le titre de la page courante
   */
  getCurrentPageTitle(): string {
    const activeItem = this.navItems.find(item => item.isActive);
    return activeItem ? activeItem.label : 'Expert Panel';
  }

  /**
   * Vérifier si la sidebar doit être étendue (hover ou pas collapsed)
   */
  shouldShowExpanded(): boolean {
    return !this.isCollapsed || (this.isCollapsed && this.isHovered && !this.isMobile);
  }

  /**
   * TrackBy functions pour optimiser les performances
   */
  trackByNavItem(index: number, item: NavItem): string {
    return item.id;
  }

  trackByAction(index: number, action: any): string {
    return action.id;
  }
}
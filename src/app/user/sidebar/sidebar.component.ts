import { Component, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
export class SidebarComponent implements OnInit, OnDestroy {
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
      route: '/main-user/user-dashboard'
    },
    {
      id: 'souscriptions',
      label: 'Souscriptions',
      icon: 'fa-regular fa-clock',
      route: '/main-user/user-souscriptions',
    },

        {
      id: 'Aganda',
      label: 'Agenda',
      icon: 'fas fa-bell',
      route: '/main-user/user-calendar'
    },

    {
      id: 'notification',
      label: 'Notification',
      icon: 'fas fa-bell',
      route: '/main-user/user-notification'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'fas fa-cog',
      route: '/main-user/user-settings'
    },
  ];



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
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateActiveStates();
    });

    // Initialiser l'état actif
    this.updateActiveStates();
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
   * Navigation vers le dashboard user
   */
  onUserdashboard(): void {
    this.navigateWithLoading('/user-dashboard');
  }

  /**
   * Navigation vers les souscription user
   */
  onUserSouscription(): void {
    this.navigateWithLoading('/user-souscription');
  }


  /**
   * Navigation vers les paramètres
   */
  OnSettings(): void {
    this.navigateWithLoading('/user-settings');
  }

  /**
   * Navigation vers notification user
   */
  onUserNotification(): void {
    this.navigateWithLoading('/user-historique');
  }

  /**
   * Déconnexion avec confirmation moderne
   */
  Ondeconnexion(): void {
    // Utiliser une modal personnalisée au lieu de confirm()
    if (this.showLogoutConfirmation()) {
      try {
        this.authService.logout();
        this.router.navigateByUrl('/service-list').then(() => {
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
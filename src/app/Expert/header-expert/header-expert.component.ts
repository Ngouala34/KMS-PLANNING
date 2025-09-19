// header-expert.component.ts
import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpertService } from 'src/app/services/expert/expert.service';
import { IExpertNotifications } from 'src/app/Interfaces/iexpert';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-header-expert',
  templateUrl: './header-expert.component.html',
  styleUrls: ['./header-expert.component.scss'],
  animations: [
    trigger('slideDown', [
      state('hidden', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('hidden <=> visible', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('mobileMenu', [
      state('closed', style({
        transform: 'translateY(-100%)',
        opacity: 0,
        visibility: 'hidden'
      })),
      state('open', style({
        transform: 'translateY(0)',
        opacity: 1,
        visibility: 'visible'
      })),
      transition('closed <=> open', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('toggleIcon', [
      state('menu', style({
        transform: 'rotate(0deg)'
      })),
      state('close', style({
        transform: 'rotate(180deg)'
      })),
      transition('menu <=> close', animate('300ms ease-in-out'))
    ])
  ]
})
export class HeaderExpertComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private lastScrollTop = 0;

  // Propriétés du composant
  @Input() showSearch: boolean = true;
  @Input() userName: string = 'Admin';
  @Input() userRole: string = 'Expert';
  @Input() userAvatar?: string;
  @Input() notificationCount: number = 0;

  // États du menu
  mobileMenuOpen = false;
  navbarVisible = true;
  searchQuery = '';
  isSearchFocused = false;

  // Menu items
  menuItems: MenuItem[] = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/expert/dashboard', active: true },
    { icon: 'fas fa-concierge-bell', label: 'Services', route: '/expert/services' },
    { icon: 'fas fa-history', label: 'Historique', route: '/expert/historique' },
    { icon: 'fas fa-calendar', label: 'Calendrier', route: '/expert/calendrier' },
    { icon: 'fas fa-cog', label: 'Paramètres', route: '/expert/settings' },
    { icon: 'fas fa-sign-out-alt', label: 'Déconnexion', route: '/logout' }
  ];

  constructor(private router: Router, private expertService: ExpertService) { }

  ngOnInit(): void {
    this.updateActiveMenuItem();
    this.getNotificationNumber();

    // Écoute les changements de route pour mettre à jour l'élément actif
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateActiveMenuItem();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Écouter le scroll pour masquer/afficher la navbar
   */


  /**
   * Fermer le menu mobile lors du clic à l'extérieur
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu && 
        !mobileToggle.contains(target) && 
        !mobileMenu.contains(target)) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Écouter les changements de taille d'écran
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Toggle du menu mobile
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Gestion de la recherche
   */
  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    this.isSearchFocused = false;
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
      this.mobileMenuOpen = false;
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchSubmit();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  /**
   * Navigation methods
   */
  navigateToItem(item: MenuItem): void {
    if (item.route === '/logout') {
      this.onLogout();
    } else {
      this.router.navigateByUrl(item.route);
      this.updateActiveMenuItem();
    }
    this.mobileMenuOpen = false;
  }

  onDashboard(): void {
    this.router.navigateByUrl('/expert/dashboard');
    this.updateActiveMenuItem();
  }

  onServices(): void {
    this.router.navigateByUrl('/expert/services');
    this.updateActiveMenuItem();
  }

  onHistorique(): void {
    this.router.navigateByUrl('/expert/historique');
    this.updateActiveMenuItem();
  }

  onCalendrier(): void {
    this.router.navigateByUrl('/expert/calendrier');
    this.updateActiveMenuItem();
  }

  onSettings(): void {
    this.router.navigateByUrl('/expert/settings');
    this.updateActiveMenuItem();
  }

  onNotifications(): void {
    this.router.navigateByUrl('/expert/notifications');
  }

  onProfile(): void {
    this.router.navigateByUrl('/expert/profile');
  }

  onLogout(): void {
    // Ajouter ici la logique de déconnexion (clear tokens, etc.)
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  /**
   * Mettre à jour l'élément de menu actif
   */
  private updateActiveMenuItem(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = currentRoute.startsWith(item.route) && item.route !== '/logout';
    });
  }

  /**
   * Obtenir les initiales de l'utilisateur
   */
  getUserInitials(): string {
    if (!this.userName) return 'U';
    
    const names = this.userName.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }

  /**
   * Vérifier si on a des notifications
   */
  hasNotifications(): boolean {
    return this.notificationCount > 0;
  }

  /**
   * Formater le nombre de notifications
   */
  getNotificationNumber(): void {
    this.expertService.getExpertNotifications().subscribe({
      next: (response: IExpertNotifications) => {
        // ⚡ si ton backend renvoie { count: number, results: [...] }
        this.notificationCount = response.id ?? response.message?.length ?? 0;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notifications', err);
        this.notificationCount = 0;
      }
    });
  }

  /**
   * TrackBy pour optimiser ngFor
   */
  trackByMenuItem(index: number, item: MenuItem): string {
    return item.route;
  }
}
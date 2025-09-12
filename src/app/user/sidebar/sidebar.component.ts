import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface SidebarItem {
  title: string;
  icon: string;
  route: string;
  color: string;
  action?: () => void;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsedByDefault = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobile = false;

  sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: 'fa-chart-bar',
      route: '/user-dashboard',
      color: '#e67e22',
      action: () => this.OnUserdashboard()
    },
    {
      title: 'Souscriptions',
      icon: 'fa-clock',
      route: '/user-souscriptions',
      color: '#8e44ad',
      action: () => this.OnUserSouscription()
    },
    {
      title: 'Mes Favoris',
      icon: 'fa-heart',
      route: '/user-serv',
      color: '#2980b9',
      action: () => this.OnUserService()
    },
    {
      title: 'Calendrier',
      icon: 'fa-calendar',
      route: '/user-calendrier',
      color: '#27ae60',
      action: () => this.OnUserCalendrier()
    },
    {
      title: 'Paramètres',
      icon: 'fa-user',
      route: '/user-parameter',
      color: '#d35400',
      action: () => this.OnUserParameter()
    },
    {
      title: 'Déconnexion',
      icon: 'fa-sign-out-alt',
      route: '/',
      color: '#c0392b',
      action: () => this.Ondeconnexion()
    }
  ];

  constructor(private router: Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.isCollapsed = this.collapsedByDefault;
    this.checkMobileView();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
  }

  private checkMobileView() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      // Sur mobile, on pourrait avoir un overlay ou autre comportement
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  onItemClick(item: SidebarItem, event: Event) {
    event.preventDefault();
    if (item.action) {
      item.action();
    }
  }

  // Méthodes de navigation
  OnUserdashboard(): void {
    this.router.navigateByUrl('user-dashboard');
  }

  OnUserService(): void {
    this.router.navigateByUrl('user-serv');
  }

  OnUserSouscription(): void {
    this.router.navigateByUrl('user-souscriptions');
  }

  OnUserCalendrier(): void {
    this.router.navigateByUrl('user-calendrier');
  }

  Ondeconnexion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  OnUserParameter(): void {
    this.router.navigateByUrl('user-parameter');
  }
}
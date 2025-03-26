import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  toggleMenuVisible = false;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  // Clic sur le bouton pour ouvrir/fermer le menu
  toggleMenu() {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }

  // Fermer le menu si l'on clique en dehors du menu mobile
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.mobile-menu, .toggle-menu');
    if (!clickedInside) {
      this.toggleMenuVisible = false;
    }
  }

  // Méthodes de navigation
  OnUserConnexion(): void {
    this.router.navigateByUrl('user-home');
  }

  OnUserService(): void {
    this.router.navigateByUrl('user-serv');
  }

  OnUserdashboard(): void {
    this.router.navigateByUrl('user-dashboard');
  }

  OnUserprofile(): void {
    this.router.navigateByUrl('user-profile');
  }

  OnUserHistorique(): void {
    this.router.navigateByUrl('user-historique');
  }

  OnUserCalendrier(): void {
    this.router.navigateByUrl('user-calendrier');
  }

  OnUserDeconnexion(): void {
    this.router.navigateByUrl('');
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {

  services: any[] = [];
  showServices = false; 
  toggleMenuVisible= false;
  isSticky: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.services = [
        { source:"https://i.pinimg.com/474x/4f/0b/43/4f0b439aedbc7ab60228488f32c3c965.jpg", nom: 'Consultation Médicale ', expert: 'Dr.Ngouffo Aline',  note: 4.8 },
        { source:"https://i.pinimg.com/474x/db/67/f0/db67f009d50c76bf87606520384eb1ab.jpg", nom: 'Cours Mathématiques', expert: 'Prof. Atangana ',  note: 4.7 },
        { source:"https://i.pinimg.com/474x/52/a2/99/52a2996379f04d614002c5efd87f35c1.jpg", nom: 'Coaching en Finances', expert: 'M. Kemkeu Albert',  note: 4.9 },
        { source:"https://i.pinimg.com/736x/42/44/d2/4244d20b813d9ec43747d9ab8af6ac16.jpg", nom: 'Dev Angular 18', expert: 'M. Ngoualadjo', note: 4 },
      ];
      this.showServices = true; // Active l’animation
    }, 500);
  }
  


  // Méthode pour basculer la visibilité du menu


  // Méthode qui est appelée lorsque l'utilisateur clique n'importe où en dehors du menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menu = document.querySelector('.mobile-menu');
    const toggleButton = document.querySelector('.toggle-menu');

    // Si le clic est en dehors du bouton du menu ou du menu lui-même, fermer le menu
    if (this.toggleMenuVisible && menu && toggleButton &&
        !menu.contains(event.target as Node) && !toggleButton.contains(event.target as Node)) {
      this.toggleMenuVisible = false;
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isSticky = scrollY > 0;
  }



  onContinue(): void {
    this.router.navigateByUrl('dashboard-expert');
  }
  OnConnexion(): void {
    this.router.navigateByUrl('login');
  }
  OnInscription(): void {
    this.router.navigateByUrl('choose-function-page');
  }
  Onuser(): void {
    this.router.navigateByUrl('user-home')// Redirige vers la page de paiement
  }
  toggleMenu() {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }
  onService(): void{
    this.router.navigateByUrl('service-list')
  }


}

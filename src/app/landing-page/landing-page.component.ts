import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  services: any[] = [];
  showServices = false; 

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.services = [
        { source:"https://i.pinimg.com/474x/4f/0b/43/4f0b439aedbc7ab60228488f32c3c965.jpg", nom: 'Consultation Médicale', expert: 'Dr.Ngouffo Aline', prix: 10000, note: 4.8 },
        { source:"https://i.pinimg.com/474x/db/67/f0/db67f009d50c76bf87606520384eb1ab.jpg", nom: 'Cours de Mathématiques', expert: 'Prof. Atangana luther', prix: 20000, note: 4.7 },
        { source:"https://i.pinimg.com/474x/52/a2/99/52a2996379f04d614002c5efd87f35c1.jpg", nom: 'Coaching en Finances', expert: 'M. Kemkeu Albert', prix: 30000, note: 4.9 },
        { source:"https://i.pinimg.com/736x/42/44/d2/4244d20b813d9ec43747d9ab8af6ac16.jpg", nom: 'Developpement Angular', expert: 'M. Ngoualadjo junior', prix: 25000, note: 4 },
      ];
      this.showServices = true; // Active l’animation
    }, 500);
  }

  onContinue(): void {
    this.router.navigateByUrl('facesnaps');
  }
  OnConnexion(): void {
    this.router.navigateByUrl('login');
  }
  OnInscription(): void {
    this.router.navigateByUrl('choose-function-page');
  }
  OnPayment(): void {
    this.router.navigateByUrl('payment')// Redirige vers la page de paiement
  }
}

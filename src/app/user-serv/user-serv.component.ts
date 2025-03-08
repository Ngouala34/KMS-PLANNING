import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-serv',
  templateUrl: './user-serv.component.html',
  styleUrls: ['./user-serv.component.scss']
})
export class UserServComponent implements OnInit {

  isSidebarCollapsed = false;

  services: any[] = [];
  showServices = false; // Contrôle l'animation d'affichage

  constructor(private router:Router) { }

  ngOnInit(): void {
    // Simule un chargement des services avec un léger délai
    setTimeout(() => {
      this.services = [
        { nom: 'Consultation Médicale', expert: 'Dr.Ngouffo Aline', prix: 10000, note: 4.8 },
        { nom: 'Cours de Mathématiques', expert: 'Prof. Atangana luther', prix: 20000, note: 4.7 },
        { nom: 'Coaching en Finances', expert: 'M. Kemkeu Albert', prix: 30000, note: 4.9 },
        { nom: 'Developpement Angular', expert: 'M. Ngoualadjo junior', prix: 25000, note: 4 },
        { nom: 'Analyse de Données', expert: 'Mme. Moukodi jeanne', prix: 18000, note: 4.2 },
        { nom: ' Developpement Personnel', expert: 'M. buthal roger', prix: 15000, note: 4.9 }
      ];
      this.showServices = true; // Active l’animation
    }, 500);
  }
  OnPayment(): void {
    this.router.navigateByUrl('payment')// Redirige vers la page de paiement
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  newsletterEmail: string = '';
  newsletterMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  subscribeNewsletter() {
    // Ici vous pourriez implémenter la logique d'abonnement
    // Par exemple, appeler un service API
    this.newsletterMessage = 'Merci pour votre abonnement!';
    this.newsletterEmail = '';
    
    // Réinitialiser le message après 5 secondes
    setTimeout(() => {
      this.newsletterMessage = '';
    }, 5000);
  }
}
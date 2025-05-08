import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expert-formation',
  templateUrl: './expert-formation.component.html',
  styleUrls: ['./expert-formation.component.scss']
})
export class ExpertFormationComponent implements OnInit {
  isSidebarCollapsed = false; // État de la sidebar
  collapsedByDefault = true; // Indique si la sidebar est réduite au départ
  notify = false; // État de la notification
  count= 0; // Compteur de notifications

  constructor() { }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault;
  }

  onsendclick() {
    this.count++;
    this.notify = true;
    setTimeout(() => {
      this.notify = false;
    }, 300); // Masquer la notification après 3 secondes
  }
  service = {
    imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
    expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
    expertName: 'Rehan',
    title: ' Développement WordPress',
    description: 'Je suis un développeur WordPress et j\'aime créer des sites Web WordPress personnalisés et réactifs.',
    avarage: 4.2,
    ratingCount: 120,
    souscriptions : 24,
    price: 80,
    date: '12/02/202',
  };
  
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-popup-experts',
  templateUrl: './popup-experts.component.html',
  styleUrls: ['./popup-experts.component.scss'],
})
export class PopupExpertsComponent {
  isOpen = false; // État du pop-up

  experts = [
    { nom: 'Dr. Pierre Dupont', specialite: 'Médecine',note:5, photo:"assets/images/user1.jpg" },
    { nom: 'Marie Curie', specialite: 'Science',note:4.8 , photo:"assets/images/user1.jpg"},
    { nom: 'Jean Leblanc', specialite: 'Finance',note:4.7, photo:"assets/images/user1.jpg" },
    { nom: 'Lucie Bernard', specialite: 'Psychologie',note:4.3 , photo:"assets/images/user1.jpg"},
    { nom: 'Alexandre Moreau', specialite: 'Marketing',note:4 , photo:"assets/images/user1.jpg"},
  ];

  ouvrirPopup(): void {
    this.isOpen = true;
  }

  fermerPopup(): void {
    this.isOpen = false;
  }
}

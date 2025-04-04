import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  faqs = [
    { question: 'Comment puis-je m\'inscrire ?', answer: 'Cliquez sur "S\'inscrire" en haut à droite de la page...', showAnswer: false },
    { question: 'Comment réserver un service ?', answer: 'Allez dans la section "Services" et sélectionnez le service souhaité...', showAnswer: false },
    { question: 'Quels sont les modes de paiement disponibles ?', answer: 'Nous acceptons les paiements via Flutterwave, PayPal, et cartes bancaires.', showAnswer: false },
    // Ajouter d'autres questions et réponses ici
  ];

  toggleAnswer(faq: any) {
    faq.showAnswer = !faq.showAnswer;
  }
}

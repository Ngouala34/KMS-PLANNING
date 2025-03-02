import { Component } from '@angular/core';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
onPaymentClick() {
throw new Error('Method not implemented.');
}
  paymentData = {
    tx_ref: 'TX-' + Math.floor(Math.random() * 1000000), // Référence unique
    amount: 0, // Montant saisi par l'utilisateur
    currency: 'XAF', // Devise (CFA pour le Cameroun)
    customer: {
      email: 'client@email.com',
      phone_number: '670000000',
      name: 'Client Test'
    },
    customizations: {
      title: 'Paiement de réservation',
      description: 'Paiement de votre rendez-vous en ligne',
      logo: 'https://your-logo-url.com/logo.png' // Ajoutez le logo de votre appli
    }
  };

  constructor(private paymentService: PaymentService) {}

  makePayment() {
    if (this.paymentData.amount <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    this.paymentService.initiatePayment(this.paymentData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          window.location.href = response.data.link; // Redirige vers la page de paiement Flutterwave
        } else {
          alert('Erreur lors du paiement.');
        }
      },
      error => {
        console.error('Erreur de paiement', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    );
  }
}

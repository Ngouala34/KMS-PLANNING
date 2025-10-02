import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-payment-verify',
  template: `
    <div *ngIf="loading">Vérification du paiement...</div>
    <div *ngIf="success" class="success">Paiement réussi !</div>
    <div *ngIf="error" class="error">Erreur de paiement : {{ error }}</div>
  `,
  styles: [`
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
  `]
})
export class PaymentVerifyComponent implements OnInit {
  loading = true;
  success = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tx_ref = params['tx_ref'];
      const status = params['status'];

      if (!tx_ref || status !== 'successful') {
        this.error = 'Transaction invalide ou annulée';
        this.loading = false;
        return;
      }

      this.verifyPayment(tx_ref);
    });
  }

  verifyPayment(tx_ref: string) {
    this.userService.verifyPayment().subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;

        // Optionnel : redirection automatique vers dashboard après 3 secondes
        setTimeout(() => this.router.navigate(['/main-user/user-dashboard']), 3000);
      },
      error: (err) => {
        this.error = 'Impossible de vérifier le paiement. Réessayez plus tard.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}

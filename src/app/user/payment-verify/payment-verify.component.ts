import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-payment-verify',
  templateUrl: './payment-verify.component.html',
  styleUrls: ['./payment-verify.component.scss']
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
    // Récupération des paramètres tx_ref et status de Flutterwave
    this.route.queryParams.subscribe(params => {
      const tx_ref = params['tx_ref'];
      const status = params['status'];

      if (!tx_ref || status !== 'successful') {
        this.error = 'Transaction invalide ou annulée';
        this.loading = false;
        return;
      }

      // Appel du service pour vérifier le paiement côté backend
      this.verifyPayment();
    });
  }

  private verifyPayment() {
    this.userService.verifyPayment().subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;

        // Redirection automatique vers le dashboard après 3 secondes
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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-historique',
  templateUrl: './user-historique.component.html',
  styleUrls: ['./user-historique.component.scss']
})

  export class UserHistoriqueComponent implements AfterViewInit {

    isSidebarCollapsed = false;
    ngAfterViewInit() {
      this.createPaymentsByMonthChart();
      this.createPaymentMethodsChart();
    }
  
    createPaymentsByMonthChart() {
      new Chart("paymentsByMonth", {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Montant des paiements (XAF)',
            data: [20000, 35000, 15000, 50000, 30000, 40000],
            backgroundColor: '#74C0FC',
          }]
        }
      });
    }
  
    createPaymentMethodsChart() {
      new Chart("paymentMethods", {
        type: 'pie',
        data: {
          labels: ['Carte Bancaire', 'Mobile Money', 'PayPal'],
          datasets: [{
            label: 'Répartition des paiements',
            data: [45, 30, 25],
            backgroundColor: ['#74C0FC', '#0e0f49', '#FFA500']
          }]
        }
      });
    }
}

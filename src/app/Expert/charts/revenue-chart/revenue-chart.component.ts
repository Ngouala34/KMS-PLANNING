import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnInit {
  // Options pour le graphique linéaire
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Évolution des revenus',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString()} fcfa`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${value.toLocaleString()} fcfa`
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;

   getPeriodLabel(period: string): string {
    const labels: { [key: string]: string } = {
      'jour': 'Par jour',
      'mois': 'Par mois',
      'annee': 'Par année'
    };
    return labels[period] || period;
  }

  // Données pour le graphique linéaire
  public lineChartData: ChartConfiguration['data'] = {
    labels: ['lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    datasets: [
      {
        data: [1200000, 950000, 1400000, 1100000, 1750000, 1300000, 2000000],
        label: 'Revenus totaux',
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.3,
        fill: true
        
      },
     
    ]
  };





  // Sélecteur de période
  public selectedPeriod: string = 'jour';

  constructor() { }

  ngOnInit(): void {
    // Ici tu pourrais faire un appel API pour récupérer les vraies données
  }

  updateChartData(period: string): void {
    this.selectedPeriod = period;
    
    // Créer un nouvel objet pour forcer la détection de changement
    const newData: ChartConfiguration['data'] = { ...this.lineChartData };
    
    if (period === 'mois') {
      newData.labels = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
      newData.datasets = [
        {
          ...newData.datasets[0],
          data: [3500000, 4200000, 3800000, 4500000, 5000000, 4800000, 5200000, 6000000, 5500000, 6200000, 7000000, 8000000]
        }
      ];
    }
    else if (period === 'annee') {
      newData.labels = ['2021', '2022', '2023', '2024', '2025'];
      newData.datasets = [
        {
          ...newData.datasets[0],
          data: [5000000, 45000000, 40000000, 55000000, 35000000]
        }
      ];
    } else {
      newData.labels = ['lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      newData.datasets = [
        {
          ...newData.datasets[0],
          data: [1200000, 950000, 1400000, 1100000, 1750000, 1300000, 2000000]
        }
      ];
    }
    
    this.lineChartData = newData;
  }
}
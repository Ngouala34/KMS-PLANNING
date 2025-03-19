import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent {
  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1200, 1500, 1800, 2000, 2300, 2500], // Revenus générés par mois
        label: 'Revenus',
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4bc0c0',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4bc0c0',
        cubicInterpolationMode: 'monotone', // Lissage des lignes pour un effet moderne
      }
    ]
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
    datasets: [
      {
        data: [4.5, 3.8, 4.0, 4.7], // Évaluations des services
        label: 'Évaluations',
        backgroundColor: '#74C0FC',
        borderColor: '#4bc0c0',
        borderWidth: 1,
        hoverBackgroundColor: '#3498db',
        hoverBorderColor: '#2980b9',
        borderRadius: 8,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      }
    ]
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Objectif Atteint', 'Objectif Restant'],
    datasets: [
      {
        data: [80, 20], // Objectif atteint vs restant en pourcentage
        backgroundColor: ['#28a745', '#e74c3c'],
        hoverBackgroundColor: ['#2ecc71', '#c0392b'],
        borderWidth: 0,
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: {
            size: 14,
            weight: 'bold',
            family: 'Arial'
          }
        }
      },
      y: {
        min: 0,
        max: 3000,
        title: {
          display: true,
          text: 'Montant en xaf',
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      }
    }
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Services',
          font: {
            size: 14,
          }
        }
      },
      y: {
        min: 0,
        max: 5,
        title: {
          display: true,
          text: 'Évaluation',
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    }
  };

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `Atteint: ${value}%`;
          }
        }
      }
    }
  };
}

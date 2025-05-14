import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnInit {


  constructor() {     this.lineChartData = {
      labels: [],
      datasets: []
    };}
  // Options pour le graphique
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString('fr-FR')} FCFA`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${Number(value).toLocaleString('fr-FR')} FCFA`
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';
  public lineChartLegend = false;
  public lineChartData: ChartConfiguration['data'];

  // Données dynamiques
  public periodOptions = [
    { value: 'day', label: 'Journalier' },
    { value: 'week', label: 'Hebdomadaire' },
    { value: 'month', label: 'Mensuel' },
    { value: 'year', label: 'Annuel' }
  ];

  public selectedPeriod = 'week';
  public currentRevenue = 24500000;
  public revenueChange = 8.5;

  public kpis = [
    {
      title: 'Revenu Mensuel',
      value: 450000,
      type: 'currency',
      trend: 8.5,
      icon: 'fas fa-wallet',
      color: '#4361ee',
      tooltip: '+8.5% vs mois dernier',
      highlight: true
    },
    {
      title: 'Souscriptions',
      value: 248,
      type: 'number',
      trend: -2.3,
      icon: 'fas fa-users',
      color: '#f72585',
      tooltip: '-2.3% vs trimestre dernier'
    },
    {
      title: 'Revenu Moyen',
      value: 24500,
      type: 'currency',
      trend: 12.1,
      icon: 'fas fa-chart-line',
      color: '#4cc9f0',
      tooltip: '+12.1% vs 2024'
    },
    {
      title: 'Rendez-vous',
      value: 153,
      type: 'number',
      trend: 6.2,
      icon: 'fas fa-calendar-check',
      color: '#f8961e',
      tooltip: '+6.2% vs mois dernier'
    },
    {
      title: 'Satisfaction',
      value: 4.7,
      type: 'rating',
      trend: 0.2,
      icon: 'fas fa-star',
      color: '#4895ef',
      tooltip: '+0.2 depuis la semaine dernière'
    },
    {
      title: 'Revenu Cumulé',
      value: 85000000,
      type: 'currency',
      trend: 0,
      icon: 'fas fa-chart-pie',
      color: '#3f37c9',
      tooltip: 'Total depuis le début'
    }
  ];

  ngOnInit(): void {
    this.updateChartData(this.selectedPeriod);
  }

  updateChartData(period: string): void {
    this.selectedPeriod = period;
    
    // Simuler des données différentes selon la période
    const sampleData = {
      day: Array.from({length: 7}, () => Math.floor(Math.random() * 2000000) + 500000),
      week: Array.from({length: 4}, () => Math.floor(Math.random() * 8000000) + 2000000),
      month: Array.from({length: 12}, () => Math.floor(Math.random() * 10000000) + 3000000),
      year: Array.from({length: 5}, (_, i) => (i + 1) * 10000000)
    };

    const labels = {
      day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      week: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      year: ['2020', '2021', '2022', '2023', '2024']
    };

    this.lineChartData = {
      labels: labels[period as keyof typeof labels],
      datasets: [{
        data: sampleData[period as keyof typeof sampleData],
        borderColor: '#4361ee',
        backgroundColor: '#74c1fc76',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4361ee',
        pointHoverRadius: 1,
        borderWidth: 1
      }]
    };

    // Mettre à jour les indicateurs
    this.currentRevenue = sampleData[period as keyof typeof sampleData].reduce((a, b) => a + b, 0);
    this.revenueChange = period === 'day' ? 8.5 : period === 'week' ? 5.2 : period === 'month' ? 12.1 : 18.4;
  }
}
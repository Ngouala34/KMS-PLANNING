// prochain-rendez-vous.component.ts
import { Component, OnInit } from '@angular/core';

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
}

@Component({
  selector: 'app-prochain-rendez-vous',
  templateUrl: './prochain-rendez-vous.component.html',
  styleUrls: ['./prochain-rendez-vous.component.scss']
})
export class ProchainRendezVousComponent implements OnInit {
  // Données de démonstration
  sampleAppointments: Appointment[] = [
    {
      id: '1',
      clientName: 'Gestion financiere',
      date: '2023-12-15',
      startTime: '10:00',
      endTime: '11:00',
      status: 'confirmed',
      clientEmail: 'marie.dupont@example.com',
      clientPhone: '06 12 34 56 78',
      notes: 'Première consultation'
    },
    {
      id: '2',
      clientName: 'Jean Martin',
      date: '2023-12-16',
      startTime: '14:30',
      endTime: '15:30',
      status: 'pending',
      clientPhone: '07 89 12 34 56'
    },
    {
      id: '3',
      clientName: 'Sophie Lambert',
      date: '2023-12-17',
      startTime: '09:00',
      endTime: '10:00',
      status: 'cancelled',
      notes: 'Reporté à janvier'
    }
  ];

  appointment: Appointment | null = this.sampleAppointments[0]; // Premier RDV pour la démo
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Simule un chargement API
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Méthodes restantes inchangées...
  startVideoCall(): void {
    console.log('Démarrage appel vidéo', this.appointment?.id);
    alert(`Démarrage de l'appel avec ${this.appointment?.clientName}`);
  }

  cancelAppointment(): void {
    if (confirm('Annuler ce rendez-vous ?')) {
      this.appointment = null;
    }
  }

  // Fonctions utilitaires inchangées...
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'confirmed': return 'fa-circle-check';
      case 'pending': return 'fa-clock';
      case 'cancelled': return 'fa-ban';
      default: return 'fa-circle-info';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  // Nouvelle méthode pour changer de RDV dans la démo
  switchAppointment(index: number): void {
    this.appointment = this.sampleAppointments[index];
  }
}
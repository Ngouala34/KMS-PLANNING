import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

interface Service {
  id: string;
  title: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  nbreSouscriptions: number;
  platform: 'zoom' | 'google-meet';
  link: string;
  description: string;
}

@Component({
  selector: 'app-expert-rendez-vous',
  templateUrl: './expert-rendez-vous.component.html',
  styleUrls: ['./expert-rendez-vous.component.scss']
})
export class ExpertRendezVousComponent implements OnInit {
  isSidebarCollapsed = true; // État de la sidebar
  collapsedByDefault = false; // Indique si la sidebar est réduite au départ
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    contentHeight: 'auto',
    aspectRatio: 1.2,
    selectable: true,
    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    eventClick: (info) => this.handleEventClick(info)
  };

  // Ajoutez ces propriétés à votre composant
isDescriptionExpanded: boolean = false;
descriptionMaxLength: number = 150; // Ajustez selon vos besoins

// Méthode pour basculer l'état
toggleDescription() {
  this.isDescriptionExpanded = !this.isDescriptionExpanded;
}

// Méthode pour déterminer le texte à afficher
getDisplayDescription(description: string): string {
  if (!description) return '';
  return this.isDescriptionExpanded || description.length <= this.descriptionMaxLength 
    ? description 
    : description.slice(0, this.descriptionMaxLength) + '...';
}

  services: Service[] = [];
  selectedService: Service | null = null;
  selectedDate: Date | null = null;

  ngOnInit(): void {
    this.isSidebarCollapsed =  this.collapsedByDefault ; // Appliquer la configuration initiale
    this.loadServices();
  }

  private loadServices(): void {
    // Remplacer par un appel API réel
    this.services = [
      {
        id: '1',
        title: 'Consultation Marketing Digital',
        date: new Date().toISOString().split('T')[0], // Aujourd'hui
        heureDebut: '14:00',
        heureFin: '16:00',
        nbreSouscriptions: 27,
        platform: 'zoom',
        link: 'https://zoom.us/j/123456789',
        description: 'Session de consultation pour améliorer votre stratégie marketing digitale consultation pour améliorer votre stratégie marketing digitaleconsultation pour améliorer votre stratégie marketing digitaleconsultation pour améliorer votre stratégie marketing digitaleconsultation pour améliorer votre stratégie marketing digitaleconsultation pour améliorer votre stratégie marketing digitale.'
      },
      // Ajouter d'autres services...
    ];

    this.calendarOptions.events = this.services.map(service => ({
      id: service.id,
      title: service.title,
      start: service.date,
      color: '#3a86ff',
      extendedProps: {
        ...service
      }
    }));

    // Afficher automatiquement les services du jour
    this.showTodaysServices();
  }

  private showTodaysServices(): void {
    const today = new Date().toISOString().split('T')[0];
    const todaysServices = this.services.filter(s => s.date === today);
    
    if (todaysServices.length > 0) {
      this.selectedService = todaysServices[0];
    } else {
      this.selectedDate = new Date();
    }
  }

  handleDateClick(arg: DateClickArg): void {
    const clickedDate = arg.dateStr;
    this.selectedDate = new Date(clickedDate);
    
    const servicesForDate = this.services.filter(s => s.date === clickedDate);
    this.selectedService = servicesForDate.length > 0 ? servicesForDate[0] : null;
  }

  handleEventClick(info: EventClickArg): void {
    const serviceId = info.event.id;
    this.selectedService = this.services.find(s => s.id === serviceId) || null;
    this.selectedDate = new Date(info.event.startStr);
  }
}
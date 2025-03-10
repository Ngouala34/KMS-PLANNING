import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-user-calendrier',
  templateUrl: './user-calendrier.component.html',
  styleUrls: ['./user-calendrier.component.scss']
})
export class UserCalendrierComponent implements OnInit {
  isSidebarCollapsed = false;
  selectedEvent: any = null; // Stocke l'événement sélectionné

  // Liste des événements (exemple, à récupérer depuis le backend)
  events = [
    { title: 'Formation Web', date: '2025-03-15', expert: 'Ngouala jun', heure: '14h00', couleur: '#74C0FC', link: 'https://zoom.us/j/123456789' },
    { title: 'Séance de coaching', date: '2025-03-16', expert: 'Moussou', heure: '09h00', couleur: '#74C0FC', link: 'https://zoom.us/j/123456789' },
    { title: 'Marketing Digital', date: '2025-03-18', expert: 'Saah rode', heure: '10h00', couleur: '#74C0FC',link: 'https://zoom.us/j/123456789' },
  ];

  // Configuration du calendrier
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    height: 'auto', // Rend le calendrier plus compact
    contentHeight: 400, // Réduit la hauteur du calendrier
    aspectRatio: 1.5, // Ajuste le rapport largeur/hauteur
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek' // Ajoute la vue semaine pour plus de visibilité
    },
    events: this.events.map(event => ({
      title: event.title,
      start: event.date,
      color: event.couleur
    })),
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor() {}

  ngOnInit(): void {}

  // Gérer le clic sur une date (sans événement)
  handleDateClick(info: any) {
    this.selectedEvent = null;
  }

  // Gérer le clic sur un événement
  handleEventClick(info: any) {
    const event = this.events.find(e => e.title === info.event.title && e.date === info.event.startStr);
    this.selectedEvent = event ? event : null;
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
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
  selectedEvent: any = null;
  filterStatus: string = 'all'; // Valeur par défaut (tous les événements)

  today = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD

  events = [
    { title: 'Formation Web', date: '2025-03-15', expert: 'Ngouala Jun', heure: '14h00', couleur: '', link: 'https://zoom.us/j/123456789' },
    { title: 'Séance de coaching', date: '2025-03-16', expert: 'Moussou', heure: '09h00', couleur: '', link: 'https://zoom.us/j/123456789' },
    { title: 'Marketing Digital', date: '2025-03-18', expert: 'Saah Rode', heure: '10h00', couleur: '', link: 'https://zoom.us/j/123456789' },
    { title: 'Marketing Digital', date: '2025-04-2', expert: 'Saah Rode', heure: '10h00', couleur: '', link: 'https://zoom.us/j/123456789' },

  ];

  // Définir la couleur des événements selon leur état
  getFilteredEvents() {
    return this.events
      .map(event => {
        const eventDate = new Date(event.date);
        const todayDate = new Date(this.today);

        if (eventDate < todayDate) {
          event.couleur = '#ff4d4d'; // Rouge pour événements passés
        } else if (eventDate.toDateString() === todayDate.toDateString()) {
          event.couleur = '#FFA500'; // Orange pour événements en cours
        } else {
          event.couleur = '#28a745'; // Vert pour événements futurs
        }
        return event;
      })
      .filter(event => {
        if (this.filterStatus === 'past') return new Date(event.date) < new Date(this.today);
        if (this.filterStatus === 'current') return new Date(event.date).toDateString() === new Date(this.today).toDateString();
        if (this.filterStatus === 'upcoming') return new Date(event.date) > new Date(this.today);
        return true;
      })
      .map(event => ({
        title: event.title,
        start: event.date,
        color: event.couleur
      }));
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    height: 'auto',
    contentHeight: 400,
    aspectRatio: 1.5,
    headerToolbar: {
    },
    events: this.getFilteredEvents(),
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor() {}

  ngOnInit(): void {
    this.updateCalendarEvents();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
  }

 

  // Met à jour le calendrier avec les événements filtrés
  updateCalendarEvents() {
    this.calendarOptions.events = this.getFilteredEvents();
  }

  // Appliquer un filtre et mettre à jour les événements
  filterEvents(status: string) {
    this.filterStatus = status;
    this.updateCalendarEvents();
  }

  handleDateClick(info: any) {
    this.selectedEvent = null;
  }

  handleEventClick(info: any) {
    const event = this.events.find(e => e.title === info.event.title && e.date === info.event.startStr);
    this.selectedEvent = event ? event : null;
  }
}

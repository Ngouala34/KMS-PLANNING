// calendar-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from 'src/app/services/user/user.service';
import { IBookingResponse } from 'src/app/Interfaces/iservice';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
})
export class CalendarPageComponent implements OnInit {
  bookings: IBookingResponse[] = [];
  selectedBookings: IBookingResponse[] = [];
  selectedDate: string | null = null;
  
  // Statistiques
  monthlyStats = { total: 0 };
  weeklyStats = { total: 0 };
  todayStats = { total: 0 };
  activeExperts = 0;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    firstDay: 1, // Lundi comme premier jour
    headerToolbar: false, // Désactiver la barre d'outils par défaut
    height: 'auto',
    events: [],
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDidMount: this.onEventMount.bind(this),
    dayCellDidMount: this.onDayCellMount.bind(this),
    // Couleurs et styles personnalisés
    eventClassNames: ['custom-event'],
    dayMaxEvents: 3, // Limite d'événements par jour
    moreLinkClick: 'popover',
    // Configuration responsive
    windowResize: this.handleWindowResize.bind(this)
  };

  constructor(private userService: UserService, private router : Router) {}

  ngOnInit(): void {
    this.loadBookings();
    this.setTodayAsSelected();
  }

  loadBookings(): void {
    this.userService.getUserBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.updateCalendarEvents();
        this.calculateStats();
      },
      error: (err) => console.error('Erreur récupération bookings', err),
    });
  }

  updateCalendarEvents(): void {
    const events: EventInput[] = this.bookings.map(booking => {
      const startDateTime = new Date(`${booking.service.date}T${booking.service.start_time}`);
      const endDateTime = new Date(`${booking.service.date}T${booking.service.end_time}`);
      
      return {
        id: booking.id?.toString(),
        title: `${booking.service.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: this.getEventColor(booking.service.preferred_platform!),
        borderColor: this.getEventColor(booking.service.preferred_platform!),
        textColor: '#ffffff',
        extendedProps: {
          expertName: booking.expert.name,
          platform: booking.service.preferred_platform,
          booking: booking
        }
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  getEventColor(platform: string): string {
    const colors: { [key: string]: string } = {
      'Zoom': '#4f46e5',
      'Teams': '#10b981',
      'Présentiel': '#f59e0b',
      'Meet': '#ef4444',
      'Phone': '#8b5cf6'
    };
    return colors[platform] || '#64748b';
  }

  onDateClick(info: any): void {
    this.selectedDate = info.dateStr;
    this.selectedBookings = this.bookings.filter(b => b.service.date === info.dateStr);
    this.highlightSelectedDate(info.dateStr);
  }

  onEventClick(info: any): void {
    const booking = info.event.extendedProps.booking;
    this.selectedDate = booking.service.date;
    this.selectedBookings = this.bookings.filter(b => b.service.date === booking.service.date);
    
    // Optionnel: ouvrir une modal avec les détails
    this.openAppointmentDetails(booking);
  }

  onEventMount(info: any): void {
    // Personnaliser l'apparence des événements
    const element = info.el;
    element.style.borderRadius = '6px';
    element.style.border = 'none';
    element.style.fontSize = '0.85rem';
    element.style.fontWeight = '500';
    
    // Ajouter tooltip
    element.title = `${info.event.title} avec ${info.event.extendedProps.expertName}`;
  }

  onDayCellMount(info: any): void {
    // Personnaliser l'apparence des cellules de jour
    const element = info.el;
    const date = info.date.toISOString().split('T')[0];
    
    // Marquer les jours avec rendez-vous
    if (this.bookings.some(b => b.service.date === date)) {
      element.classList.add('has-appointments');
    }
    
    // Marquer aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
      element.classList.add('today');
    }
  }

  highlightSelectedDate(dateStr: string): void {
    // Retirer la classe selected de tous les éléments
    document.querySelectorAll('.fc-day.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Ajouter la classe selected à la date cliquée
    const selectedElement = document.querySelector(`[data-date="${dateStr}"]`);
    if (selectedElement) {
      selectedElement.classList.add('selected');
    }
  }

  setTodayAsSelected(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate = today;
    this.selectedBookings = this.bookings.filter(b => b.service.date === today);
  }

  StartMeet(booking: IBookingResponse): void {
    if (booking.service.meeting_link) {
      window.open(booking.service.meeting_link, '_blank');
    } else {
      alert('Aucun lien de réunion disponible pour ce rendez-vous.');
    }
  }


  calculateStats(): void {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Stats du jour
    this.todayStats.total = this.bookings.filter(b => b.service.date === today).length;
    
    // Stats de la semaine
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    this.weeklyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(b.service.date);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }).length;
    
    // Stats du mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.monthlyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(b.service.date);
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    }).length;
    
    // Nombre d'experts actifs
    const uniqueExperts = new Set(this.bookings.map(b => b.expert.name));
    this.activeExperts = uniqueExperts.size;
  }

  formatSelectedDate(dateStr: string | null): string {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    
    return date.toLocaleDateString('fr-FR', options);
  }

  handleWindowResize(): void {
    // Adapter la vue selon la taille de l'écran
    if (window.innerWidth < 768) {
      this.calendarOptions.initialView = 'listWeek';
    } else {
      this.calendarOptions.initialView = 'dayGridMonth';
    }
  }

  // Fonctions pour les boutons d'action
  openNewAppointmentDialog(): void {
    this.router.navigateByUrl('/service-list')
  }

  openFilterDialog(): void {
    // Implémenter l'ouverture d'une modal pour filtrer
    console.log('Ouvrir dialog filtre');
  }

  exportCalendar(): void {
    // Implémenter l'export du calendrier
    this.generateCalendarExport();
  }

  openAppointmentDetails(booking: IBookingResponse): void {
    // Implémenter l'ouverture des détails d'un RDV
    console.log('Ouvrir détails RDV:', booking);
  }

  private generateCalendarExport(): void {
    const csvContent = this.bookings.map(booking => [
      booking.service.date,
      booking.service.start_time,
      booking.service.end_time,
      booking.service.name,
      booking.expert.name,
      booking.service.preferred_platform
    ]);
    
    const headers = ['Date', 'Heure début', 'Heure fin', 'Service', 'Expert', 'Plateforme'];
    const csvData = [headers, ...csvContent];
    
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier-rdv-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  }
}
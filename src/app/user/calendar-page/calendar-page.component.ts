// calendar-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { IBookingResponse } from 'src/app/Interfaces/iservice';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
    this.setTodayAsSelected();
  }

  loadBookings(): void {
    this.userService.getUserBookings().subscribe({
      next: (data) => {
        console.log('Données reçues user:', data);
        console.log('Nombre de bookings user:', data.length);
        
        if (data && data.length > 0) {
          console.log('Premier booking user:', data[0]);
          console.log('Date du service:', data[0].service.date);
        }
        
        this.bookings = data;
        this.updateCalendarEvents();
        this.calculateStats();
      },
      error: (err) => {
        console.error('Erreur récupération bookings user', err);
        console.error('Détails erreur:', err.error);
      },
    });
  }

  // Fonction pour gérer les dates null - utiliser created_at comme fallback
  private getBookingDate(booking: IBookingResponse): string {
    // Si la date du service est null, utiliser la date de création
    if (booking.service.date) {
      return this.convertDateFormat(booking.service.date);
    } else if (booking.created_at) {
      // Extraire la date partie de created_at (YYYY-MM-DD)
      return booking.created_at.split('T')[0];
    } else {
      // Fallback sur aujourd'hui
      return new Date().toISOString().split('T')[0];
    }
  }

  // Fonction pour convertir le format de date si nécessaire
  private convertDateFormat(dateString: string): string {
    if (!dateString) return '';
    
    // Vérifier si le format est DD-MM-YYYY
    const parts = dateString.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY → YYYY-MM-DD
    }
    
    return dateString; // Retourner tel quel si déjà YYYY-MM-DD
  }

  updateCalendarEvents(): void {
    const events = this.bookings.map(booking => {
      console.log('Processing user booking:', booking);
      
      // Vérification des données requises
      if (!booking.service) {
        console.warn('Booking sans service:', booking);
        return null;
      }
      
      // Obtenir la date (avec fallback pour les dates null)
      const bookingDate = this.getBookingDate(booking);
      console.log('Date utilisée pour le booking:', bookingDate);
      
      // Si pas d'heure de début/fin, utiliser des valeurs par défaut
      const startTime = booking.service.start_time ? 
        booking.service.start_time.split(':').slice(0, 2).join(':') : '09:00';
      const endTime = booking.service.end_time ? 
        booking.service.end_time.split(':').slice(0, 2).join(':') : '10:00';
      
      const startDateTime = new Date(`${bookingDate}T${startTime}`);
      const endDateTime = new Date(`${bookingDate}T${endTime}`);
      
      console.log('Start DateTime:', startDateTime);
      console.log('End DateTime:', endDateTime);
      
      // Vérification de validité des dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn('Date/heure invalide pour booking user:', booking);
        return null;
      }
      
      return {
        id: booking.id?.toString(),
        title: `${booking.service.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: this.getEventColor(booking.service.preferred_platform),
        borderColor: this.getEventColor(booking.service.preferred_platform),
        textColor: '#ffffff',
        extendedProps: {
          expertName: booking.expert.name,
          platform: booking.service.preferred_platform,
          booking: booking
        }
      };
    }).filter(event => event !== null) as EventInput[];

    console.log('Événements user générés:', events);
    
    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  getEventColor(platform: string): string {
    const colors: { [key: string]: string } = {
      'google_meet': '#ef4444',
      'zoom': '#4f46e5',
      'teams': '#10b981',
      'présentiel': '#f59e0b',
      'phone': '#8b5cf6'
    };
    return colors[platform] || '#64748b';
  }

  onDateClick(info: any): void {
    this.selectedDate = info.dateStr;
    
    // Filtrer les bookings par date (avec gestion des dates null)
    this.selectedBookings = this.bookings.filter(b => {
      const bookingDate = this.getBookingDate(b);
      return bookingDate === info.dateStr;
    });
    
    console.log('Date sélectionnée user:', info.dateStr);
    console.log('Bookings correspondants user:', this.selectedBookings);
    
    this.highlightSelectedDate(info.dateStr);
  }

  onEventClick(info: any): void {
    const booking = info.event.extendedProps.booking;
    console.log('Event click user - booking:', booking);
    
    this.selectedDate = this.getBookingDate(booking);
    this.selectedBookings = this.bookings.filter(b => 
      this.getBookingDate(b) === this.selectedDate
    );
    
    this.openAppointmentDetails(booking);
  }

  onEventMount(info: any): void {
    const element = info.el;
    element.style.borderRadius = '6px';
    element.style.border = 'none';
    element.style.fontSize = '0.85rem';
    element.style.fontWeight = '500';
    
    element.title = `${info.event.title} avec ${info.event.extendedProps.expertName}`;
  }

  onDayCellMount(info: any): void {
    const element = info.el;
    const date = info.date.toISOString().split('T')[0];
    
    // Marquer les jours avec rendez-vous (avec gestion des dates null)
    const hasAppointments = this.bookings.some(b => 
      this.getBookingDate(b) === date
    );
    
    if (hasAppointments) {
      element.classList.add('has-appointments');
    }
    
    // Marquer aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
      element.classList.add('today');
    }
  }

  highlightSelectedDate(dateStr: string): void {
    document.querySelectorAll('.fc-day.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    const selectedElement = document.querySelector(`[data-date="${dateStr}"]`);
    if (selectedElement) {
      selectedElement.classList.add('selected');
    }
  }

  setTodayAsSelected(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate = today;
    
    this.selectedBookings = this.bookings.filter(b => 
      this.getBookingDate(b) === today
    );
    
    console.log('Aujourd\'hui user:', today);
    console.log('RDVs aujourd\'hui user:', this.selectedBookings);
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
    const todayFormatted = now.toISOString().split('T')[0];
    
    console.log('Aujourd\'hui formaté pour stats user:', todayFormatted);
    
    // Stats du jour (avec gestion des dates null)
    this.todayStats.total = this.bookings.filter(b => {
      const bookingDate = this.getBookingDate(b);
      return bookingDate === todayFormatted;
    }).length;
    
    // Stats de la semaine (avec gestion des dates null)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    this.weeklyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(this.getBookingDate(b));
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }).length;
    
    // Stats du mois (avec gestion des dates null)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.monthlyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(this.getBookingDate(b));
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    }).length;
    
    // Nombre d'experts actifs
    const uniqueExperts = new Set(this.bookings.map(b => b.expert.name));
    this.activeExperts = uniqueExperts.size;
    
    console.log('Stats user calculées - Aujourd\'hui:', this.todayStats.total);
    console.log('Stats user calculées - Semaine:', this.weeklyStats.total);
    console.log('Stats user calculées - Mois:', this.monthlyStats.total);
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
    if (window.innerWidth < 768) {
      this.calendarOptions.initialView = 'listWeek';
    } else {
      this.calendarOptions.initialView = 'dayGridMonth';
    }
  }

  // Fonctions pour les boutons d'action
  openNewAppointmentDialog(): void {
    this.router.navigateByUrl('/service-list');
  }

  openFilterDialog(): void {
    console.log('Ouvrir dialog filtre user');
  }

  exportCalendar(): void {
    this.generateCalendarExport();
  }

  openAppointmentDetails(booking: IBookingResponse): void {
    console.log('Ouvrir détails RDV user:', booking);
  }

  private generateCalendarExport(): void {
    const csvContent = this.bookings.map(booking => [
      this.getBookingDate(booking), // Utiliser la date calculée
      booking.service.start_time || 'Non spécifié',
      booking.service.end_time || 'Non spécifié',
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
    a.download = `calendrier-rdv-user-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  }
}
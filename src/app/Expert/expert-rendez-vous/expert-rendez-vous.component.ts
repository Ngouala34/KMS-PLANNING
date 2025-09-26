// calendar-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { IBookingResponse, IService } from 'src/app/Interfaces/iservice';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router } from '@angular/router';
import { ExpertService } from 'src/app/services/expert/expert.service';

@Component({
  selector: 'app-expert-rendez-vous',
  templateUrl: './expert-rendez-vous.component.html',
  styleUrls: ['./expert-rendez-vous.component.scss'],
})
export class ExpertRendezVousComponent implements OnInit {
  bookings: IService[] = [];
  selectedBookings: IService[] = [];
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

  constructor(private expertService: ExpertService, private router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
    this.setTodayAsSelected();
  }

  loadBookings(): void {
    this.expertService.getAllServices().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        console.log('Nombre de bookings:', data.length);
        
        if (data && data.length > 0) {
          console.log('Premier booking:', data[0]);
          console.log('Date du premier booking:', data[0].date);
          console.log('Heure début:', data[0].start_time);
        }
        
        this.bookings = data;
        this.updateCalendarEvents();
        this.calculateStats();
      },
      error: (err) => {
        console.error('Erreur récupération bookings', err);
        console.error('Détails erreur:', err.error);
      },
    });
  }

  // Fonction pour convertir le format de date DD-MM-YYYY en YYYY-MM-DD
  private convertDateFormat(dateString: string): string {
    if (!dateString) return '';
    
    // Convertir "22-09-2025" en "2025-09-22"
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Vérifier si le format est DD-MM-YYYY (le jour a 2 chiffres)
      if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    return dateString; // Retourner tel quel si format non reconnu
  }

  // Fonction utilitaire pour formater les dates en YYYY-MM-DD
  private formatDateForComparison(date: Date): string {
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  updateCalendarEvents(): void {
    // CORRECTION : Filtrer les null avant de définir le type
    const events = this.bookings.map(booking => {
      console.log('Processing booking:', booking);
      
      // Vérification des données requises
      if (!booking.date || !booking.start_time || !booking.end_time) {
        console.warn('Booking avec données manquantes:', booking);
        return null;
      }
      
      // CONVERSION DE LA DATE
      const convertedDate = this.convertDateFormat(booking.date);
      console.log('Date originale:', booking.date, '→ convertie:', convertedDate);
      
      // Nettoyage des heures (enlever les secondes si présentes)
      const startTime = booking.start_time.split(':').slice(0, 2).join(':');
      const endTime = booking.end_time.split(':').slice(0, 2).join(':');
      
      const startDateTime = new Date(`${convertedDate}T${startTime}`);
      const endDateTime = new Date(`${convertedDate}T${endTime}`);
      
      console.log('Start DateTime:', startDateTime);
      console.log('End DateTime:', endDateTime);
      
      // Vérification de validité des dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn('Date/heure invalide pour booking:', booking);
        return null;
      }
      
      return {
        id: booking.id?.toString(),
        title: `${booking.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: this.getEventColor(booking.preferred_platform),
        borderColor: this.getEventColor(booking.preferred_platform),
        textColor: '#ffffff',
        extendedProps: {
          expertName: booking.expert?.name || 'Non spécifié',
          platform: booking.preferred_platform,
          booking: booking
        }
      };
    }).filter(event => event !== null) as EventInput[]; // CORRECTION : Filtrer et typer

    console.log('Événements générés:', events);
    
    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  getEventColor(platform: string): string {
    const colors: { [key: string]: string } = {
      'google_meet': '#ef4444',    // Meet → google_meet
      'zoom': '#4f46e5',           // Zoom → zoom
      'teams': '#10b981',          // Teams → teams
      'présentiel': '#f59e0b',     // Présentiel
      'phone': '#8b5cf6'           // Phone
    };
    return colors[platform] || '#64748b';
  }

  onDateClick(info: any): void {
    this.selectedDate = info.dateStr;
    
    // Comparer avec les dates converties
    this.selectedBookings = this.bookings.filter(b => 
      this.convertDateFormat(b.date) === info.dateStr
    );
    
    console.log('Date sélectionnée:', info.dateStr);
    console.log('Bookings correspondants:', this.selectedBookings);
    
    this.highlightSelectedDate(info.dateStr);
  }

  onEventClick(info: any): void {
    const booking = info.event.extendedProps.booking;
    console.log('Event click - booking:', booking);
    
    // CORRECTION : utiliser booking.date directement
    this.selectedDate = this.convertDateFormat(booking.date);
    this.selectedBookings = this.bookings.filter(b => 
      this.convertDateFormat(b.date) === this.selectedDate
    );
    
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
    element.title = `${info.event.title} - ${info.event.extendedProps.expertName}`;
  }

  onDayCellMount(info: any): void {
    // Personnaliser l'apparence des cellules de jour
    const element = info.el;
    const date = info.date.toISOString().split('T')[0];
    
    // Marquer les jours avec rendez-vous (avec conversion de date)
    const hasAppointments = this.bookings.some(b => 
      this.convertDateFormat(b.date) === date
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
    const today = this.formatDateForComparison(new Date()); // YYYY-MM-DD
    this.selectedDate = today;
    
    this.selectedBookings = this.bookings.filter(b => 
      this.convertDateFormat(b.date) === today
    );
    
    console.log('Aujourd\'hui:', today);
    console.log('RDVs aujourd\'hui:', this.selectedBookings);
  }

  StartMeet(booking: IService): void {
    if (booking.meeting_link) {
      window.open(booking.meeting_link, '_blank');
    } else {
      alert('Aucun lien de réunion disponible pour ce rendez-vous.');
    }
  }

  calculateStats(): void {
    const now = new Date();
    const todayFormatted = this.formatDateForComparison(now);
    
    console.log('Aujourd\'hui formaté pour stats:', todayFormatted);
    
    // Stats du jour (avec dates converties)
    this.todayStats.total = this.bookings.filter(b => {
      const bookingDate = this.convertDateFormat(b.date);
      return bookingDate === todayFormatted;
    }).length;
    
    // Stats de la semaine (avec dates converties)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lundi
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
    
    this.weeklyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(this.convertDateFormat(b.date));
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }).length;
    
    // Stats du mois (avec dates converties)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.monthlyStats.total = this.bookings.filter(b => {
      const bookingDate = new Date(this.convertDateFormat(b.date));
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    }).length;
    
    console.log('Stats calculées - Aujourd\'hui:', this.todayStats.total);
    console.log('Stats calculées - Semaine:', this.weeklyStats.total);
    console.log('Stats calculées - Mois:', this.monthlyStats.total);
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
    this.router.navigateByUrl('/service-list');
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
      booking.date,
      booking.start_time,
      booking.end_time,
      booking.name,
      booking.expert?.name || 'Non spécifié',
      booking.preferred_platform
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
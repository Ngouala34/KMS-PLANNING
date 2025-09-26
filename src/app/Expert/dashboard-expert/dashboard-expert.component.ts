import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { ExpertService } from 'src/app/services/expert/expert.service';

interface DashboardStats {
  coursesCreated: number;
  participantsEnrolled: number;
  revenueGenerated: number;
  upcomingSessions: number;
}

interface Course {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  subscriptions: number;
  price: number;
  // Ajoutez d'autres propriétés selon les besoins
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  clientName: string;
  // Ajoutez d'autres propriétés selon les besoins
}

@Component({
  selector: 'app-expert-dashboard',
  templateUrl: './dashboard-expert.component.html',
  styleUrls: ['./dashboard-expert.component.scss']
})
export class DashboardExpertComponent implements OnInit {
  // État de la sidebar
  isSidebarCollapsed: boolean = false;
  
  // Données statistiques
  stats: DashboardStats = {
    coursesCreated: 0,
    participantsEnrolled: 0,
    revenueGenerated: 0,
    upcomingSessions: 0
  };

  // Liste des cours/formations
  courses: Course[] = [];
  
  // Prochains rendez-vous
  upcomingAppointments: Appointment[] = [];
  
  // Catégories disponibles
  categories: string[] = [];
  
  // Chargement des données
  isLoading: boolean = true;
  error: string | null = null;
  totalServices: number = 0;


  constructor(
    private router: Router, 
    private courseService: CourseService,
    private expertService: ExpertService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadCategories();
    this.lordservices();
  }

  upcomingServices: number = 0;    // Services à venir

  lordservices(): void {
    this.expertService.getAllServices().subscribe({
      next: (services) => {
        this.totalServices = services.length;

        const today = new Date();

        // Filtrer les services dont la date est ultérieure à aujourd'hui
        this.upcomingServices = services.filter((service: any) => {
          if (!service.date) return false;

          // Convertir "dd-MM-yyyy" en objet Date
          const [day, month, year] = service.date.split("-").map(Number);
          const serviceDate = new Date(year, month - 1, day);

          return serviceDate > today; // service futur
        }).length;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des services :", err);
      }
    });
  }


  // Charger les données du dashboard
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // À remplacer par des appels API réels
    this.mockLoadStats();
    this.mockLoadCourses();
    
    this.isLoading = false;
  }

  // Charger les catégories
  private loadCategories(): void {
    // À remplacer par un appel API
    this.categories = [
      'Développement Web', 
      'Marketing Digital', 
      'Design', 
      'Business', 
      'Photographie'
    ];
  }

  // --- Méthodes mockées pour la préparation API ---

  private mockLoadStats(): void {
    // Remplacer par: this.courseService.getDashboardStats().subscribe(...)
    setTimeout(() => {
      this.stats = {
        coursesCreated: 0,
        participantsEnrolled: 0,
        revenueGenerated: 0,
        upcomingSessions: 0
      };
    }, 500);
  }

  // --- Méthodes d'action ---

  onCreateCourse(): void {
    this.router.navigate(['/create-course']);
  }

  // Méthode pour gérer la sélection d'une image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Traitement du fichier si nécessaire
    }
  }



  // Ajoutez cette propriété pour gérer l'affichage limité
displayedCourses: Course[] = [];
coursesToShow = 4; // Nombre de cours à afficher initialement

// Dans mockLoadCourses(), modifiez pour trier par date
private mockLoadCourses(): void {

     setTimeout(() => {
      this.courses = [
        {
          id: '1',
          title: 'Développement WordPress',
          imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
          date: '12/02/2023',
          subscriptions: 24,
          price: 80
        }
        // Ajouter d'autres cours si nécessaire
      ];
    }, 700);

  setTimeout(() => {
    this.courses = [
      {
        id: '1',
        title: 'Développement WordPress',
        imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
        date: '2023-12-02', // Modifiez le format de date pour faciliter le tri
        subscriptions: 24,
        price: 80
      },
      // Ajoutez d'autres exemples avec des dates différentes
      {
        id: '2',
        title: 'Angular Avancé',
        imageUrl: 'https://example.com/angular.jpg',
        date: '2023-11-15',
        subscriptions: 15,
        price: 100
      },
      {
        id: '3',
        title: 'Marketing Digital',
        imageUrl: 'https://example.com/marketing.jpg',
        date: '2023-12-20',
        subscriptions: 30,
        price: 70
      },
      {
        id: '4',
        title: 'Design UI/UX',
        imageUrl: 'https://example.com/design.jpg',
        date: '2023-11-10',
        subscriptions: 20,
        price: 90
      },
      {
        id: '5',
        title: 'Data Science',
        imageUrl: 'https://example.com/datascience.jpg',
        date: '2023-12-05',
        subscriptions: 18,
        price: 120
      }
    ];

    // Triez les cours par date croissante
    this.courses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Formatez la date pour l'affichage
    this.courses.forEach(course => {
      course.date = this.formatDate(course.date);
    });
    
    // Initialisez les cours à afficher
    this.displayedCourses = this.courses.slice(0, this.coursesToShow);
  }, 700);
}

// Ajoutez cette méthode pour formater la date
private formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR'); // Format français
}

// Ajoutez cette méthode pour voir plus de formations
showMoreCourses(): void {
  this.router.navigate(['/mes-formations']); // Adaptez la route selon votre configuration
}
}
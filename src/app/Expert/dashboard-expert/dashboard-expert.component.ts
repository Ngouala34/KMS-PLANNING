import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-expert-dashboard',
  templateUrl: './dashboard-expert.component.html',
  styleUrls: ['./dashboard-expert.component.scss']
})
export class DashboardExpertComponent implements OnInit {

  collapsedByDefault = true; // Indique si la sidebar est réduite au départ
  isSidebarCollapsed = true;
  isModalOpen = false;

  course = {
    title: '',
    category: '',
    price: 0,
    duration: 0,
    description: '',
    coverImage: ''
  };

  categories = ['Développement Web', 'Marketing Digital', 'Design', 'Business', 'Photographie'];


  constructor(private router : Router, private courseService: CourseService) { }
  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault;
  }

  service = {
    imageUrl: 'https://i.pinimg.com/736x/cf/f5/e1/cff5e1cba8964bcaeaee87cf0eaecb59.jpg',
    expertProfil: 'https://i.pinimg.com/736x/a8/ba/96/a8ba9626de3fadff0b38e1c83cdea435.jpg',
    expertName: 'Rehan',
    title: ' Développement WordPress',
    description: 'Je suis un développeur WordPress et j\'aime créer des sites Web WordPress personnalisés et réactifs.',
    avarage: 4.2,
    ratingCount: 120,
    souscriptions : 24,
    price: 80,
    date: '12/02/202',
  };

  // Méthode pour gérer la sélection d'une image
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.coverImage = file;
    }
  }

  // Méthode pour envoyer les données du formulaire à l'API
  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.course.title);
    formData.append('category', this.course.category);
    formData.append('price', this.course.price.toString());
    formData.append('duration', this.course.duration.toString());
    formData.append('description', this.course.description);
    formData.append('coverImage', this.course.coverImage);

    this.courseService.createCourse(formData).subscribe(
      (      response: any) => {
        console.log('Formation ajoutée :', response);
        alert('Formation créée avec succès!');
        this.close(); // Fermer le modal après envoi
      },
      (      error: any) => {
        console.error('Erreur lors de la création de la formation', error);
        alert('Une erreur est survenue lors de la création de la formation.');
      }
    );
  }

  // Méthode pour fermer le modal
  close() {
    this.isModalOpen = false;
  }
  onCreateCourse() : void {
this.router.navigateByUrl('create-course');
  }
  

}
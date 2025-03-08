import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service'; // Import du service

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent {

  course = {
    title: '',
    category: '',
    price: 0,
    duration: 0,
    description: '',
    coverImage: ''
  };

  categories = ['Développement Web', 'Marketing Digital', 'Design', 'Business', 'Photographie'];

  constructor(private courseService: CourseService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.coverImage = file;
    }
  }

  onSubmit() {
    // Créer un objet FormData pour envoyer des données avec des fichiers
    const formData = new FormData();
    formData.append('title', this.course.title);
    formData.append('category', this.course.category);
    formData.append('price', this.course.price.toString());
    formData.append('duration', this.course.duration.toString());
    formData.append('description', this.course.description);
    formData.append('coverImage', this.course.coverImage);

    // Appel au service pour envoyer les données à l'API
    this.courseService.createCourse(formData).subscribe(
      response => {
        console.log('Formation ajoutée :', response);
        alert('Formation créée avec succès!');
      },
      error => {
        console.error('Erreur lors de la création de la formation', error);
        alert('Une erreur est survenue lors de la création de la formation.');
      }
    );
  }
}

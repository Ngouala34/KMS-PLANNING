import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://127.0.0.1:8000/api/services/'; // URL de l'API (à modifier selon ton backend)

  constructor(private http: HttpClient) { }

  // Méthode pour envoyer une formation
  createCourse(courseData: any): Observable<any> {
    return this.http.post(this.apiUrl, courseData); // Envoi de la formation à l'API
  }
}
